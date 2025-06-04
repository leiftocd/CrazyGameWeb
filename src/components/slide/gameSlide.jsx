import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { gameApi } from '../../api/gamesApi';
import { Link } from 'react-router-dom';
import './slide.css';

function GameSlide({ category = '', itemClass = '' }) {
    const swiperRef = useRef(null);
    const [hidePrev, setHidePrev] = useState(true);
    const [hideNext, setHideNext] = useState(false);
    const [itemsPerSlide, setItemsPerSlide] = useState(7);
    const [isMobile, setIsMobile] = useState(false);

    // Filter games by category or use all games if no category is provided
    const finalData = category
        ? gameApi.filter((game) => game.categories && game.categories.includes(category))
        : gameApi;

    // Update itemsPerSlide based on window width
    useEffect(() => {
        const updateItemsPerSlide = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 768);

            if (width <= 640) {
                setItemsPerSlide(2);
            } else if (width <= 1024) {
                setItemsPerSlide(4);
            } else if (width <= 1280) {
                setItemsPerSlide(6);
            } else {
                setItemsPerSlide(7);
            }
        };

        updateItemsPerSlide();
        window.addEventListener('resize', updateItemsPerSlide);
        return () => window.removeEventListener('resize', updateItemsPerSlide);
    }, []);

    // Calculate item width based on itemsPerSlide
    const calculateItemWidth = () => {
        const gap = 8;
        const totalGap = gap * (itemsPerSlide - 1);
        const padding = window.innerWidth <= 640 ? 16 : 32;
        return `calc((100vw - ${padding}px - ${totalGap}px) / ${itemsPerSlide})`;
    };

    // Calculate item height based on width to maintain aspect ratio
    const calculateItemHeight = () => {
        const aspectRatio = 9 / 16;
        return `calc(${calculateItemWidth()} * ${aspectRatio})`;
    };

    // Create chunks for slides based on itemsPerSlide
    const chunkedData = [];
    const totalItems = finalData.length;

    for (let i = 0; i < totalItems; i += itemsPerSlide) {
        let chunk = finalData.slice(i, i + itemsPerSlide);
        if (chunk.length < itemsPerSlide && i + chunk.length === totalItems && i > 0) {
            const remaining = itemsPerSlide - chunk.length;
            const prevChunkStart = Math.max(0, i - itemsPerSlide);
            const additionalItems = finalData.slice(prevChunkStart, prevChunkStart + remaining);
            chunk = [...chunk, ...additionalItems];
        }
        chunkedData.push(chunk);
    }

    if (!finalData || finalData.length === 0) {
        console.warn(`No games found for category: ${category}`);
        return null;
    }

    return (
        <div className="mb-6 w-full relative px-[4px] max-md:px-[auto]">
            <div className="relative overflow-hidden mySlide">
                <style>{`
                    .game-item {
                        width: ${calculateItemWidth()};
                        height: ${calculateItemHeight()};
                        position: relative;
                        overflow: hidden;
                    }
                    
                    /* Mobile navigation buttons */
                    .mobile-nav-btn-${category} {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        z-index: 10;
                        background: rgba(0, 0, 0, 0.7);
                        border: none;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    
                    .mobile-nav-btn-${category}:hover {
                        background: rgba(0, 0, 0, 0.9);
                    }
                    
                    .mobile-nav-btn-${category}:disabled {
                        opacity: 0.3;
                        cursor: not-allowed;
                    }
                    
                    .mobile-prev-btn-${category} {
                        left: 10px;
                    }
                    
                    .mobile-next-btn-${category} {
                        right: 10px;
                    }
                    
                    /* Hide desktop navigation on mobile */
                    @media (max-width: 768px) {
                        .game-slide-prev,
                        .game-slide-next {
                            display: none !important;
                        }
                    }
                    
                    /* Hide mobile navigation on desktop */
                    @media (min-width: 769px) {
                        .mobile-nav-btn-${category} {
                            display: none !important;
                        }
                    }
                `}</style>

                <Swiper
                    modules={[Navigation]}
                    spaceBetween={8}
                    slidesPerView={1}
                    slidesPerGroup={1}
                    centeredSlides={false}
                    grabCursor={true}
                    speed={300}
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 8 },
                        640: { slidesPerView: 1, spaceBetween: 8 },
                        1024: { slidesPerView: 1, spaceBetween: 8 },
                        1280: { slidesPerView: 1, spaceBetween: 8 },
                    }}
                    navigation={{
                        prevEl: '.game-slide-prev',
                        nextEl: '.game-slide-next',
                        disabledClass: 'swiper-button-disabled',
                    }}
                    touchRatio={1}
                    allowTouchMove={true}
                    simulateTouch={true}
                    onSlideChange={(swiper) => {
                        setHidePrev(swiper.isBeginning);
                        setHideNext(swiper.isEnd);
                    }}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setHidePrev(swiper.isBeginning);
                        setHideNext(swiper.isEnd);
                    }}
                    className={`mySwiper-${category}`}
                >
                    {chunkedData.map((chunk, index) => (
                        <SwiperSlide key={`slide-${category}-${index}`} className="slide-res">
                            <div className="flex flex-row gap-[8px] w-full">
                                {chunk.map((item, itemIndex) => (
                                    <Link
                                        key={`${item.id}-${itemIndex}`}
                                        to={`/game/${item.slug}`}
                                        aria-label={`${item.title} game link`}
                                        className={`relative flex-shrink-0 game-item rounded-lg overflow-hidden border-2 border-solid border-transparent hover:border-[rgb(104,66,255)] ${itemClass}`}
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
                                        <h3 className="game-item-title">{item.title || 'Untitled'}</h3>
                                    </Link>
                                ))}
                            </div>
                        </SwiperSlide>
                    ))}

                    <div className={`game-slide-prev ${hidePrev ? 'hidden' : ''}`} />
                    <div className={`game-slide-next ${hideNext ? 'hidden' : ''}`} />

                    {isMobile && (
                        <>
                            <button
                                className={`mobile-nav-btn-${category} mobile-prev-btn-${category} ${hidePrev ? 'opacity-30' : ''}`}
                                onClick={() => {
                                    swiperRef.current?.slidePrev();
                                }}
                                disabled={hidePrev}
                                aria-label="Previous slide"
                            >
                                ‹
                            </button>
                            <button
                                className={`mobile-nav-btn-${category} mobile-next-btn-${category} ${hideNext ? 'opacity-30' : ''}`}
                                onClick={() => {
                                    swiperRef.current?.slideNext();
                                }}
                                disabled={hideNext}
                                aria-label="Next slide"
                            >
                                ›
                            </button>
                        </>
                    )}
                </Swiper>
            </div>
        </div>
    );
}

GameSlide.propTypes = {
    category: PropTypes.string,
    itemClass: PropTypes.string,
};

export default GameSlide;
