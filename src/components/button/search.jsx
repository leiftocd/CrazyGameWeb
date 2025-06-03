import { gameApi } from '../../api/gamesApi';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Search() {
    const [keyword, setKeyword] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

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

    const handleSelect = (slug) => {
        setKeyword('');
        setSuggestions([]);
        navigate(`/game/${slug}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (suggestions.length > 0) {
            handleSelect(suggestions[0].slug);
        }
    };

    // Disable scroll when suggestions open
    useEffect(() => {
        if (suggestions.length > 0) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [suggestions]);

    return (
        <>
            {/* Backdrop layer */}
            {suggestions.length > 0 && (
                <div
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-40"
                    onClick={() => setSuggestions([])}
                />
            )}

            {/*  Search Box */}
            <div className="relative max-w-[460px] w-full z-50 max-md:hidden max-lg:max-w-[360px]">
                <form
                    onSubmit={handleSubmit}
                    className="w-full h-[40px] bg-[#373952] rounded-[30px] text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                    <input
                        type="text"
                        placeholder="Search"
                        value={keyword}
                        onChange={handleChange}
                        className="w-full h-full p-[1px_2px_1px_16px] text-[#AAADBE] text-[16px] font-[700] outline-none rounded-[30px]"
                    />
                    <button
                        type="submit"
                        className="absolute w-[36px] h-[36px] top-[2px] right-[8px] flex items-center justify-center"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            focusable="false"
                            aria-hidden="true"
                            className="w-[20px] h-[20px] fill-[#AAADBE]"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10.5 4C6.91015 4 4 6.91015 4 10.5C4 14.0899 6.91015 17 10.5 17C14.0899 17 17 14.0899 17 10.5C17 6.91015 14.0899 4 10.5 4ZM2 10.5C2 5.80558 5.80558 2 10.5 2C15.1944 2 19 5.80558 19 10.5C19 15.1944 15.1944 19 10.5 19C5.80558 19 2 15.1944 2 10.5Z"
                            ></path>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.2929 15.2929C15.6834 14.9024 16.3166 14.9024 16.7071 15.2929L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L15.2929 16.7071C14.9024 16.3166 14.9024 15.6834 15.2929 15.2929Z"
                            ></path>
                        </svg>
                    </button>
                </form>

                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                    <ul className="absolute top-[calc(100%+24px)] left-1/2 -translate-x-1/2 w-full bg-[#1e1f2d] rounded-md shadow-lg z-50 overflow-hidden p-4 flex flex-col gap-2">
                        {suggestions.map((game) => (
                            <li
                                key={game.id}
                                className="flex items-center gap-2 h-[45px] p-[4px] text-sm text-white hover:bg-[#2e2f3f] cursor-pointer rounded-md"
                                onClick={() => handleSelect(game.slug)}
                            >
                                <img
                                    src={
                                        game.thumbnail
                                            ? `/image/game/thumbnail/${game.thumbnail}`
                                            : 'https://via.placeholder.com/40x40?text=?'
                                    }
                                    alt={game.title}
                                    className="w-[60px] h-[36px] rounded-[10px] object-cover"
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
                            }}
                        >
                            Search all results for <strong>{keyword}</strong>
                        </li>
                    </ul>
                )}
            </div>
        </>
    );
}

export default Search;
