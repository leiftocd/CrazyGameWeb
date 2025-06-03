import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function App() {
    const [user, setUser] = useState(null);

    const handleLoginSuccess = async (credentialResponse) => {
        try {
            // Verify the token with Google's API
            const response = await axios.get(
                `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credentialResponse.credential}`,
            );
            setUser(response.data);
        } catch (error) {
            console.error('Login Failed:', error);
        }
    };

    const handleLoginFailure = () => {
        console.error('Login Failed');
    };

    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">Login with Google</h1>
                    {user ? (
                        <div className="text-center">
                            <img src={user.picture} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4" />
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>
                            <button
                                onClick={() => setUser(null)}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                onError={handleLoginFailure}
                                buttonText="Login with Google"
                            />
                        </div>
                    )}
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;
