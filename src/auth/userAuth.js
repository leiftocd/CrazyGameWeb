import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useAuth = () => {
    const [user, setUser] = useState(() => {
        const cookieUser = Cookies.get('google_user');
        return cookieUser ? JSON.parse(cookieUser) : null;
    });

    useEffect(() => {
        if (user) {
            Cookies.set('google_user', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'lax' });
            if (user.access_token) {
                Cookies.set('google_access_token', user.access_token, { expires: 7, secure: true, sameSite: 'lax' });
            }
        }
    }, [user]);

    const login = (userProfile) => {
        setUser(userProfile);
    };

    const logout = () => {
        setUser(null);
        Cookies.remove('google_user');
        Cookies.remove('google_access_token');
    };

    return { user, login, logout };
};

export default useAuth;
