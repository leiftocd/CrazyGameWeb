import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { gameApi } from '../../api/gamesApi';
import { Link } from 'react-router-dom';
import './slide.css';

function GameSlide({ category = '', itemClass = '' }) {
    const [hidePrev, setHidePrev] = useState(true);
    const [hideNext, setHideNext] = useState(false);
    const [itemsPerSlide, setItemsPerSlide] = useState(7); // Default 7 items per slide

    // Filter games by category or use all games if no category is provided
    const finalData = category
        ? gameApi.filter((game) => game.categories && game.categories.includes(category))
        : gameApi;

    // Update itemsPerSlide based on window width
    useEffect(() => {
        const updateItemsPerSlide = () => {
            const width = window.innerWidth;
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
        const gap = 8; // 8px gap between items
        const totalGap = gap * (itemsPerSlide - 1); // Total gap width
        const padding = window.innerWidth <= 640 ? 16 : 32; // Adjust padding for mobile
        return `calc((100vw - ${padding}px - ${totalGap}px) / ${itemsPerSlide})`;
    };

    // Calculate item height based on width to maintain aspect ratio (e.g., 16:9)
    const calculateItemHeight = () => {
        const aspectRatio = 9 / 16; // 16:9 aspect ratio
        return `calc(${calculateItemWidth()} * ${aspectRatio})`;
    };

    const handleSlideChange = (swiper) => {
        setHidePrev(swiper.isBeginning);
        setHideNext(swiper.isEnd);
    };

    // Create chunks for slides based on itemsPerSlide
    const chunkedData = [];
    const totalItems = finalData.length;

    for (let i = 0; i < totalItems; i += itemsPerSlide) {
        let chunk = finalData.slice(i, i + itemsPerSlide);
        // Pad the last chunk with items from the previous chunk if needed
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
        <div className="mb-6 w-full relative px-[8px]">
            <div className="relative overflow-hidden mySlide">
                <style>{`
                    .game-item {
                        width: ${calculateItemWidth()};
                        height: ${calculateItemHeight()};
                        position: relative;
                        overflow: hidden;
                    }
                    .slide-res {
                        display: flex;
                        flex-direction: row;
                        gap: 8px;
                        width: 100%;
                        justify-content: flex-start;
                        pointer-events: none;
                    }
                    .slide-res a {
                        pointer-events: auto;
                    }
                    .game-item img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                    }
                    .game-item-title {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 4px 8px;
                        font-size: 14px;
                        text-align: center;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
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
                    .swiper {
                        width: 100%;
                        overflow: hidden;
                    }
                `}</style>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={8}
                    slidesPerView={1}
                    slidesPerGroup={1}
                    centeredSlides={false}
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
                    touchRatio={0}
                    allowTouchMove={window.innerWidth <= 768}
                    onSlideChange={handleSlideChange}
                    onInit={(swiper) => {
                        setHidePrev(swiper.isBeginning);
                        setHideNext(swiper.isEnd);
                    }}
                    className="mySwiper"
                >
                    {chunkedData.map((chunk, index) => (
                        <SwiperSlide key={`slide-${index}`} className="slide-res">
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
