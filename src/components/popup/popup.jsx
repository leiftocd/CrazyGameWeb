import { lazy, Suspense, useEffect, useRef } from 'react';
import './popup.css';

const popupMap = {
    friends: lazy(() => import('./popupContent/friendsPopup')),
    myGames: lazy(() => import('./popupContent/myGamePopup')),
    notificationPopup: lazy(() => import('./popupContent/notificationPopup')),
    login: lazy(() => import('./popupContent/loginPopup')),
    user: lazy(() => import('./popupContent/userPopup')),
    account: lazy(() => import('./popupContent/accountSettingPopup')),
    delete: lazy(() => import('./popupContent/deleteAccountPopup')),
    menuMobile: lazy(() => import('./popupContent/menuMobilePopup')), // Add MenuMobilePopup
};

function Popup({ type, onClose, showLoginPopup, showAccountPopup, showDeletePopup, backPopup }) {
    const popupRef = useRef(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        isInitialMount.current = true;
        const handleClickOutside = (e) => {
            if (isInitialMount.current) {
                isInitialMount.current = false;
                return;
            }
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setTimeout(() => onClose(), 0);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [type, onClose]);

    const ContentComponent = popupMap[type];
    if (!ContentComponent) {
        return null;
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="backdrop" onClick={handleBackdropClick}>
            <div
                className={`popup-content ${type === 'menuMobile' ? 'w-full h-full' : ''}`}
                ref={popupRef}
                onClick={(e) => e.stopPropagation()}
            >
                <Suspense fallback={' '}>
                    <ContentComponent
                        closePopup={onClose}
                        showLoginPopup={showLoginPopup}
                        showAccountPopup={showAccountPopup}
                        showDeletePopup={showDeletePopup}
                        backPopup={backPopup}
                    />
                </Suspense>
            </div>
        </div>
    );
}

export default Popup;
