// src/components/BoxContentPopup.jsx
import { useContext, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import Button from '../../../../components/button/button';

function BoxContentPopup() {
    const { login } = useContext(AuthContext);
    const [error, setError] = useState(''); // Add state for UI error display

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Send access token to your server for validation and cookie setting
                const API_URL = import.meta.env.VITE_API_URL || 'https://your-server.onrender.com';
                const res = await axios.post(
                    `${API_URL}/auth/google`,
                    { access_token: tokenResponse.access_token },
                    { withCredentials: true },
                );

                // Update auth context with user data from server
                const { user } = res.data;
                login({
                    ...user,
                    access_token: tokenResponse.access_token,
                });

                setError(''); // Clear any previous errors
            } catch (err) {
                console.error('Google login error:', err);
                setError(err.response?.data?.error || 'Đăng nhập thất bại');
            }
        },
        onError: (error) => {
            console.error('Google Login Failed:', error);
            setError('Lỗi đăng nhập Google');
        },
        scope: 'openid profile email',
        ux_mode: 'popup',
    });

    // Handle button interactions
    const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleGoogleLogin();
    };

    const handleTouchStart = (e) => {
        e.currentTarget.style.transform = 'scale(0.98)';
    };

    const handleTouchEnd = (e) => {
        e.currentTarget.style.transform = 'scale(1)';
    };

    return (
        <div className="flex flex-col gap-3 py-4">
            <Button
                onClick={handleButtonClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="!bg-[#fff] !text-[#000] max-w-[100%] active:!bg-[#e4e4e4] !font-[500] cursor-pointer"
                style={{
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    userSelect: 'none',
                    minHeight: '44px',
                    minWidth: '44px',
                }}
            >
                <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-[20px] h-[20px] inline-block mr-2"
                >
                    <g>
                        <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                        <path fill="none" d="M0 0h48v48H0z" />
                    </g>
                </svg>
                Đăng nhập bằng Google
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error */}
        </div>
    );
}

export default BoxContentPopup;
