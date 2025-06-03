import { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import EmailForm from '../../form/emailForm';
import BoxContentPopup from '../popupContent/boxContentPopup/boxContentPopup';
import { AuthContext } from '../../../context/AuthContext';

function MyGamePopup({ closePopup }) {
    const [activeTab, setActiveTab] = useState('Recent');
    const tabRefs = useRef([]);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
    const [glowState, setGlowState] = useState({});
    const [favoriteGames, setFavoriteGames] = useState([]);
    const [likedGames, setLikedGames] = useState([]);
    const [recentGames, setRecentGames] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            const savedFavorites = Cookies.get('favoriteGames');
            if (savedFavorites) setFavoriteGames(JSON.parse(savedFavorites));

            const savedLiked = Cookies.get('likedGames');
            if (savedLiked) setLikedGames(JSON.parse(savedLiked));

            const savedRecents = Cookies.get('recentGames');
            if (savedRecents) setRecentGames(JSON.parse(savedRecents));
        }
    }, [user]);

    const handleDislike = (gameId) => {
        const updatedLikes = likedGames.filter((game) => game.id !== gameId);
        setLikedGames(updatedLikes);
        Cookies.set('likedGames', JSON.stringify(updatedLikes), { expires: 365 });
    };
    const handleRemoveFavorite = (gameId) => {
        const updatedFavorites = favoriteGames.filter((game) => game.id !== gameId);
        setFavoriteGames(updatedFavorites);
        Cookies.set('favoriteGames', JSON.stringify(updatedFavorites), { expires: 365 });
    };
    const handleRemoveRecent = (gameId) => {
        const updatedRecents = recentGames.filter((game) => game.id !== gameId);
        setRecentGames(updatedRecents);
        Cookies.set('recentGames', JSON.stringify(updatedRecents), { expires: 365 });
    };

    const renderGameItem = (item, itemIndex) => (
        <div key={`${item.id}-${itemIndex}`} className="relative max-h-[135px] flex">
            <Link
                to={`/game/${item.slug}`}
                aria-label={`${item.title} game link`}
                className="w-full h-full relative game-mygame rounded-lg overflow-hidden border-2 border-solid border-transparent hover:border-[rgb(104,66,255)]"
            >
                <img
                    src={
                        item.thumbnail
                            ? `/image/game/thumbnail/${item.thumbnail}`
                            : 'https://via.placeholder.com/192x108?text=No+Image'
                    }
                    alt={item.title || 'Game image'}
                    className="w-full h-full object-cover"
                />
                <h3 className="game-mygame-title text-sm font-medium mt-1 text-center">{item.title || 'Untitled'}</h3>
            </Link>

            {activeTab === 'Liked' && (
                <button
                    className="absolute -top-2 right-0 text-xs text-white bg-red-500 px-2 py-1 rounded-[50%] cursor-pointer border-2 border-solid border-[#000]"
                    onClick={() => handleDislike(item.id)}
                >
                    X
                </button>
            )}
            {activeTab === 'Favorites' && (
                <button
                    className="absolute -top-2 right-0 text-xs text-white bg-red-500 px-2 py-1 rounded-[50%] cursor-pointer border-2 border-solid border-[#000]"
                    onClick={() => handleRemoveFavorite(item.id)}
                >
                    X
                </button>
            )}
            {activeTab === 'Recent' && (
                <button
                    className="absolute -top-2 right-0 text-xs text-white bg-red-500 px-2 py-1 rounded-[50%] cursor-pointer border-2 border-solid border-[#000]"
                    onClick={() => handleRemoveRecent(item.id)}
                >
                    X
                </button>
            )}
        </div>
    );

    const tabs = [
        {
            name: 'Recent',
            content: user ? (
                <div className="p-4 text-[#fff] grid grid-cols-2 gap-3">
                    {recentGames.length > 0 ? (
                        recentGames.map(renderGameItem)
                    ) : (
                        <div className="col-span-2 flex items-center justify-center flex-col">
                            <div className="flex py-[16px]">
                                <svg
                                    viewBox="0 0 24 24"
                                    focusable="false"
                                    aria-hidden="true"
                                    className="w-[120px] h-[120px] fill-[rgb(47,49,72)]"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 7C12.5523 7 13 7.44772 13 8V11.5858L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L11.2929 12.7071C11.1054 12.5196 11 12.2652 11 12V8C11 7.44772 11.4477 7 12 7Z"
                                    ></path>
                                </svg>
                            </div>
                            <div className="max-w-[80%] text-center text-[rgb(170,173,190)] text-[16px]">
                                All your recently played games will be listed here. Have some fun!
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-4 text-[#fff] flex items-center justify-center flex-col">
                    <div className="flex py-[16px]">
                        <svg
                            viewBox="0 0 24 24"
                            focusable="false"
                            aria-hidden="true"
                            className="w-[120px] h-[120px] fill-[rgb(47,49,72)]"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 7C12.5523 7 13 7.44772 13 8V11.5858L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L11.2929 12.7071C11.1054 12.5196 11 12.2652 11 12V8C11 7.44772 11.4477 7 12 7Z"
                            ></path>
                        </svg>
                    </div>
                    <div className="max-w-[80%] text-center text-[rgb(170,173,190)] text-[16px]">
                        All your recently played games will be listed here. Have some fun!
                    </div>
                </div>
            ),
        },
        {
            name: 'Favorites',
            content: user ? (
                <div className="p-4 text-[#fff] grid grid-cols-2 gap-3">
                    {favoriteGames.length > 0 ? (
                        favoriteGames.map(renderGameItem)
                    ) : (
                        <div className="text-center col-span-2 text-[rgb(170,173,190)]">No favorite games yet.</div>
                    )}
                </div>
            ) : (
                <div className="p-4 text-[#fff]">
                    <div className="flex flex-col items-center justify-center pt-[16px]">
                        <h2 className="max-w-[70%] text-center text-[20px] font-[700]">
                            Create an account to add games to your favorites
                        </h2>
                    </div>
                    <BoxContentPopup />
                    <div className="divider">
                        <span>OR</span>
                    </div>
                    <EmailForm />
                </div>
            ),
        },
        {
            name: 'Liked',
            content: user ? (
                <div className="p-4 text-[#fff] grid grid-cols-2 gap-3">
                    {likedGames.length > 0 ? (
                        likedGames.map(renderGameItem)
                    ) : (
                        <div className="text-center col-span-2 text-[rgb(170,173,190)]">No liked games yet.</div>
                    )}
                </div>
            ) : (
                <div className="p-4 text-[#fff]">
                    <div className="flex flex-col items-center justify-center pt-[16px]">
                        <h2 className="max-w-[70%] text-center text-[20px] font-[700]">
                            Create an account to see all your liked games
                        </h2>
                    </div>
                    <BoxContentPopup />
                    <div className="divider">
                        <span>OR</span>
                    </div>
                    <EmailForm />
                </div>
            ),
        },
    ];

    useEffect(() => {
        const activeIndex = tabs.findIndex((tab) => tab.name === activeTab);
        const activeTabElement = tabRefs.current[activeIndex];
        if (activeTabElement) {
            setUnderlineStyle({
                left: activeTabElement.offsetLeft,
                width: activeTabElement.offsetWidth,
            });
        }
    }, [activeTab]);

    const handleClick = (e, tabName) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setGlowState((prev) => ({
            ...prev,
            [tabName]: { x, y, active: true },
        }));

        setActiveTab(tabName);

        setTimeout(() => {
            setGlowState((prev) => ({
                ...prev,
                [tabName]: { ...prev[tabName], active: false },
            }));
        }, 600);
    };

    return (
        <div className="w-[400px] bg-[rgb(26,27,40)] h-[calc(100vh-76px)] absolute z-20 top-[8px] right-[8px] rounded-[10px] overflow-hidden">
            <div className="w-full h-full">
                <div className="h-[60px] text-[16px] font-[600] text-[#fff] flex items-center justify-center">
                    My Games
                </div>
                <button className="absolute right-[24px] top-[16px] cursor-pointer group" onClick={closePopup}>
                    <svg
                        viewBox="0 0 24 24"
                        focusable="false"
                        aria-hidden="true"
                        className="w-[24px] h-[24px] fill-[#fff] group-hover:fill-[rgba(170,173,190,80%)] transition-all duration-300 ease-in-out"
                    >
                        <path fillRule="evenodd" clipRule="evenodd" d="M4.29289 4.29289..." />
                    </svg>
                </button>
                <div className="w-full flex justify-center items-center relative">
                    <div className="flex relative">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.name}
                                ref={(el) => (tabRefs.current[index] = el)}
                                className={`relative px-[16px] py-[12px] font-[700] text-[14px] transition-all duration-200 max-w-[360px] min-w-[114px] glow-button ${
                                    activeTab === tab.name
                                        ? 'text-[#fff]'
                                        : 'bg-transparent text-[rgb(102,106,127)] hover:text-[rgb(135,138,158)]'
                                } ${glowState[tab.name]?.active ? 'glow-active' : ''}`}
                                onClick={(e) => handleClick(e, tab.name)}
                                style={
                                    glowState[tab.name]?.active
                                        ? {
                                              '--glow-x': `${glowState[tab.name].x}px`,
                                              '--glow-y': `${glowState[tab.name].y}px`,
                                          }
                                        : {}
                                }
                            >
                                {tab.name}
                            </button>
                        ))}
                        <div
                            className="absolute bottom-0 h-[2px] bg-[rgb(104,66,255)] transition-all duration-300 ease-in-out"
                            style={{ left: underlineStyle.left, width: underlineStyle.width }}
                        />
                    </div>
                </div>
                <hr className="h-[0.5px] text-[rgb(102,106,127)] w-[97%]" />
                <div className="w-full h-[calc(100%-100px)] overflow-y-auto">
                    {tabs.map((tab) => activeTab === tab.name && <div key={tab.name}>{tab.content}</div>)}
                </div>
            </div>
        </div>
    );
}

export default MyGamePopup;
