import { useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { AuthContext } from '../../../../context/AuthContext';
import Button from '../../../../components/button/button';

function BoxContentPopup() {
    const { login } = useContext(AuthContext);

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
        },
        scope: 'openid profile email',
        ux_mode: 'popup', // Force popup mode
        // redirect_uri: window.location.origin, // redirect URI
    });

    return (
        <div className="flex flex-col gap-3 py-4">
            <Button
                onClick={handleGoogleLogin}
                className="!bg-[#fff] !text-[#000] max-w-[100%] hover:!bg-[#e4e4e4] !font-[500]"
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
        </div>
    );
}

export default BoxContentPopup;
