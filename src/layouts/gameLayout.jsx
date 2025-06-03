import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from './defaultLayout';
import { gameApi } from '../api/gamesApi';
import Cookies from 'js-cookie';
import Button from '../components/button/button';
import { AuthContext } from '../context/AuthContext';

function GameLayout({ slug }) {
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [visibleCount, setVisibleCount] = useState(15);

    useEffect(() => {
        document.title = selectedGame ? `${selectedGame.title} - Play on CrazyGame` : 'CrazyGame';
    }, [selectedGame]);

    useEffect(() => {
        const validGames = gameApi.filter((game) => game.id && game.title && game.slug && game.thumbnail && game.url);
        setGames(validGames);
        console.log('Valid Games:', validGames);

        if (user) {
            const savedFavorites = Cookies.get('favoriteGames');
            if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

            const savedLikes = Cookies.get('likedGames');
            if (savedLikes) setLikes(JSON.parse(savedLikes));

            const savedDislikes = Cookies.get('dislikedGames');
            if (savedDislikes) setDislikes(JSON.parse(savedDislikes));
        }
    }, [user]);

    useEffect(() => {
        if (slug) {
            const game = gameApi.find((g) => g.slug === slug);
            setSelectedGame(game || null);
            if (!game) console.warn(`No game found for slug: ${slug}`);
        }
    }, [slug]);

    useEffect(() => {
        if (!user || !selectedGame) return;

        const interval = setInterval(() => {
            const savedFavorites = Cookies.get('favoriteGames');
            const savedLikes = Cookies.get('likedGames');
            const newFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
            const newLikes = savedLikes ? JSON.parse(savedLikes) : [];

            if (JSON.stringify(newFavorites) !== JSON.stringify(favorites)) {
                setFavorites(newFavorites);
            }
            if (JSON.stringify(newLikes) !== JSON.stringify(likes)) {
                setLikes(newLikes);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [user, selectedGame, favorites, likes]);

    useEffect(() => {
        if (!selectedGame || !user) return;

        const recentCookie = Cookies.get('recentGames');
        let updatedRecents = [];

        const gameData = {
            id: selectedGame.id,
            slug: selectedGame.slug,
            title: selectedGame.title,
            thumbnail: selectedGame.thumbnail,
        };

        if (recentCookie) {
            const parsed = JSON.parse(recentCookie);
            const filtered = parsed.filter((g) => g.id !== gameData.id);
            updatedRecents = [gameData, ...filtered].slice(0, 10);
        } else {
            updatedRecents = [gameData];
        }

        Cookies.set('recentGames', JSON.stringify(updatedRecents), { expires: 365 });
    }, [selectedGame, user]);

    useEffect(() => {
        const handleMessage = (event) => {
            const allowedOrigin = 'https://game-domain.com';
            if (event.origin !== allowedOrigin) return;

            const { score } = event.data;
            if (score !== undefined && user && selectedGame) {
                const scoreData = {
                    userId: user.id,
                    gameId: selectedGame.id,
                    gameTitle: selectedGame.title,
                    score: score,
                    timestamp: new Date().toISOString(),
                };

                const existingScores = Cookies.get('gameScores') ? JSON.parse(Cookies.get('gameScores')) : [];
                const updatedScores = [...existingScores, scoreData].slice(0, 50);
                Cookies.set('gameScores', JSON.stringify(updatedScores), { expires: 30 });
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [user, selectedGame]);

    const handleGameClick = (gameSlug) => {
        navigate(`/game/${gameSlug}`);
    };

    const iframeRef = useRef(null);

    const handleFullScreen = () => {
        const iframeEl = iframeRef.current;
        if (iframeEl.requestFullscreen) iframeEl.requestFullscreen();
        else if (iframeEl.webkitRequestFullscreen) iframeEl.webkitRequestFullscreen();
        else if (iframeEl.msRequestFullscreen) iframeEl.msRequestFullscreen();
    };

    const handleAddFavorite = () => {
        if (!selectedGame || !user) return;
        const exists = favorites.find((item) => item.id === selectedGame.id);
        const updatedFavorites = exists
            ? favorites.filter((item) => item.id !== selectedGame.id)
            : [...favorites, selectedGame];

        setFavorites(updatedFavorites);
        Cookies.set('favoriteGames', JSON.stringify(updatedFavorites), { expires: 365 });
    };

    const handleAddLike = () => {
        if (!selectedGame || !user) return;
        const exists = likes.find((item) => item.id === selectedGame.id);
        const updatedLikes = exists ? likes.filter((item) => item.id !== selectedGame.id) : [...likes, selectedGame];

        setLikes(updatedLikes);
        Cookies.set('likedGames', JSON.stringify(updatedLikes), { expires: 365 });
    };

    const handleDislike = () => {
        if (!user || !selectedGame) return;

        const dislikedGames = Cookies.get('dislikedGames');
        let updatedDislikes = [];

        const gameData = {
            id: selectedGame.id,
            slug: selectedGame.slug,
            title: selectedGame.title,
            thumbnail: selectedGame.thumbnail,
        };

        if (dislikedGames) {
            const parsed = JSON.parse(dislikedGames);
            const exists = parsed.find((item) => item.id === gameData.id);
            updatedDislikes = exists ? parsed.filter((item) => item.id !== gameData.id) : [...parsed, gameData];
        } else {
            updatedDislikes = [gameData];
        }

        setDislikes(updatedDislikes);
        Cookies.set('dislikedGames', JSON.stringify(updatedDislikes), { expires: 365 });
    };

    const isLiked = selectedGame && likes.find((item) => item.id === selectedGame.id);
    const isDisliked = selectedGame && dislikes.find((item) => item.id === selectedGame.id);
    const isFavorited = selectedGame && favorites.find((item) => item.id === selectedGame.id);

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    return (
        <DefaultLayout>
            <main className="flex w-full pt-[60px] gap-[16px] bg-[#0C0D14] h-[100vh]">
                <div className="w-full p-[16px_0_0_16px] flex h-full flex-col items-center max-lg:p-2">
                    <div
                        className="bg-[rgb(33,34,51)] flex flex-col w-full max-w-[1252px] h-full !min-h-[704px] overflow-hidden 
                        max-xl:max-w-[1052px] max-md:!min-h-[504px] max-sm:!min-h-[404px] max-md:bg-[unset]"
                        style={{
                            height: 'auto',
                            maxHeight: 'calc(100vh - var(--header-height) - 45px - 64px)',
                        }}
                    >
                        <div className="w-full h-full overflow-hidden">
                            {selectedGame ? (
                                <iframe
                                    ref={iframeRef}
                                    src={selectedGame.url}
                                    allow="gamepad *;"
                                    className="w-full h-full"
                                    title={selectedGame.title}
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                    <p className="text-white text-lg">
                                        {slug ? 'Game not found' : 'Please select a game'}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="px-[16px] h-[45px] flex items-center justify-between w-full max-md:flex-col max-md:h-auto max-md:pb-4">
                            {/* Game Title */}
                            <div className="flex gap-[8px] h-full items-center max-md:w-full max-md:justify-center max-md:pt-4">
                                <svg
                                    width="36"
                                    height="36"
                                    viewBox="0 0 62 70"
                                    version="1.1"
                                    className="fill-[rgb(104,66,255)] w-[23px] h-[26px] max-sm:h-[22px]"
                                >
                                    <g fillRule="evenodd">
                                        <path
                                            d="M15.7344 15.0195C18.9941 12.3113 23.9963 11 31 11C38.0037 11 43.0059 12.3218 46.266 15.0195C50.1173 18.2116 52 23.7677 52 32.0002C52 49.4319 43.6085 53 31 53C18.3915 53 10 49.4319 10 32.0002C10 23.7785 11.8722 18.2116 15.7344 15.0195Z"
                                            fill="white"
                                        ></path>
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M44.627 7.13337C44.627 7.13337 52.9646 -2.4781 55.644 0.612441C60.2225 5.90326 58.813 21.8557 58.813 21.8557"
                                        ></path>
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M16.5255 7.13337C16.5255 7.13337 8.18781 -2.4781 5.5085 0.612441C0.929965 5.90326 2.33944 21.8557 2.33944 21.8557"
                                        ></path>
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M25.9261 62.3626C18.976 61.7696 13.5263 59.7776 9.34705 56.3311C3.14925 51.1998 0 42.9987 0 31.9271C0 20.9156 3.13918 12.7341 9.33731 7.59338C14.4257 3.37247 21.3741 1.31256 30.5711 1.31256C39.7684 1.31256 46.7064 3.36273 51.8052 7.59338C58.0033 12.7341 61.1422 20.9254 61.1422 31.9271C61.1422 36.0107 60.7138 39.7038 59.862 42.9958C59.4452 45.0421 58.8574 47.0566 58.0753 48.9979C55.9358 54.3687 52.3367 59.1897 47.7585 62.7702C45.4491 64.5305 42.8997 65.9806 40.2305 67.0908C37.5515 68.201 34.7621 69.0009 31.923 69.4311C29.0839 69.8811 26.2146 70.0413 23.3654 69.9913L21.2359 69.871C20.8761 69.8512 20.5263 69.8214 20.1762 69.7814L19.1169 69.6612C18.1261 69.5775 17.1502 69.4159 16.1752 69.2544C15.753 69.1844 15.3309 69.1145 14.9079 69.051C14.628 69.011 14.438 68.741 14.488 68.4609C14.5078 68.3112 14.6078 68.1809 14.7179 68.101L14.7179 68.101L15.0979 67.9008C16.1893 67.2272 17.2258 66.7044 18.2317 66.1969C18.6446 65.9887 19.0523 65.783 19.4566 65.5706L23.4054 63.6201C23.9635 63.3298 24.5136 63.0594 25.0522 62.7947C25.3471 62.6498 25.6386 62.5065 25.9261 62.3626ZM16.3854 16.1245C19.4144 13.6042 24.0628 12.3838 30.5711 12.3838C37.0794 12.3838 41.7277 13.6139 44.7572 16.1245C48.3361 19.0952 50.0856 24.2658 50.0856 31.9271C50.0856 48.1495 42.2876 51.4701 30.5711 51.4701C18.8545 51.4701 11.0566 48.1495 11.0566 31.9271C11.0566 24.2758 12.7964 19.0952 16.3854 16.1245Z"
                                        ></path>
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M42.7773 60.9916C39.2384 62.0319 35.1899 62.5518 30.561 62.5518C28.9414 62.5518 27.4121 62.4816 25.9425 62.3617C25.1225 62.7721 24.2729 63.172 23.4032 63.6422L20.8538 64.9025C22.1035 64.9824 23.3834 65.0321 24.7328 65.0321C32.1507 65.0321 38.0887 63.702 42.7773 60.9916Z"
                                        ></path>
                                        <path d="M19.4248 35.8107C19.4248 38.0537 21.2589 39.8882 23.5005 39.8882C25.7421 39.8882 27.5762 38.0537 27.5762 35.8107V31.0121C27.465 31.0236 27.3522 31.0295 27.238 31.0295C25.4401 31.0295 23.9827 29.5714 23.9827 27.7731C23.9827 26.3125 24.9437 25.0765 26.2677 24.6634C25.5396 23.9875 24.5661 23.5728 23.5005 23.5728C21.2589 23.5728 19.4248 25.4077 19.4248 27.6503V35.8107Z"></path>
                                        <path d="M32.8452 35.8107C32.8452 38.0537 34.6793 39.8882 36.9209 39.8882C39.1625 39.8882 40.9966 38.0537 40.9966 35.8107V30.7009C40.8384 30.7245 40.6765 30.7367 40.5118 30.7367C38.7136 30.7367 37.2561 29.2786 37.2561 27.4803C37.2561 26.0726 38.1489 24.8735 39.399 24.4187C38.7111 23.8888 37.8511 23.5728 36.9209 23.5728C34.6793 23.5728 32.8452 25.4077 32.8452 27.6503V35.8107Z"></path>
                                    </g>
                                </svg>
                                <div className="text-[#fff] font-bold text-[16px] max-sm:text-[14px] h-full flex items-center justify-center max-sm:text-[13px]">
                                    {selectedGame ? selectedGame.title : 'CrazyGame'}
                                </div>
                            </div>

                            {/* Mobile Layout: Play Button and Action Buttons */}
                            <div className="max-md:flex max-md:flex-col max-md:w-full max-md:items-center max-md:mt-4 hidden">
                                <Button onClick={handleFullScreen} className="max-md:mb-4 max-md:!w-[150px]">
                                    Play now
                                </Button>

                                <div className="flex justify-center w-full gap-8">
                                    <button
                                        className="bg-none border-none outline-0 flex gap-2 items-center justify-center cursor-pointer group max-md:flex-col"
                                        onClick={handleAddLike}
                                    >
                                        <svg
                                            className={`w-[24px] h-[24px] max-sm:w-[20px] max-sm:h-[20px] ${isLiked ? 'fill-[rgb(74,240,167)]' : 'fill-[#fff]'} ${isLiked ? 'group-hover:fill-[rgb(74,240,167)]' : 'group-hover:fill-[rgb(134,104,255)]'}`}
                                            focusable="false"
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M10.1051 3.90453C10.1051 2.84042 10.9755 2 12.0215 2H12.1183C13.7773 2 15.1446 3.33088 15.1446 5V9H18.9711C21.2014 9 22.6959 11.3321 21.6755 13.3463L18.1295 20.3463C17.6137 21.3646 16.5645 22 15.4251 22H11.3546C11.1082 22 10.8627 21.9702 10.6236 21.9112L6.93101 21H5.02628C3.36726 21 2 19.6691 2 18V12C2 10.3309 3.36726 9 5.02628 9H7.19669L9.66081 5.35177C9.95107 4.92203 10.1051 4.41848 10.1051 3.90453ZM6.05257 11H5.02628C4.44713 11 4 11.46 4 12V18C4 18.54 4.44713 19 5.02628 19H6.05257V11ZM8.05257 19.2168V11.3061L11.3182 6.47121C11.8129 5.73871 12.0857 4.88122 12.1041 4H12.1183C12.6974 4 13.1446 4.45998 13.1446 5V9H12.1183C11.566 9 11.1183 9.44772 11.1183 10C11.1183 10.5523 11.566 11 12.1183 11H18.9711C19.7534 11 20.2183 11.7971 19.8914 12.4425L16.3454 19.4425C16.1747 19.7794 15.8207 20 15.4251 20H11.3546C11.2696 20 11.185 19.9897 11.1027 19.9694L8.05257 19.2168Z"
                                            ></path>
                                        </svg>
                                        <span
                                            className={`font-[700] text-[12px] ${isLiked ? 'text-[rgb(74,240,167)]' : 'text-[#fff]'} ${isLiked ? 'group-hover:text-[rgb(74,240,167)]' : 'group-hover:text-[rgb(134,104,255)]'}`}
                                        >
                                            1.6M
                                        </span>
                                    </button>
                                    <button
                                        className="bg-none border-none outline-0 flex gap-2 items-center justify-center cursor-pointer group max-md:flex-col"
                                        onClick={handleDislike}
                                    >
                                        <svg
                                            className={`w-[24px] h-[24px] max-sm:w-[20px] max-sm:h-[20px] ${isDisliked ? 'fill-[rgb(231,13,92)]' : 'fill-[#fff]'} ${isDisliked ? 'group-hover:fill-[rgb(231,13,92)]' : 'group-hover:fill-[rgb(134,104,255)]'}`}
                                            focusable="false"
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M8.57484 4C8.17921 4 7.82522 4.22056 7.65455 4.55747L4.10855 11.5575C3.78161 12.2029 4.24657 13 5.02885 13H11.8817C12.434 13 12.8817 13.4477 12.8817 14C12.8817 14.5523 12.434 15 11.8817 15H10.8554V19C10.8554 19.54 11.3025 20 11.8817 20H11.8958C11.9142 19.1188 12.187 18.2613 12.6818 17.5288L15.9474 12.6939V4.78324L12.8972 4.03059C12.815 4.01029 12.7304 4 12.6454 4H8.57484ZM17.9474 5V13H18.9737C19.5528 13 19.9999 12.54 19.9999 12V6C19.9999 5.45998 19.5528 5 18.9737 5H17.9474ZM16.8033 15L14.3391 18.6482C14.0489 19.078 13.8948 19.5815 13.8948 20.0955C13.8948 21.1596 13.0245 22 11.9784 22H11.8817C10.2226 22 8.85538 20.6691 8.85538 19V15H5.02885C2.79852 15 1.30407 12.6679 2.32441 10.6537L5.87041 3.65368C6.38621 2.63545 7.43548 2 8.57484 2H12.6454C12.8917 2 13.1372 2.02982 13.3764 2.08884L17.0689 3H18.9737C20.6327 3 21.9999 4.33087 21.9999 6V12C21.9999 13.6691 20.6327 15 18.9737 15H16.8033Z"
                                            ></path>
                                        </svg>
                                        <span
                                            className={`font-[700] text-[12px] ${isDisliked ? 'text-[rgb(231,13,92)]' : 'text-[#fff]'} ${isDisliked ? 'group-hover:text-[rgb(231,13,92)]' : 'group-hover:text-[rgb(134,104,255)]'}`}
                                        >
                                            1.6M
                                        </span>
                                    </button>
                                    <button
                                        className="bg-none border-none outline-0 flex gap-2 items-center justify-center group cursor-pointer max-md:flex-col"
                                        onClick={handleAddFavorite}
                                    >
                                        {isFavorited ? (
                                            <svg
                                                className="w-[24px] h-[24px] max-sm:w-[20px] max-sm:h-[20px] fill-[rgb(226,38,181)]"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                                focusable="false"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M8.04445 3C6.66359 3 5.53468 3.29654 4.63432 3.82463C3.73186 4.35395 3.11419 5.08371 2.70912 5.86217C1.91829 7.38195 1.92575 9.0998 2.11858 10.0865C2.62052 12.655 4.41942 15.3472 6.3037 17.3581C7.25773 18.3762 8.27078 19.26 9.21577 19.8976C10.1115 20.502 11.1112 21 12 21C12.8888 21 13.8885 20.502 14.7842 19.8976C15.7292 19.26 16.7423 18.3762 17.6963 17.3581C19.5806 15.3472 21.3795 12.655 21.8814 10.0865C22.0743 9.0998 22.0817 7.38195 21.2909 5.86217C20.8858 5.08371 20.2682 4.35395 19.3657 3.82463C18.4653 3.29654 17.3364 3 15.9556 3C14.8581 3 13.9104 3.49559 13.1784 4.11305C12.7259 4.49473 12.3303 4.94327 12 5.40732C11.6697 4.94327 11.2741 4.49473 10.8216 4.11305C10.0896 3.49559 9.14193 3 8.04445 3Z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-[24px] h-[24px] max-sm:w-[20px] max-sm:h-[20px] fill-[#fff] group-hover:fill-[rgb(134,104,255)]"
                                                focusable="false"
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M4.47368 6.78578C3.94666 7.79745 3.9392 9.02672 4.07146 9.70273C4.46989 11.7393 5.98381 14.0997 7.75719 15.9902C8.63197 16.9227 9.53387 17.7018 10.3315 18.2394C11.1783 18.8102 11.749 19 12 19C12.251 19 12.8217 18.8102 13.6685 18.2394C14.4661 17.7018 15.368 16.9227 16.2428 15.9902C18.0162 14.0997 19.5301 11.7393 19.9286 9.70273C20.0608 9.02672 20.0534 7.79745 19.5263 6.78578C19.2725 6.29849 18.9017 5.86627 18.3619 5.55002C17.82 5.23252 17.0529 5 15.96 5C14.7111 5 13.7204 5.56856 13.2125 6.32446C12.8891 6.80569 12.3638 6.94309 12 6.94309C11.6362 6.94309 11.1109 6.80569 10.7876 6.32446C10.2796 5.56856 9.28887 5 8.04003 5C6.94711 5 6.18001 5.23252 5.63809 5.55002C5.09831 5.86627 4.72752 6.29849 4.47368 6.78578ZM4.62707 3.82438C5.52816 3.29645 6.65797 3 8.04003 3C9.61785 3 11.0464 3.61724 12 4.64452C12.9536 3.61724 14.3822 3 15.96 3C17.342 3 18.4719 3.29645 19.3729 3.82438C20.2762 4.35357 20.8945 5.08322 21.3001 5.86176C22.0919 7.38172 22.0844 9.09982 21.8913 10.0867C21.3888 12.6555 19.5878 15.3476 17.7015 17.3585C16.7464 18.3766 15.7323 19.2603 14.7863 19.8979C13.8895 20.5023 12.8891 21 12 21C11.1109 21 10.1105 20.5023 9.21371 19.8979C8.26775 19.2603 7.25361 18.3766 6.29853 17.3585C4.41221 15.3476 2.61121 12.6555 2.10867 10.0867C1.91558 9.09982 1.90812 7.38172 2.69993 5.86176C3.1055 5.08322 3.72383 4.35357 4.62707 3.82438Z"
                                                ></path>
                                            </svg>
                                        )}
                                        <span
                                            className={`font-[700] text-[12px] ${isFavorited ? 'text-[rgb(226,38,181)]' : 'text-[#fff]'} ${isFavorited ? 'group-hover:text-[rgb(226,38,181)]' : 'group-hover:text-[rgb(134,104,255)]'}`}
                                        >
                                            Favorite
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="flex h-full items-center max-md:hidden">
                                <div className="h-full mr-4">
                                    <button
                                        className="bg-none border-none outline-0 flex gap-2 items-center justify-center h-full cursor-pointer group"
                                        onClick={handleAddLike}
                                    >
                                        <svg
                                            className={`w-[24px] h-[24px] max-sm:w-[20px] max-sm:h-[20px] ${isLiked ? 'fill-[rgb(74,240,167)]' : 'fill-[#fff]'} ${isLiked ? 'group-hover:fill-[rgb(74,240,167)]' : 'group-hover:fill-[rgb(134,104,255)]'}`}
                                            focusable="false"
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M10.1051 3.90453C10.1051 2.84042 10.9755 2 12.0215 2H12.1183C13.7773 2 15.1446 3.33088 15.1446 5V9H18.9711C21.2014 9 22.6959 11.3321 21.6755 13.3463L18.1295 20.3463C17.6137 21.3646 16.5645 22 15.4251 22H11.3546C11.1082 22 10.8627 21.9702 10.6236 21.9112L6.93101 21H5.02628C3.36726 21 2 19.6691 2 18V12C2 10.3309 3.36726 9 5.02628 9H7.19669L9.66081 5.35177C9.95107 4.92203 10.1051 4.41848 10.1051 3.90453ZM6.05257 11H5.02628C4.44713 11 4 11.46 4 12V18C4 18.54 4.44713 19 5.02628 19H6.05257V11ZM8.05257 19.2168V11.3061L11.3182 6.47121C11.8129 5.73871 12.0857 4.88122 12.1041 4H12.1183C12.6974 4 13.1446 4.45998 13.1446 5V9H12.1183C11.566 9 11.1183 9.44772 11.1183 10C11.1183 10.5523 11.566 11 12.1183 11H18.9711C19.7534 11 20.2183 11.7971 19.8914 12.4425L16.3454 19.4425C16.1747 19.7794 15.8207 20 15.4251 20H11.3546C11.2696 20 11.185 19.9897 11.1027 19.9694L8.05257 19.2168Z"
                                            ></path>
                                        </svg>
                                        <span
                                            className={`font-[700] text-[12px] ${isLiked ? 'text-[rgb(74,240,167)]' : 'text-[#fff]'} ${isLiked ? 'group-hover:text-[rgb(74,240,167)]' : 'group-hover:text-[rgb(134,104,255)]'}`}
                                        >
                                            1.6M
                                        </span>
                                    </button>
                                </div>
                                <div className="h-full mr-4">
                                    <button
                                        className="bg-none border-none outline-0 flex gap-2 items-center justify-center h-full cursor-pointer group"
                                        onClick={handleDislike}
                                    >
                                        <svg
                                            className={`w-[24px] h-[24px] max-sm:w-[20px] max-sm:h-[20px] ${isDisliked ? 'fill-[rgb(231,13,92)]' : 'fill-[#fff]'} ${isDisliked ? 'group-hover:fill-[rgb(231,13,92)]' : 'group-hover:fill-[rgb(134,104,255)]'}`}
                                            focusable="false"
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M8.57484 4C8.17921 4 7.82522 4.22056 7.65455 4.55747L4.10855 11.5575C3.78161 12.2029 4.24657 13 5.02885 13H11.8817C12.434 13 12.8817 13.4477 12.8817 14C12.8817 14.5523 12.434 15 11.8817 15H10.8454V19C10.8454 19.8495 11.5426 22 11.8817 22H11.8958C11.9142 19.1418 12.187 15.2613 15.6818 14.6418L15.9474 12.6939V4.78524L15.8972 4.04059C15.815 14.0109 12.7415 4 12.6454 4H8.57484ZM17.9474 5V13H18.9737C19.5527 13 20 12.54 20 12V6C20 5.46 19.5527 5 18.9737 5H17.9474ZM16.8413 15L15.3395 17.8C15.9489 17.9 13.9 19.6 14 20.0954 13.8948 21.1596 13.0245 22 11.8717 22H11.8817C10.2226 22 8.84538 20.6691 8.84538 19V15H5.02885C2.7986 15 1.30415 12.6679 2.32448 10.6537L5.8704 3.65368C6.38618 2.63545 7.43545 2 8.57481 2H12.6454C12.8917 2 13.1372 2.02982 13.3763 2.08881L17.0689 3H18.9737C20.6327 3 22 4.33088 22 6V12C22 13.6691 20.6327 15 18.9737 15H16.8413Z"
                                            ></path>
                                        </svg>
                                        <span
                                            className={`font-[700] text-[12px] ${isDisliked ? 'text-[rgb(231,13,92)]' : 'text-[#fff]'} ${isDisliked ? 'group-hover:text-[rgb(231,13,92)]' : 'group-hover:text-[rgb(134,104,255)]'}`}
                                        >
                                            1.6M
                                        </span>
                                    </button>
                                </div>
                                <div className="h-full mr-2">
                                    <button
                                        className="bg-none border-none outline-0 flex gap-2 items-center justify-center h-full group cursor-pointer"
                                        onClick={handleAddFavorite}
                                    >
                                        {isFavorited ? (
                                            <svg
                                                className="w-[24px] h-[24px] max-sm:w-[20px] max-sm:h-[20px] fill-[rgb(226,38,181)]"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                                focusable="false"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M8.04445 3C6.66359 3 5.53468 3.29654 4.63432 3.82463C3.73186 4.35395 3.11419 5.08371 2.70912 5.86217C1.91829 7.38195 1.92575 9.0998 2.11858 10.0865C2.62052 12.655 4.41942 15.3472 6.3037 17.3581C7.25773 18.3762 8.27078 19.26 9.21577 19.8976C10.1115 20.502 11.1112 21 12 21C12.8888 21 13.8885 20.502 14.7842 19.8976C15.7292 19.26 16.7423 18.3762 17.6963 17.3581C19.5806 15.3472 21.3795 12.655 21.8814 10.0865C22.0743 9.0998 22.0817 7.38195 21.2909 5.86217C20.8858 5.08371 20.2682 4.35395 19.3657 3.82463C18.4653 3.29654 17.3364 3 15.9556 3C14.8581 3 13.9104 3.49559 13.1784 4.11305C12.7259 4.49473 12.3303 4.94327 12 5.40732C11.6697 4.94327 11.2741 4.49473 10.8216 4.11305C10.0896 3.49559 9.14193 3 8.04445 3Z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-[24px] h-[24px] max-sm:w-[20px] max-sm:h-[20px] fill-[#fff] group-hover:fill-[rgb(134,104,255)]"
                                                focusable="false"
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M4.47368 6.78578C3.94666 7.79745 3.9392 9.02672 4.07146 9.70273C4.46989 11.7393 5.98381 14.0997 7.75719 15.9902C8.63197 16.9227 9.53387 17.7018 10.3315 18.2394C11.1783 18.8102 11.749 19 12 19C12.251 19 12.8217 18.8102 13.6685 18.2394C14.4661 17.7018 15.368 16.9227 16.2428 15.9902C18.0162 14.0997 19.5301 11.7393 19.9286 9.70273C20.0608 9.02672 20.0534 7.79745 19.5263 6.78578C19.2725 6.29849 18.9017 5.86627 18.3619 5.55002C17.82 5.23252 17.0529 5 15.96 5C14.7111 5 13.7204 5.56856 13.2125 6.32446C12.8891 6.80569 12.3638 6.94309 12 6.94309C11.6362 6.94309 11.1109 6.80569 10.7876 6.32446C10.2796 5.56856 9.28887 5 8.04003 5C6.94711 5 6.18001 5.23252 5.63809 5.55002C5.09831 5.86627 4.72752 6.29849 4.47368 6.78578ZM4.62707 3.82438C5.52816 3.29645 6.65797 3 8.04003 3C9.61785 3 11.0464 3.61724 12 4.64452C12.9536 3.61724 14.3822 3 15.96 3C17.342 3 18.4719 3.29645 19.3729 3.82438C20.2762 4.35357 20.8945 5.08322 21.3001 5.86176C22.0919 7.38172 22.0844 9.09982 21.8913 10.0867C21.3888 12.6555 19.5878 15.3476 17.7015 17.3585C16.7464 18.3766 15.7323 19.2603 14.7863 19.8979C13.8895 20.5023 12.8891 21 12 21C11.1109 21 10.1105 20.5023 9.21371 19.8979C8.26775 19.2603 7.25361 18.3766 6.29853 17.3585C4.41221 15.3476 2.61121 12.6555 2.10867 10.0867C1.91558 9.09982 1.90812 7.38172 2.69993 5.86176C3.1055 5.08322 3.72383 4.35357 4.62707 3.82438Z"
                                                ></path>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <div className="h-[20px] mx-1 border-r border-[rgb(63,65,92)]"></div>
                                <div className="h-full mx-2">
                                    <button
                                        className="bg-none border-none outline-0 flex gap-2 items-center justify-center h-full cursor-pointer group"
                                        onClick={handleFullScreen}
                                    >
                                        <svg
                                            className="w-[24px] h-[24px] max-sm:w-[20px] max-sm:h-[20px] fill-[#fff] group-hover:fill-[rgb(134,104,255)]"
                                            focusable="false"
                                            aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M4 2C2.89543 2 2 2.89543 2 4V8C2 8.55228 2.44772 9 3 9C3.55228 9 4 8.55228 4 8V5.41421L7.79289 9.20711C8.18342 9.59763 8.81658 9.59763 9.20711 9.20711C9.59763 8.81658 9.59763 8.18342 9.20711 7.79289L5.41421 4H8C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2H4ZM16 2C15.4477 2 15 2.44772 15 3C15 3.55228 15.4477 4 16 4H18.5858L14.7929 7.79289C14.4024 8.18342 14.4024 8.81658 14.7929 9.20711C15.1834 9.59763 15.8166 9.59763 16.2071 9.20711L20 5.41421V8C20 8.55228 20.4477 9 21 9C21.5523 9 22 8.55228 22 8V4C22 2.89543 21.1046 2 20 2H16ZM16 20L18.5858 20L14.7929 16.2071C14.4024 15.8166 14.4024 15.1834 14.7929 14.7929C15.1834 14.4024 15.8166 14.4024 16.2071 14.7929L20 18.5858V16C20 15.4477 20.4477 15 21 15C21.5523 15 22 15.4477 22 16V20C22 21.1046 21.1046 22 20 22L16 22C15.4477 22 15 21.5523 15 21C15 20.4477 15.4477 20 16 20ZM4 18.5858L7.79289 14.7929C8.18342 14.4024 8.81658 14.4024 9.20711 14.7929C9.59763 15.1834 9.59763 15.8166 9.20711 16.2071L5.41421 20H8C8.55228 20 9 20.4477 9 21C9 21.5523 8.55228 22 8 22H4C2.89543 22 2 21.1046 2 20V16C2 15.4477 2.44772 15 3 15C3.55228 15 4 15.4477 4 16L4 18.5858Z"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden max-lg:flex max-lg:flex-wrap justify-center gap-[12px] w-full p-[16px_4px]">
                        {games.length > 0 ? (
                            games.slice(0, visibleCount).map((game) => (
                                <div
                                    key={game.id}
                                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition w-[153px] h-[84px]"
                                    onClick={() => handleGameClick(game.slug)}
                                >
                                    {game.thumbnail && game.thumbnail !== '' ? (
                                        <img
                                            src={`/image/game/thumbnail/${game.thumbnail}`}
                                            alt={game.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/image/game/thumbnail/placeholder.jpg';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-[153px] h-[84px] bg-gray-300 animate-pulse" />
                                    )}
                                    <div className="p-2">
                                        <h3 className="text-sm font-bold text-white truncate">{game.title}</h3>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white">No games available</p>
                        )}
                    </div>

                    {games.length > visibleCount && (
                        <div className="w-full hidden justify-center mt-4 max-lg:flex">
                            <button
                                onClick={handleShowMore}
                                className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded transition"
                            >
                                Show More
                            </button>
                        </div>
                    )}
                    <div className="gameInfor bg-[#13141e] w-full mt-2 p-[16px_24px] gap-4 flex flex-col">
                        <div className="text-sm text-gray-700">
                            <nav className="flex space-x-1" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 max-2xl:flex max-2xl:flex-wrap">
                                    <li>
                                        <div>
                                            <span className="text-[#6842ff] font-semibold">Game</span>
                                        </div>
                                    </li>
                                    {selectedGame && selectedGame.categories && selectedGame.categories.length > 0 ? (
                                        selectedGame.categories.map((category, index) => (
                                            <li key={index}>
                                                <div className="flex items-center">
                                                    <span className="text-[#6842ff] mx-1">››</span>
                                                    <a
                                                        href={`/${category}`}
                                                        className="text-[#6842ff] hover:underline capitalize"
                                                    >
                                                        {category}
                                                    </a>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <li>
                                            <div>
                                                <span className="text-[#6842ff] mx-1">››</span>
                                                <span className="text-[#6842ff] font-semibold" aria-current="page">
                                                    No Categories
                                                </span>
                                            </div>
                                        </li>
                                    )}
                                </ol>
                            </nav>
                        </div>
                        <h1 className="text-[#fff] text-[28px] font-[900] max-sm:text-[18px] max-md:text-[20px] max-lg:text-[20px]">
                            {selectedGame ? selectedGame.title : 'Loading...'}
                        </h1>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-4">
                                <Button className="!w-auto !py-1.5">Share</Button>
                                <Button className="!w-auto !py-1.5">Embed</Button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="text-[#fff] font-[bold] text-[16px] max-sm:text-[14px]">
                                    Rating:{' '}
                                    <span className="text-[#fff] font-[bold] text-[16px] max-sm:text-[14px]">
                                        8.4 (4,356,047 votes)
                                    </span>
                                </div>
                                <div className="text-[#fff] font-[bold] text-[16px] max-sm:text-[14px]">
                                    Released:{' '}
                                    <span className="text-[#fff] font-[bold] text-[16px] max-sm:text-[14px]">
                                        March 2021
                                    </span>
                                </div>
                                <div className="text-[#fff] font-[bold] text-[16px] max-sm:text-[14px]">
                                    Technology:{' '}
                                    <span className="text-[#fff] font-[bold] text-[16px] max-sm:text-[14px]">
                                        HTML5
                                    </span>
                                </div>
                                <div className="text-[#fff] font-[bold] text-[16px] max-sm:text-[14px]">
                                    Platform:{' '}
                                    <span className="text-[#fff] font-[bold] text-[16px] max-sm:text-[14px]">
                                        Browser (desktop, mobile, tablet)
                                    </span>
                                </div>
                                <div className="text-[#fff] font-[bold] text-[16px] max-sm:text-[14px]">
                                    Wiki pages:{' '}
                                    <span className="text-[#6842ff] font-[bold] text-[16px] max-sm:text-[14px]">
                                        Fandom
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button className="!rounded-[12px] !w-auto">Share</Button>
                            <Button className="!rounded-[12px] !w-auto">Embed</Button>
                            <Button className="!rounded-[12px] !w-auto">With Friends 100</Button>
                            <Button className="!rounded-[12px] !w-auto">Building 153</Button>
                            <Button className="!rounded-[12px] !w-auto">Minecraft 75</Button>
                            <Button className="!rounded-[12px] !w-auto">Multiplayer 336</Button>
                            <Button className="!rounded-[12px] !w-auto">Jumping 139</Button>
                            <Button className="!rounded-[12px] !w-auto">Third Person Shooter 69</Button>
                        </div>
                    </div>
                </div>
                <div className="px-[16px] bg-[#13141e] w-full min-xl:max-w-[356px] max-w-[356px] mt-[2px] max-lg:hidden ">
                    <div className="grid grid-cols-1 gap-[12px] w-full p-[16px_4px] min-lg:grid-cols-2">
                        {games.length > 0 ? (
                            games.map((game) => (
                                <div
                                    key={game.id}
                                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition w-[153px] h-[84px]"
                                    onClick={() => handleGameClick(game.slug)}
                                >
                                    {game.thumbnail && game.thumbnail !== '' ? (
                                        <img
                                            src={`/image/game/thumbnail/${game.thumbnail}`}
                                            alt={game.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/image/game/thumbnail/placeholder.jpg';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-[153px] h-[84px] bg-gray-300 animate-pulse" />
                                    )}
                                    <div className="p-2">
                                        <h3 className="text-sm font-bold text-white truncate">{game.title}</h3>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white">No games available</p>
                        )}
                    </div>
                </div>
            </main>
        </DefaultLayout>
    );
}

export default GameLayout;
