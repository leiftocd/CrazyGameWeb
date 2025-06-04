function AccountSettingPopup({ closePopup, backPopup, showDeletePopup }) {
    return (
        <div className="w-[400px] bg-[rgb(26,27,40)] h-[calc(100vh-76px)] absolute z-20 top-[8px] right-[8px] rounded-[10px] overflow-hidden pt-[56px] popup-res-mb">
            <div className="w-full h-full flex flex-col gap-4">
                <button className="absolute left-[24px] top-[16px] cursor-pointer group" onClick={backPopup}>
                    <svg
                        viewBox="0 0 24 24"
                        focusable="false"
                        aria-hidden="true"
                        className="w-[24px] h-[24px] fill-[#fff] group-hover:fill-[rgba(170,173,190,80%)] transition-all duration-300 ease-in-out"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M16.7424 21.6699C16.3724 22.08 15.7401 22.1124 15.3301 21.7424L7.0186 14.2424C5.66045 13.0169 5.66046 10.9831 7.0186 9.75758L15.3301 2.25758C15.7401 1.88758 16.3724 1.92003 16.7424 2.33006C17.1124 2.74009 17.08 3.37242 16.6699 3.74241L8.35847 11.2424C7.8805 11.6737 7.8805 12.3263 8.35847 12.7576L16.6699 20.2576C17.08 20.6276 17.1124 21.2599 16.7424 21.6699Z"
                        ></path>
                    </svg>
                </button>
                <div className="h-[60px] text-[16px] font-[600] text-[#fff] flex items-center justify-center">
                    Account settings
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
                <div className="flex flex-col p-[32px_20px]">
                    <div className="text-[rgb(118,122,142)] text-[14px] font-[400]">Delete your account</div>
                    <div>
                        <button
                            className="flex justify-between items-center px-[16px] text-[16px] font-[500] text-[#fff] mt-[8px]"
                            onClick={showDeletePopup} // Trigger deleteAccountPopup
                        >
                            Delete your CrazyGames account
                            <div>
                                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M15.6699 5.25759C15.2599 4.88759 14.6276 4.92005 14.2576 5.33007C13.8876 5.7401 13.92 6.37243 14.3301 6.74243L19.0483 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H19.0483L14.3301 17.2576C13.92 17.6276 13.8876 18.2599 14.2576 18.6699C14.6276 19.08 15.2599 19.1124 15.6699 18.7424L21.2109 13.7424C22.263 12.793 22.263 11.207 21.2109 10.2576L15.6699 5.25759Z"
                                    ></path>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="p-4 text-[#fff]">
                    <div className="divider"></div>
                </div>
            </div>
        </div>
    );
}

export default AccountSettingPopup;
