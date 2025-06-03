import { useContext } from 'react';
import Button from '../../button/button';
import { AuthContext } from '../../../context/AuthContext';
import Cookies from 'js-cookie';

function DeleteAccountPopup({ closePopup, backPopup }) {
    const { logout } = useContext(AuthContext);

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch('https://your-api.com/api/delete-account', {
                method: 'DELETE',
                credentials: 'include', // Include cookies in the request
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed, e.g., Bearer token from cookies
                    Authorization: `Bearer ${Cookies.get('google_access_token') || ''}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            // Clear cookies
            Cookies.remove('google_user');
            Cookies.remove('google_access_token');
            Cookies.remove('login_method');
            Cookies.remove('email_pending');

            // Update auth state
            logout();

            // Close the popup
            closePopup();
        } catch (err) {
            console.warn('Account deletion failed:', err.message);
            // Optionally show an error message to the user
            alert('Failed to delete account. Please try again.');
        }
    };

    return (
        <div className="w-[400px] bg-[rgb(26,27,40)] h-[calc(100vh-76px)] absolute z-20 top-[8px] right-[8px] rounded-[10px] overflow-hidden">
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
                    Delete your account
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
                <div className="flex flex-col p-[20px_22px_8px]">
                    <div className="text-center mb-[16px] text-[16px] font-[400] text-[rgb(170,173,190)]">
                        You&#39;re about to start the process of deleting your CrazyGames account. Your gaming history
                        and progress will be deleted forever. Any in-game purchases made using this account will be
                        lost.
                    </div>
                    <Button className="!bg-[rgb(231,13,92)]" onClick={handleDeleteAccount}>
                        Delete my account
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DeleteAccountPopup;
