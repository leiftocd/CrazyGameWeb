import { useContext } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '../../../context/AuthContext';
import userImg from '../../../../public/image/user/user.jpg';

function UserPopup({ closePopup, showAccountPopup }) {
    const { logout, user } = useContext(AuthContext);

    const handleLogout = async () => {
        Cookies.remove('google_user');
        Cookies.remove('google_access_token');
        Cookies.remove('login_method');
        Cookies.remove('email_pending');

        try {
            await fetch('https://your-api.com/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (err) {
            console.warn('Backend logout failed or not available:', err.message);
        }

        logout();
        closePopup();
    };

    return (
        <div className="w-[400px] bg-[rgb(26,27,40)] h-[calc(100vh-76px)] absolute z-20 top-[8px] right-[8px] rounded-[10px] overflow-hidden pt-[56px] popup-res-mb">
            <div className="w-full h-full flex flex-col gap-4">
                <button className="absolute right-[24px] top-[16px] cursor-pointer group" onClick={closePopup}>
                    <svg
                        viewBox="0 0 24 24"
                        focusable="false"
                        aria-hidden="true"
                        className="w-[24px] h-[24px] fill-[#fff] group-hover:fill-[rgba(170,173,190,80%)] transition-all duration-300 ease-in-out"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L12 10.5858L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L13.4142 12L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L12 13.4142L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071C3.90237 19.3166 3.90237 18.6834 4.29289 18.2929L10.5858 12L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289Z"
                        ></path>
                    </svg>
                </button>

                <div className="w-full flex items-center justify-center">
                    <img
                        src={userImg}
                        alt="user"
                        className="rounded-[50%] w-[70px] h-[70px] border-3 border-solid border-[#fff]"
                    />
                </div>

                <div className="w-full text-center">
                    <h3 className="text-[20px] text-[#fff] font-[700]">{user?.name || '@username'}</h3>
                    <h4 className="text-[14px] text-[#fff] font-[500]">{user?.email || 'user email'}</h4>
                </div>

                <div className="p-[0_24px_16px_20px] ">
                    <div className="dividers text-[rgb(132,133,139)] "></div>
                </div>

                <div className="block px-[16px]">
                    <button
                        onClick={showAccountPopup} // Trigger AccountSettingPopup
                        className="bg-none border-none outline-none flex items-center text-[#fff] text-[16px] font-[400] cursor-pointer 
            hover:text-[rgb(102,106,127)] ease-in-out duration-300 transition-all"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            focusable="false"
                            aria-hidden="true"
                            className="w-[32px] h-[32px] pr-[8px] fill-[rgb(102,106,127)]"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.35285 4.08139C10.0266 1.3062 13.9734 1.3062 14.6471 4.08139C14.7628 4.5579 15.3088 4.78402 15.7275 4.52888C18.1662 3.04293 20.9571 5.83376 19.4711 8.27251C19.216 8.69125 19.4421 9.23717 19.9186 9.35285C22.6938 10.0266 22.6938 13.9734 19.9186 14.6471C19.4421 14.7628 19.216 15.3088 19.4711 15.7275C20.9571 18.1662 18.1662 20.9571 15.7275 19.4711C15.3088 19.216 14.7628 19.4421 14.6471 19.9186C13.9734 22.6938 10.0266 22.6938 9.35285 19.9186C9.23717 19.4421 8.69125 19.216 8.27252 19.4711C5.83376 20.9571 3.04293 18.1662 4.52889 15.7275C4.78402 15.3088 4.5579 14.7628 4.08139 14.6471C1.3062 13.9734 1.3062 10.0266 4.08139 9.35285C4.5579 9.23717 4.78402 8.69125 4.52888 8.27251C3.04293 5.83376 5.83376 3.04293 8.27252 4.52888C8.69125 4.78402 9.23717 4.55789 9.35285 4.08139ZM12.7036 4.55323C12.5245 3.81559 11.4755 3.81559 11.2964 4.55322C10.8612 6.34596 8.80726 7.19673 7.23186 6.23681C6.58365 5.84185 5.84185 6.58364 6.23681 7.23185C7.19673 8.80726 6.34596 10.8612 4.55322 11.2964C3.81559 11.4755 3.81559 12.5245 4.55323 12.7036C6.34596 13.1388 7.19673 15.1927 6.23682 16.7681C5.84186 17.4164 6.58365 18.1581 7.23186 17.7632C8.80726 16.8033 10.8612 17.654 11.2964 19.4468C11.4755 20.1844 12.5245 20.1844 12.7036 19.4468C13.1388 17.654 15.1927 16.8033 16.7681 17.7632C17.4164 18.1581 18.1581 17.4164 17.7632 16.7681C16.8033 15.1927 17.654 13.1388 19.4468 12.7036C20.1844 12.5245 20.1844 11.4755 19.4468 11.2964C17.654 10.8612 16.8033 8.80726 17.7632 7.23185C18.1581 6.58364 17.4164 5.84185 16.7681 6.23682C15.1927 7.19673 13.1388 6.34596 12.7036 4.55323ZM12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10ZM8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z"
                            ></path>
                        </svg>
                        Account settings
                    </button>
                </div>

                <div className="block px-[16px]">
                    <button
                        onClick={handleLogout}
                        className="bg-none border-none outline-none flex items-center text-[#fff] text-[16px] font-[400] cursor-pointer 
            hover:text-[rgb(102,106,127)] ease-in-out duration-300 transition-all"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            focusable="false"
                            aria-hidden="true"
                            className="w-[32px] h-[32px] pr-[6px] fill-[rgb(102,106,127)] ml-[2px]"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6 5C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19H10C11.1046 19 12 18.1046 12 17V16C12 15.4477 12.4477 15 13 15C13.5523 15 14 15.4477 14 16V17C14 19.2091 12.2091 21 10 21H6C3.79086 21 2 19.2091 2 17V7C2 4.79086 3.79086 3 6 3H10C12.2091 3 14 4.79086 14 7V8C14 8.55228 13.5523 9 13 9C12.4477 9 12 8.55228 12 8V7C12 5.89543 11.1046 5 10 5H6ZM16.2929 7.29289C16.6834 6.90237 17.3166 6.90237 17.7071 7.29289L21.7071 11.2929C22.0976 11.6834 22.0976 12.3166 21.7071 12.7071L17.7071 16.7071C17.3166 17.0976 16.6834 17.0976 16.2929 16.7071C15.9024 16.3166 15.9024 15.6834 16.2929 15.2929L18.5858 13L7 13C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11L18.5858 11L16.2929 8.70711C15.9024 8.31658 15.9024 7.68342 16.2929 7.29289Z"
                            ></path>
                        </svg>
                        Log out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserPopup;
