import { useLocation, Link } from 'react-router-dom';
import { gameApi } from '../api/gamesApi';
import DefaultLayout from '../layouts/defaultLayout';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResultsPage() {
    const query = useQuery();
    const keyword = query.get('q') || '';
    const results = gameApi.filter((game) => game.title.toLowerCase().includes(keyword.toLowerCase()));

    return (
        <DefaultLayout>
            <main className="w-full pt-[80px] px-6 bg-[#0C0D14] min-h-[100vh]">
                <h1 className="text-2xl font-bold text-white mb-6">
                    Search results for: <span className="text-[rgb(104,66,255)]">{keyword}</span>
                </h1>

                {results.length === 0 ? (
                    <p className="text-white">No games found.</p>
                ) : (
                    <div className="grid grid-cols-5 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {results.map((item, itemIndex) => (
                            <Link
                                key={`${item.id}-${itemIndex}`}
                                to={`/game/${item.slug}`}
                                aria-label={`${item.title} game link`}
                                className="relative flex-shrink-0 game-item rounded-lg overflow-hidden border-2 border-solid border-transparent hover:border-[rgb(104,66,255)]"
                            >
                                <img
                                    src={
                                        item.thumbnail
                                            ? `/image/game/thumbnail/${item.thumbnail}`
                                            : 'https://via.placeholder.com/192x108?text=No+Image'
                                    }
                                    alt={item.title || 'Game image'}
                                    className="w-full h-[108px] object-cover"
                                />
                                <h3 className="game-item-title text-sm font-medium mt-1 text-center text-white">
                                    {item.title || 'Untitled'}
                                </h3>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </DefaultLayout>
    );
}

export default SearchResultsPage;
