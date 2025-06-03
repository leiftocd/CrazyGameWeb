import PropTypes from 'prop-types';

function SlideBar({ onClick, onMouseEnter, onMouseLeave, isMenuOpen, className = ' ' }) {
    return (
        <button
            className={`${className} flex border-none bg-[unset] items-center justify-center h-full mr-[4px] px-[12px] cursor-pointer`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {isMenuOpen ? (
                <svg
                    viewBox="0 0 24 24"
                    focusable="false"
                    aria-hidden="true"
                    className="inline-block fill-[rgb(239,240,247)] w-[24px] h-[24px] hover:fill-[#aaadbe] max-sm:w-[20px] max-sm:h-[20px] max-lg:w-[22px]  max-lg:h-[22px]"
                >
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19 4C19.5523 4 20 3.55229 20 3C20 2.44772 19.5523 2 19 2L3 2C2.44772 2 2 2.44772 2 3C2 3.55228 2.44772 4 3 4L19 4ZM20.47 7.95628L15.3568 11.152C14.7301 11.5437 14.7301 12.4564 15.3568 12.848L20.47 16.0438C21.136 16.4601 22 15.9812 22 15.1958V8.80427C22 8.01884 21.136 7.54 20.47 7.95628ZM11 13C11.5523 13 12 12.5523 12 12C12 11.4477 11.5523 11 11 11L3 11C2.44771 11 2 11.4477 2 12C2 12.5523 2.44771 13 3 13L11 13ZM20 21C20 21.5523 19.5523 22 19 22L3 22C2.44771 22 2 21.5523 2 21C2 20.4477 2.44771 20 3 20L19 20C19.5523 20 20 20.4477 20 21Z"
                    ></path>
                </svg>
            ) : (
                <svg
                    viewBox="0 0 24 24"
                    focusable="false"
                    aria-hidden="true"
                    className="inline-block fill-[rgb(239,240,247)] w-[24px] h-[24px] hover:fill-[#aaadbe] max-sm:w-[20px] max-sm:h-[20px] max-lg:w-[22px]  max-lg:h-[22px]"
                >
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M21 4C21.5523 4 22 3.55229 22 3C22 2.44772 21.5523 2 21 2L5 2C4.44772 2 4 2.44772 4 3C4 3.55228 4.44772 4 5 4L21 4ZM3.53 16.0438L8.6432 12.848C9.26987 12.4563 9.26987 11.5437 8.6432 11.152L3.53 7.95625C2.86395 7.53997 2 8.01881 2 8.80425V15.1958C2 15.9812 2.86395 16.46 3.53 16.0438ZM21 13C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11L13 11C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13L21 13ZM22 21C22 21.5523 21.5523 22 21 22L5 22C4.44771 22 4 21.5523 4 21C4 20.4477 4.44771 20 5 20L21 20C21.5523 20 22 20.4477 22 21Z"
                    ></path>
                </svg>
            )}
        </button>
    );
}

SlideBar.propTypes = {
    onClick: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    isMenuOpen: PropTypes.bool.isRequired,
};

export default SlideBar;
