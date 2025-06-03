import { useState } from 'react';
import Header from '../components/header';
import Popup from '../components/popup/popup';

function DefaultLayout({ children }) {
    const [popupType, setPopupType] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleClosePopup = () => {
        setPopupType(null);
        setIsMenuOpen(false); // Close menu when any popup closes
    };

    const handleShowLoginPopup = () => {
        setPopupType('login');
    };

    const handleShowAccountPopup = () => {
        setPopupType('account');
    };

    const handleShowDeletePopup = () => {
        setPopupType('delete');
    };

    const handleShowMenuPopup = () => {
        setPopupType('menuMobile');
        setIsMenuOpen(true);
    };

    const handleBackToUserPopup = () => {
        setPopupType('user');
    };

    const handleBackToAccountPopup = () => {
        setPopupType('account');
    };

    return (
        <div className="w-full min-h-[100vh] flex flex-col">
            <Header
                ClickShowFriendPopup={() => setPopupType('friends')}
                ClickShowNotifyPopup={() => setPopupType('notificationPopup')}
                ClickShowMyGamePopup={() => setPopupType('myGames')}
                ClickShowLoginPopup={handleShowLoginPopup}
                ClickShowUserPopup={() => setPopupType('user')}
                ClickShowMenuPopup={handleShowMenuPopup} // Add menu popup trigger
                onToggleMenu={setIsMenuOpen}
            />
            <div
                className={`transition-transform duration-300 ${isMenuOpen && popupType !== 'menuMobile' ? 'ml-[60px]' : ''}`}
            >
                {children}
            </div>
            {popupType && (
                <Popup
                    type={popupType}
                    onClose={handleClosePopup}
                    showLoginPopup={handleShowLoginPopup}
                    showAccountPopup={handleShowAccountPopup}
                    showDeletePopup={handleShowDeletePopup}
                    backPopup={
                        popupType === 'account'
                            ? handleBackToUserPopup
                            : popupType === 'delete'
                              ? handleBackToAccountPopup
                              : undefined
                    }
                />
            )}
        </div>
    );
}

export default DefaultLayout;
