import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { gameApi } from '../../api/gamesApi';
import { Link } from 'react-router-dom';
import './slide.css';

function OriginalSlide({ title = '', data = [], itemClass = '', baseUnit = '8px' }) {
    const [hidePrev, setHidePrev] = useState(true);
    const [hideNext, setHideNext] = useState(false);
    const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());
    const [isMobile, setIsMobile] = useState(false);

    const filteredData = gameApi.filter((item) => item.originalThumbnail);
    const finalData = data.length > 0 ? data : filteredData;

    function getItemsPerSlide() {
        if (window.innerWidth >= 1280) return 7;
        if (window.innerWidth >= 1024) return 5;
        if (window.innerWidth >= 640) return 4;
        if (window.innerWidth <= 640) return 4;
        return 7; // Default for smaller screens
    }

    useEffect(() => {
        const handleResize = () => {
            setItemsPerSlide(getItemsPerSlide());
            setIsMobile(window.innerWidth <= 768);
        };

        // Set initial mobile state
        setIsMobile(window.innerWidth <= 768);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const calculateItemWidth = () => {
        const padding = window.innerWidth >= 640 ? 32 : 16; // Adjust padding for different screen sizes
        return `calc((100vw - ${padding}px - (${itemsPerSlide - 1} * 8px)) / ${itemsPerSlide})`;
    };

    const calculateItemHeight = () => {
        const padding = window.innerWidth >= 640 ? 32 : 16;
        return `calc(((((100vw - ${padding}px - (${itemsPerSlide - 1} * 8px)) / ${itemsPerSlide}) - 4px) * 1.5) + calc(${baseUnit} * 0.5))`;
    };

    const handleSlideChange = (swiper) => {
        setHidePrev(swiper.isBeginning);
        setHideNext(swiper.isEnd);
    };

    const chunkedData = [];
    const totalItems = finalData.length;

    for (let i = 0; i < totalItems; i += itemsPerSlide) {
        let chunk = finalData.slice(i, i + itemsPerSlide);
        if (chunk.length < itemsPerSlide && chunk.length > 0 && chunkedData.length > 0) {
            const remaining = itemsPerSlide - chunk.length;
            const prevSlide = chunkedData[chunkedData.length - 1] || [];
            const additionalItems = prevSlide.slice(-remaining);
            chunk = [...additionalItems, ...chunk];
            const prevItem = prevSlide[prevSlide.length - remaining - 1];
            if (prevItem) {
                chunk = [prevItem, ...chunk];
            }
        } else if (chunk.length > 0 && i + itemsPerSlide >= totalItems && chunkedData.length > 0) {
            const prevSlide = chunkedData[chunkedData.length - 1] || [];
            const prevItem = prevSlide[prevSlide.length - 1];
            if (prevItem) {
                chunk = [prevItem, ...chunk];
            }
        }
        if (chunk.length > 0) {
            chunkedData.push(chunk);
        }
    }

    if (!finalData || finalData.length === 0) return null;

    return (
        <div className="mb-6 w-full px-1 relative">
            <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
            <div className="relative mySlide">
                <style>{`
                    .swiper {
                        width: 100%;
                        overflow: hidden;
                        touch-action: none;
                        padding: 0;
                    }
                    .swiper-slide {
                        display: flex;
                        flex-direction: row;
                        gap: 8px;
                        pointer-events: none;
                        width: 100%;
                        justify-content: flex-start;
                    }
                    .swiper-slide a {
                        pointer-events: auto;
                    }
                    .big-item {
                        width: ${calculateItemWidth()};
                        height: ${calculateItemHeight()};
                        flex-shrink: 0;
                        position: relative;
                        overflow: hidden;
                        border-radius: 8px;
                    }
                    .swiper-slide:last-child {
                        justify-content: flex-start;
                    }
                    .swiper-slide:last-child .big-item:first-child {
                        width: ${calculateItemWidth()};
                        opacity: 1;
                    }
                    .big-item img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 8px;
                        display: block;
                    }
                    .game-slide-prev, .game-slide-next {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        z-index: 10;
                        cursor: pointer;
                    }
                    .game-slide-prev {
                        left: 0;
                    }
                    .game-slide-next {
                        right: 0;
                    }
                    .hidden {
                        display: none;
                    }
                    
                    /* Mobile navigation buttons */
                    .mobile-nav-btn {
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
                    
                    .mobile-nav-btn:hover {
                        background: rgba(0, 0, 0, 0.9);
                    }
                    
                    .mobile-nav-btn:disabled {
                        opacity: 0.3;
                        cursor: not-allowed;
                    }
                    
                    .mobile-prev-btn {
                        left: 10px;
                    }
                    
                    .mobile-next-btn {
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
                        .mobile-nav-btn {
                            display: none !important;
                        }
                    }
                `}</style>

                <Swiper
                    modules={[Navigation]}
                    spaceBetween={8}
                    slidesPerView={1}
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 5 },
                        640: { slidesPerView: 1, spaceBetween: 8 },
                        1024: { slidesPerView: 1, spaceBetween: 8 },
                        1280: { slidesPerView: 1, spaceBetween: 8 },
                    }}
                    navigation={{
                        prevEl: '.game-slide-prev',
                        nextEl: '.game-slide-next',
                        disabledClass: 'swiper-button-disabled',
                    }}
                    // Sửa lại touchRatio và allowTouchMove để cho phép vuốt trên mobile
                    touchRatio={1}
                    allowTouchMove={true}
                    simulateTouch={true}
                    onSlideChange={handleSlideChange}
                    onInit={(swiper) => {
                        setHidePrev(swiper.isBeginning);
                        setHideNext(swiper.isEnd);

                        // Store swiper instance for mobile buttons
                        window.currentOriginalSwiper = swiper;
                    }}
                    className="swiper"
                >
                    {chunkedData.map((chunk, index) => (
                        <SwiperSlide key={`slide-${index}`} className="swiper-slide">
                            {chunk.map((item, itemIndex) => (
                                <Link
                                    key={`${item.id}-${itemIndex}`}
                                    to={`/game/${item.slug || ''}`}
                                    aria-label={`${item.title} game link`}
                                    className={`big-item ${itemClass}`}
                                >
                                    <img
                                        src={`/image/game/largeThumb/${item.originalThumbnail}`}
                                        alt={item.title || 'Game image'}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </Link>
                            ))}
                        </SwiperSlide>
                    ))}

                    {/* Desktop navigation buttons */}
                    <div className={`game-slide-prev ${hidePrev ? 'hidden' : ''}`} />
                    <div className={`game-slide-next ${hideNext ? 'hidden' : ''}`} />

                    {/* Mobile navigation buttons */}
                    {isMobile && (
                        <>
                            <button
                                className={`mobile-nav-btn mobile-prev-btn ${hidePrev ? 'opacity-30' : ''}`}
                                onClick={() => window.currentOriginalSwiper?.slidePrev()}
                                disabled={hidePrev}
                                aria-label="Previous slide"
                            >
                                ‹
                            </button>
                            <button
                                className={`mobile-nav-btn mobile-next-btn ${hideNext ? 'opacity-30' : ''}`}
                                onClick={() => window.currentOriginalSwiper?.slideNext()}
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

OriginalSlide.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            originalThumbnail: PropTypes.string.isRequired,
            slug: PropTypes.string,
            link: PropTypes.string,
        }),
    ),
    itemClass: PropTypes.string,
    baseUnit: PropTypes.string,
};

export default OriginalSlide;
