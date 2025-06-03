import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext'; // Adjust path if needed
import SlideBar from '../components/button/slideBar';
import Logo from '../components/button/logo';
import Friend from '../components/button/friends';
import Favorite from '../components/button/favorite';
import Search from '../components/button/search';
import NavCategories from './nav/NavCategories';
import Notify from './button/notifications';
import UserButton from './button/userButton';
import Button from '../components/button/button';

function Header({
    ClickShowFriendPopup,
    ClickShowMyGamePopup,
    ClickShowLoginPopup,
    ClickShowNotifyPopup,
    ClickShowUserPopup,
    ClickShowMenuPopup,
    onToggleMenu,
}) {
    const { user } = useContext(AuthContext); // Get user from AuthContext
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        onToggleMenu(!isMenuOpen);
    };

    return (
        <header className="h-[60px] flex justify-between items-center w-full bg-[rgba(33,34,51,0.9)] fixed top-0 right-0 left-0 z-10">
            <div className="flex h-[48px] pl-[8px] ">
                <div className="h-[48px] w-[48px] max-md:hidden">
                    <SlideBar onClick={handleToggleMenu} isMenuOpen={isMenuOpen} className="max-" />
                </div>
                <Logo />
                <div className="flex items-center justify-center">
                    <button className="hidden max-md:!flex " onClick={ClickShowMenuPopup}>
                        <svg
                            viewBox="0 0 22 22"
                            focusable="false"
                            aria-hidden="true"
                            className="w-[22px] h-[22px] fill-[rgb(239,240,247)]"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.8377 3.05557C4.82285 3.05557 2.37585 5.50091 2.37585 8.51836C2.37585 11.5358 4.82285 13.9812 7.8377 13.9812C10.8525 13.9812 13.2995 11.5358 13.2995 8.51836C13.2995 5.50091 10.8525 3.05557 7.8377 3.05557ZM0.38974 8.51836C0.38974 4.40401 3.72429 1.06946 7.8377 1.06946C11.951 1.06946 15.2856 4.40401 15.2856 8.51836C15.2856 10.2161 14.7169 11.7819 13.7596 13.0349L19.9599 19.2353C20.3478 19.6232 20.3478 20.2519 19.9599 20.6398C19.5722 21.0275 18.9434 21.0275 18.5556 20.6398L12.3553 14.4394C11.1022 15.3967 9.53641 15.9654 7.8377 15.9654C3.72429 15.9654 0.38974 12.6309 0.38974 8.51836ZM18.1883 5.04169C17.6399 5.04169 17.1953 5.48629 17.1953 6.03474C17.1953 6.58319 17.6399 7.02779 18.1883 7.02779H20.1745C20.7229 7.02779 21.1675 6.58319 21.1675 6.03474C21.1675 5.48629 20.7229 5.04169 20.1745 5.04169H18.1883ZM15.2091 2.06252C15.2091 1.51407 15.6537 1.06946 16.2022 1.06946H20.1745C20.7229 1.06946 21.1675 1.51407 21.1675 2.06252C21.1675 2.61097 20.7229 3.05557 20.1745 3.05557H16.2022C15.6537 3.05557 15.2091 2.61097 15.2091 2.06252ZM19.1814 9.01391C18.633 9.01391 18.1883 9.45852 18.1883 10.007C18.1883 10.5554 18.633 11 19.1814 11H20.1745C20.7229 11 21.1675 10.5554 21.1675 10.007C21.1675 9.45852 20.7229 9.01391 20.1745 9.01391H19.1814Z"
                                stroke="currentColor"
                                strokeWidth="0.5"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
            <Search />

            <div className="px-[8px_20px] h-[40px] flex ">
                <div className="h-full mr-[8px] flex items-center justify-center">
                    <Friend onClick={ClickShowFriendPopup} />
                </div>
                <div className="h-full mr-[8px] flex items-center justify-center">
                    <Favorite onClick={ClickShowMyGamePopup} />
                </div>
                {user ? (
                    <>
                        <div className="h-full mr-[8px] flex items-center justify-center">
                            <Notify onClick={ClickShowNotifyPopup} />
                        </div>
                        <div className="h-full flex items-center justify-center">
                            <UserButton onClick={ClickShowUserPopup} />
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <Button onClick={ClickShowLoginPopup}>Log in</Button>
                    </div>
                )}
            </div>
            {isMenuOpen && <NavCategories />}
        </header>
    );
}

export default Header;
