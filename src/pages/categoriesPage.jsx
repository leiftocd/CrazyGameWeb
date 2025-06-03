import { useParams, Link } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';
import Cookies from 'js-cookie';
import DefaultLayout from '../layouts/defaultLayout';
import { gameApi } from '../api/gamesApi';
import { categoriesData } from '../api/categoriesApi';

function CategoriesPage() {
    const { slug } = useParams();
    const [recentGames, setRecentGames] = useState([]);

    // Current date for filtering new and updated games
    const currentDate = new Date('2025-06-01');

    const getTitleAndFlags = (slug) => {
        let title = 'All Games';
        let isOriginals = false;
        let isRecent = false;
        let isMultiplayer = false;
        let isNew = false;
        let isUpdated = false;
        let isTrending = false;

        if (slug === 'originals') {
            title = 'Originals';
            isOriginals = true;
        } else if (slug === 'recent') {
            title = 'Recently Played Games';
            isRecent = true;
        } else if (slug === 'multiplayer') {
            title = 'Multiplayer Games';
            isMultiplayer = true;
        } else if (slug === 'new') {
            title = 'New Games';
            isNew = true;
        } else if (slug === 'updated') {
            title = 'Updated Games';
            isUpdated = true;
        } else if (slug === 'trending') {
            title = 'Trending Games';
            isTrending = true;
        } else if (slug) {
            const category =
                categoriesData.mainNavigation.find((cat) => cat.slug === slug) ||
                categoriesData.categoriesGame.find((cat) => cat.slug === slug) ||
                categoriesData.footerNav.find((cat) => cat.slug === slug);
            title = category?.name || 'All Games';
        }

        return { title, isOriginals, isRecent, isMultiplayer, isNew, isUpdated, isTrending };
    };

    // Get title and flags immediately
    const { title, isOriginals, isRecent, isMultiplayer, isNew, isUpdated, isTrending } = getTitleAndFlags(slug);

    // Set document title immediately when slug changes
    useLayoutEffect(() => {
        if (slug) {
            document.title = `${title} - CrazyGame`;
        }
    }, [slug, title]);

    useEffect(() => {
        if (isRecent) {
            const saved = Cookies.get('recentGames');
            if (saved) {
                setRecentGames(JSON.parse(saved));
            }
        }
    }, [slug, isRecent]); // Removed title from dependencies

    // Filter games based on slug
    let filteredGames = [];
    if (isOriginals) {
        filteredGames = gameApi.filter((game) => game.originalThumbnail);
    } else if (isRecent) {
        filteredGames = recentGames;
    } else if (isMultiplayer) {
        filteredGames = gameApi.filter((game) => game.isMultiplayer);
    } else if (isNew) {
        const thirtyDaysAgo = new Date(currentDate);
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        filteredGames = gameApi.filter((game) => new Date(game.releaseDate) >= thirtyDaysAgo);
    } else if (isUpdated) {
        const sixtyDaysAgo = new Date(currentDate);
        sixtyDaysAgo.setDate(currentDate.getDate() - 60);
        filteredGames = gameApi.filter((game) => new Date(game.lastUpdated) >= sixtyDaysAgo);
    } else if (isTrending) {
        filteredGames = gameApi.filter((game) => game.playCount >= 15000);
    } else {
        filteredGames = gameApi.filter((game) => game.categories && game.categories.includes(slug));
    }

    return (
        <DefaultLayout>
            <main className="w-full pt-[60px] gap-[16px] bg-[#0C0D14] min-h-[100vh] px-[16px] max-sm:px-[8px]">
                <div className="mx-auto px-2 py-4 w-full">
                    <h1 className="text-2xl font-bold mb-4 text-white max-sm:text-[16px] max-md:text-[18px] max-lg:text-[20px]">
                        {title}
                    </h1>

                    {filteredGames.length === 0 ? (
                        <p className="text-white">No games found.</p>
                    ) : (
                        <div
                            className={`grid grid-cols-6 gap-4 max-md:grid-cols-3 max-lg:grid-cols-4 max-sm:grid-cols-2 max-sm:gap-2 max-lg:gap-3 w-full ${
                                isOriginals ? 'originals-grid !grid-cols-7' : ''
                            }`}
                        >
                            {filteredGames.map((item, itemIndex) => (
                                <Link
                                    key={`${item.id}-${itemIndex}`}
                                    to={`/game/${item.slug}`}
                                    className={`relative flex-shrink-0 ${
                                        isOriginals ? 'big-item' : 'game-item'
                                    } rounded-lg overflow-hidden border-2 border-solid border-transparent hover:border-[rgb(104,66,255)] w-full h-full`}
                                    style={
                                        isOriginals
                                            ? {
                                                  aspectRatio: '3/4',
                                              }
                                            : {}
                                    }
                                >
                                    <img
                                        src={
                                            item.thumbnail
                                                ? `/image/game/${
                                                      isOriginals && item.originalThumbnail ? 'largeThumb' : 'thumbnail'
                                                  }/${isOriginals && item.originalThumbnail ? item.originalThumbnail : item.thumbnail}`
                                                : isOriginals
                                                  ? 'https://via.placeholder.com/300x400?text=No+Image'
                                                  : 'https://via.placeholder.com/192x108?text=No+Image'
                                        }
                                        alt={item.title || 'Game image'}
                                        className="w-full h-full object-cover"
                                    />
                                    {!isOriginals && (
                                        <h3 className="game-item-title text-sm font-medium mt-1 text-center text-white truncate">
                                            {item.title || 'Untitled'}
                                        </h3>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                {isOriginals && (
                    <style>{`
        .big-item {
            position: relative;
            overflow: hidden;
            border-radius: 8px;
            width: 100%;
            height: 100%;
        }
        .big-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
            display: block;
        }
        .originals-grid {
            width: 100%;
            justify-content: stretch;
        }
    `}</style>
                )}
            </main>
        </DefaultLayout>
    );
}

export default CategoriesPage;
