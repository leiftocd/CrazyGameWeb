import { useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import Button from '../../../../components/button/button';

function BoxContentPopup() {
    const { login } = useContext(AuthContext);

    // Detect iOS device
    const isIOS = () => {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    };

    // Check if running in WebView
    const isWebView = () => {
        const userAgent = navigator.userAgent;
        return (
            userAgent.includes('wv') || // Android WebView
            (userAgent.includes('Version/') && userAgent.includes('Mobile/')) // iOS WebView
        );
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Token response:', tokenResponse);
            try {
                const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                const userProfile = res.data;
                login({
                    ...userProfile,
                    access_token: tokenResponse.access_token,
                });
            } catch (err) {
                console.error('Failed to fetch user info:', err);
            }
        },
        onError: (error) => {
            console.error('Google Login Failed:', error);

            // Handle iOS WebView error specifically
            if (isIOS() && isWebView()) {
                alert('Vui lòng mở ứng dụng trong trình duyệt Safari để đăng nhập Google');
            }
        },
        scope: 'openid profile email',
        // Force redirect flow for iOS to avoid WebView issues
        ux_mode: isIOS() && isWebView() ? 'redirect' : 'popup',
        // Add redirect URI for iOS
        redirect_uri: window.location.origin,
    });

    // Alternative method: Open in external browser for iOS WebView
    const handleIOSLogin = () => {
        // eslint-disable-next-line no-undef
        const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Your Google Client ID
        const redirectUri = encodeURIComponent(window.location.origin);
        const scope = encodeURIComponent('openid profile email');

        const googleAuthUrl =
            `https://accounts.google.com/oauth/authorize?` +
            `client_id=${clientId}&` +
            `redirect_uri=${redirectUri}&` +
            `scope=${scope}&` +
            `response_type=code&` +
            `access_type=offline`;

        // Try to open in external browser
        window.open(googleAuthUrl, '_system', 'location=yes');
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // If iOS WebView, use alternative method
        if (isIOS() && isWebView()) {
            handleIOSLogin();
        } else {
            handleGoogleLogin();
        }
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
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-[20px] h-[20px]">
                    <g>
                        <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        ></path>
                        <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        ></path>
                        <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        ></path>
                        <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        ></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </g>
                </svg>
                Đăng nhập bằng Google
            </Button>

            {/* Show warning for iOS WebView users */}
            {isIOS() && isWebView() && (
                <div className="text-sm text-orange-600 text-center">Nếu gặp lỗi, vui lòng mở trong Safari</div>
            )}
        </div>
    );
}

export default BoxContentPopup;
