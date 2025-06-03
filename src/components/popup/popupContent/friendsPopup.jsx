import { useContext } from 'react';
import FriendsImg from '../../../../public/image/other/BringYourFriends2.svg';
import Button from '../../button/button';
import { AuthContext } from '../../../context/AuthContext';

function FriendsPopup({ closePopup, showLoginPopup }) {
    const { user } = useContext(AuthContext);

    return (
        <div className="w-[400px] bg-[#121b3a] h-[calc(100vh-76px)] absolute z-20 top-[8px] right-[8px] rounded-[10px] overflow-hidden">
            <div className="w-full h-full">
                <div className="radial-popup"></div>
                <div className="h-[60px] text-[16px] font-[600] text-[#fff] flex items-center justify-center">
                    Friends
                </div>
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
                <div className="absolute w-full mt-[60px] flex justify-center flex-col items-center">
                    <div className="flex justify-center">
                        <img src={FriendsImg} alt="" className="max-w-[150px] h-[150px]" />
                    </div>
                    <div className="font-bold text-[24px] text-[#fff] text-center block max-sm:text-[18px] max-lg:text-[20px]  ">
                        Bring your friends!
                    </div>
                    <div className="font-[600] text-[20px] text-[rgb(170,173,190)] block text-center my-[8px_24px] max-sm:text-[16px] max-lg:text-[18px] max-sm:px-[16px]">
                        Create a CrazyGames account to start inviting your friends.
                    </div>
                    <div className="flex justify-center items-center w-[90%]">
                        {!user ? (
                            <Button
                                onClick={() => {
                                    closePopup();
                                    showLoginPopup();
                                }}
                            >
                                Login / Register
                            </Button>
                        ) : (
                            <span className="font-bold text-[24px] text-[#fff] text-center block">Update later...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FriendsPopup;
