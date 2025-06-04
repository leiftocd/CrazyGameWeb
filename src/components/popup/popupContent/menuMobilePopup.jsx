import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { categoriesData } from '../../../api/categoriesApi';
import { gameApi } from '../../../api/gamesApi';

function MenuMobilePopup({ closePopup }) {
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    let pathname = location.pathname;

    // Normalize to match Home slug
    const isHomePath = pathname === '/' || pathname === '/home';
    // Handle search input change
    const handleChange = (e) => {
        const value = e.target.value;
        setKeyword(value);

        if (value.trim() === '') {
            setSuggestions([]);
            return;
        }

        const matched = gameApi.filter((game) => game.title.toLowerCase().includes(value.toLowerCase()));
        setSuggestions(matched.slice(0, 5));
    };

    // Handle suggestion selection
    const handleSelect = (slug) => {
        setKeyword('');
        setSuggestions([]);
        navigate(`/game/${slug}`);
        closePopup();
    };

    // Handle search form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (suggestions.length > 0) {
            handleSelect(suggestions[0].slug);
        }
    };

    // Render category links with both icon and name
    const renderCategoryLinks = (categories) =>
        categories.map((category) => {
            const isHomeCategory = category.slug === 'home';
            const targetPath = isHomeCategory ? '/' : `/${category.slug}`;
            const isActive = isHomeCategory ? isHomePath : pathname === targetPath;

            return (
                <a
                    key={category.id}
                    href={targetPath}
                    className={`flex items-center gap-3 p-3 rounded-md w-full ${
                        isActive ? 'bg-[#2e2f3f]' : 'hover:bg-[#2e2f3f]'
                    }`}
                    onClick={() => closePopup()}
                >
                    <img
                        src={`/image/categories/${category.icon}`}
                        alt={category.name}
                        className="w-6 h-6 object-contain"
                    />
                    <span className="text-white text-[15px] font-semibold">{category.name}</span>
                </a>
            );
        });

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 bg-[#0c0d14] border-b border-[#28293d]">
                <button onClick={closePopup} className="p-2">
                    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L13.4142 12L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L12 13.4142L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071C3.90237 19.3166 3.90237 18.6834 4.29289 18.2929L10.5858 12L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L12 10.5858L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289Z"
                        />
                    </svg>
                </button>
                <div className="text-white text-lg font-semibold">Menu</div>
                <div className="w-6" /> {/* Spacer for alignment */}
            </div>

            <div className="p-4">
                <form onSubmit={handleSubmit} className="w-full h-10 bg-[#373952] rounded-full flex items-center px-4">
                    <input
                        type="text"
                        placeholder="Search"
                        value={keyword}
                        onChange={handleChange}
                        className="w-full bg-transparent text-[#AAADBE] text-[16px] font-semibold outline-none"
                    />
                    <button type="submit" className="p-2">
                        <svg className="w-5 h-5 fill-[#AAADBE]" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.5 4C6.91015 4 4 6.91015 4 10.5C4 14.0899 6.91015 17 10.5 17C14.0899 17 17 14.0899 17 10.5C17 6.91015 14.0899 4 10.5 4ZM2 10.5C2 5.80558 5.80558 2 10.5 2C15.1944 2 19 5.80558 19 10.5C19 15.1944 15.1944 19 10.5 19C5.80558 19 2 15.1944 2 10.5Z"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.2929 15.2929C15.6834 14.9024 16.3166 14.9024 16.7071 15.2929L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L15.2929 16.7071C14.9024 16.3166 14.9024 15.6834 15.2929 15.2929Z"
                            />
                        </svg>
                    </button>
                </form>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                    <ul className="mt-4 bg-[#1e1f2d] rounded-md shadow-lg p-4 flex flex-col gap-2">
                        {suggestions.map((game) => (
                            <li
                                key={game.id}
                                className="flex items-center gap-3 p-2 text-sm text-white hover:bg-[#2e2f3f] cursor-pointer rounded-md"
                                onClick={() => handleSelect(game.slug)}
                            >
                                <img
                                    src={
                                        game.thumbnail
                                            ? `/image/game/thumbnail/${game.thumbnail}`
                                            : 'https://via.placeholder.com/40x40?text=?'
                                    }
                                    alt={game.title}
                                    className="w-10 h-6 rounded object-cover"
                                />
                                <span className="truncate">{game.title}</span>
                            </li>
                        ))}
                        <li
                            className="mt-2 text-sm text-center text-[rgb(104,66,255)] cursor-pointer hover:underline"
                            onClick={() => {
                                navigate(`/search?q=${encodeURIComponent(keyword)}`);
                                setSuggestions([]);
                                setKeyword('');
                                closePopup();
                            }}
                        >
                            Search all results for <strong>{keyword}</strong>
                        </li>
                    </ul>
                )}
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#0c0d14]">
                <div className="flex flex-col gap-2">{renderCategoryLinks(categoriesData.mainNavigation)}</div>
                <hr className="my-2 border-[#28293d]" />
                <div className="flex flex-col gap-2">{renderCategoryLinks(categoriesData.categoriesGame)}</div>
                <hr className="my-2 border-[#28293d]" />
                <div className="flex flex-col gap-2">{renderCategoryLinks(categoriesData.footerNav)}</div>
            </div>
        </div>
    );
}

export default MenuMobilePopup;
