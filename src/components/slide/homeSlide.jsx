import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useState, useEffect, useMemo } from 'react';
import { gameApi } from '../../api/gamesApi';
import { Link } from 'react-router-dom';
import './slide.css';

function HomeSlide() {
    const [hidePrev, setHidePrev] = useState(true);
    const [hideNext, setHideNext] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);
    const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 640);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1440);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            setIsTablet(window.innerWidth <= 1024);
            setIsSmallMobile(window.innerWidth <= 640);
            setIsLargeScreen(window.innerWidth > 1440);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSlideChange = (swiper) => {
        setHidePrev(swiper.isBeginning);
        setHideNext(swiper.isEnd);
    };

    const bigGames = useMemo(() => gameApi.filter((game) => game.isBigs === true), []);
    const smallGames = useMemo(() => gameApi.filter((game) => !game.isBigs), []);

    const slides = useMemo(() => {
        const result = [];
        const bigGamesPerSlide = isSmallMobile ? 1 : 2;
        const smallGamesPerSlide = isSmallMobile ? 4 : 8;
        const maxSlides = Math.ceil(bigGames.length / bigGamesPerSlide);

        const requiredSmallGames = bigGames.length * 4;
        const limitedSmallGames = smallGames.slice(0, requiredSmallGames);

        for (let i = 0; i < maxSlides; i++) {
            let bigContent = bigGames.slice(i * bigGamesPerSlide, i * bigGamesPerSlide + bigGamesPerSlide);
            if (bigContent.length < bigGamesPerSlide && bigGames.length > 0) {
                bigContent.push(
                    ...Array(bigGamesPerSlide - bigContent.length).fill({
                        id: 'placeholder-big',
                        title: 'Placeholder Big',
                        thumbnail: 'placeholder.jpg',
                        slug: '',
                        isBigs: true,
                    }),
                );
            } else if (bigContent.length === 0) {
                bigContent = Array(bigGamesPerSlide).fill({
                    id: 'placeholder-big',
                    title: 'Placeholder Big',
                    thumbnail: 'placeholder.jpg',
                    slug: '',
                    isBigs: true,
                });
            }

            const smallGamesStartIndex = i * smallGamesPerSlide;
            let smallBoxes = limitedSmallGames.slice(smallGamesStartIndex, smallGamesStartIndex + smallGamesPerSlide);
            if (smallBoxes.length < smallGamesPerSlide) {
                smallBoxes.push(
                    ...Array(smallGamesPerSlide - smallBoxes.length).fill({
                        id: 'placeholder-small',
                        title: 'Placeholder Small',
                        thumbnail: 'placeholder.jpg',
                        slug: '',
                    }),
                );
            }

            result.push({ bigContent, smallBoxes });
        }
        return result;
    }, [bigGames, smallGames, isSmallMobile]);

    if (slides.length === 0) {
        return <div className="text-white text-center">No games available to display.</div>;
    }

    return (
        <div className="max-w-full mx-auto py-3 px-2 relative homeSlide">
            <style>{`
                .homeSlide .swiper {
                    padding: 0 !important;
                }
                .homeSlide .game-box {
                    position: relative;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                    border: 2px solid transparent;
                    border-radius: 8px;
                }
                .homeSlide .game-box:hover {
                    opacity: 0.9;
                    border: 2px solid rgb(104, 66, 255);
                }
                .homeSlide .game-box img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                }
                .homeSlide .title-container {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: #fff;
                    padding: 0 8px 10px 8px;
                    font-size: 14px;
                    font-weight: 600;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
                    pointer-events: none;
                    z-index: 2;
                }
                .homeSlide .static .title-container {
                    backdrop-filter: blur(4px);
                }
                .homeSlide .swiper-slide .title-container {
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .homeSlide .swiper-slide .game-box:hover .title-container {
                    opacity: 1;
                }
                .homeSlide .play-icon {
                    width: 24px;
                    height: 24px;
                    fill: #fff;
                    pointer-events: auto;
                    cursor: pointer;
                }
                .homeSlide .small-game-box img {
                    height: 135px;
                }
                @media (max-width: 1024px) {
                    .homeSlide .swiper {
                        display: none;
                    }
                    .homeSlide .static-layout {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
                    .homeSlide .big-games {
                        display: grid;
                        grid-template-columns: repeat(${isSmallMobile ? 1 : 2}, 1fr);
                        gap: 8px;
                    }
                    .homeSlide .small-games {
                        display: grid;
                        grid-template-columns: repeat(${isSmallMobile ? 2 : 4}, 1fr);
                        gap: 8px;
                    }
                    .homeSlide .play-icon {
                        display: flex;
                    }
                }
                @media (min-width: 1025px) {
                    .homeSlide .swiper {
                        width: 100%;
                        overflow: hidden;
                        touch-action: none;
                        box-sizing: border-box;
                    }
                    .homeSlide .swiper-wrapper {
                        display: flex;
                        width: 100%;
                    }
                    .homeSlide .swiper-slide {
                        flex-shrink: 0;
                        width: calc(100% / ${isLargeScreen ? 1 : 1});
                        pointer-events: none;
                        display: flex;
                    }
                    .homeSlide .swiper-slide a {
                        pointer-events: auto;
                    }
                    .homeSlide .swiper-slide:last-child .grid {
                        padding-right: 0;
                    }
                    .homeSlide .static-layout {
                        display: none;
                    }
                    .homeSlide .play-icon {
                        display: none;
                    }
                }
            `}</style>
            {isTablet ? (
                <div className="static-layout">
                    {slides.map((slide, slideIndex) => (
                        <div key={slideIndex} className="slide-content static max-sm:flex max-sm:gap-1 max-sm:flex-col">
                            <div className="big-games">
                                {slide.bigContent.map((big) => (
                                    <Link
                                        key={big.id}
                                        to={`/game/${big.slug || ''}`}
                                        className="game-box shadow flex flex-col items-center justify-center"
                                    >
                                        <img
                                            src={
                                                big.thumbnail
                                                    ? `/image/game/thumbnail/${big.thumbnail}`
                                                    : 'https://via.placeholder.com/300?text=No+Image'
                                            }
                                            alt={big.title || 'Big Game'}
                                        />
                                        <div className="title-container">
                                            <h3>{big.title || 'Untitled'}</h3>
                                            <svg className="play-icon" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="small-games max-sm:!gap-1">
                                {slide.smallBoxes.map((box) => (
                                    <Link
                                        key={box.id}
                                        to={`/game/${box.slug || ''}`}
                                        className="game-box small-game-box shadow flex flex-col items-center justify-center"
                                    >
                                        <img
                                            src={
                                                box.thumbnail
                                                    ? `/image/game/thumbnail/${box.thumbnail}`
                                                    : 'https://via.placeholder.com/150?text=No+Image'
                                            }
                                            alt={box.title || 'Small Game'}
                                        />
                                        <div className="title-container">
                                            <h3>{box.title || 'Untitled'}</h3>
                                            <svg className="play-icon" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={0}
                    slidesPerView={1}
                    centeredSlides={false}
                    slidesOffsetAfter={0}
                    watchOverflow={true}
                    navigation={{
                        prevEl: '.game-slide-prev',
                        nextEl: '.game-slide-next',
                        disabledClass: 'swiper-button-disabled',
                    }}
                    touchRatio={0}
                    allowTouchMove={isMobile}
                    onSlideChange={handleSlideChange}
                    onInit={(swiper) => {
                        setHidePrev(swiper.isBeginning);
                        setHideNext(swiper.isEnd);
                    }}
                    className="mySwiper"
                >
                    {slides.map((slide, slideIndex) => (
                        <SwiperSlide key={slideIndex}>
                            <div className="grid grid-cols-4 gap-1 w-full">
                                <Link
                                    to={`/game/${slide.bigContent[0]?.slug || ''}`}
                                    className="game-box shadow flex flex-col items-center justify-center"
                                >
                                    <img
                                        src={
                                            slide.bigContent[0]?.thumbnail
                                                ? `/image/game/thumbnail/${slide.bigContent[0].thumbnail}`
                                                : 'https://via.placeholder.com/300?text=No+Image'
                                        }
                                        alt={slide.bigContent[0]?.title || 'Big Game'}
                                    />
                                    <div className="title-container">
                                        <h3>{slide.bigContent[0]?.title || 'Untitled'}</h3>
                                        <svg className="play-icon" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </Link>
                                <div className="grid grid-cols-2 grid-rows-2 gap-1">
                                    {slide.smallBoxes.slice(0, 4).map((box) => (
                                        <Link
                                            key={box.id}
                                            to={`/game/${box.slug || ''}`}
                                            className="game-box small-game-box shadow flex flex-col items-center justify-center"
                                        >
                                            <img
                                                src={
                                                    box.thumbnail
                                                        ? `/image/game/thumbnail/${box.thumbnail}`
                                                        : 'https://via.placeholder.com/150?text=No+Image'
                                                }
                                                alt={box.title || 'Small Game'}
                                            />
                                            <div className="title-container">
                                                <h3>{box.title || 'Untitled'}</h3>
                                                <svg className="play-icon" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <Link
                                    to={`/game/${slide.bigContent[1]?.slug || ''}`}
                                    className="game-box shadow flex flex-col items-center justify-center"
                                >
                                    <img
                                        src={
                                            slide.bigContent[1]?.thumbnail
                                                ? `/image/game/thumbnail/${slide.bigContent[1].thumbnail}`
                                                : 'https://via.placeholder.com/300?text=No+Image'
                                        }
                                        alt={slide.bigContent[1]?.title || 'Big Game'}
                                    />
                                    <div className="title-container">
                                        <h3>{slide.bigContent[1]?.title || 'Untitled'}</h3>
                                        <svg className="play-icon" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </Link>
                                <div className="grid grid-cols-2 grid-rows-2 gap-1">
                                    {slide.smallBoxes.slice(4, 8).map((box) => (
                                        <Link
                                            key={box.id}
                                            to={`/game/${box.slug || ''}`}
                                            className="game-box small-game-box shadow flex flex-col items-center justify-center"
                                        >
                                            <img
                                                src={
                                                    box.thumbnail
                                                        ? `/image/game/thumbnail/${box.thumbnail}`
                                                        : 'https://via.placeholder.com/150?text=No+Image'
                                                }
                                                alt={box.title || 'Small Game'}
                                            />
                                            <div className="title-container">
                                                <h3>{box.title || 'Untitled'}</h3>
                                                <svg className="play-icon" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                    <div className={`game-slide-prev ${hidePrev ? 'hidden' : ''}`} />
                    <div className={`game-slide-next ${hideNext ? 'hidden' : ''}`} />
                </Swiper>
            )}
        </div>
    );
}

export default HomeSlide;
