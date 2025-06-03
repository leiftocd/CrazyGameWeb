function notificationPopup({ closePopup }) {
    return (
        <div className="w-[400px] bg-[rgb(26,27,40)] h-[calc(100vh-76px)] absolute z-20 top-[8px] right-[8px] rounded-[10px] overflow-hidden ">
            <div className=" w-full h-full ">
                <div className="h-[60px] text-[16px] font-[600] text-[#fff] flex items-center justify-center">
                    Notifications
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
                <div
                    className="w-full flex flex-col h-full justify-center pb-[95px]"
                    style={{ height: 'calc(100% - 145px); width: calc(100% - 32px);' }}
                >
                    <div className="w-full text-center text-[30px]">😴</div>
                    <div className="w-full text-center font-[800] text-[16px] text-[#fff]">
                        No notifications for the moment
                    </div>
                </div>
            </div>
        </div>
    );
}

export default notificationPopup;
