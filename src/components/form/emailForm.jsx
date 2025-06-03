import { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailForm = () => {
    const [email, setEmail] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const { login } = useContext(AuthContext);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setIsValid(emailPattern.test(value));
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
        if (!email) setIsFocused(false);
    };

    const handleSubmit = () => {
        if (!isValid) return;

        if (email === 'nguyenvana@gmail.com') {
            const fakeUser = {
                name: 'nguyenvana',
                email: 'nguyenvana@gmail.com',
                sub: 'fake_user_001',
                method: 'email',
            };

            Cookies.set('google_user', JSON.stringify(fakeUser), { expires: 7, secure: true, sameSite: 'lax' });
            Cookies.set('login_method', 'email', { expires: 7, secure: true, sameSite: 'lax' });

            login(fakeUser); // ✅ Login thành công
            return;
        }

        // ❌ Email chưa được đăng ký
        Cookies.set('email_pending', email, { expires: 7, secure: true, sameSite: 'lax' });

        toast.warning('This email has not been registered yet.', {
            position: 'top-center',
            autoClose: 3000,
            pauseOnHover: true,
            theme: 'dark',
        });
    };

    return (
        <div className="flex items-center flex-col gap-2 max-w-md mx-auto mt-4">
            <div className="relative w-full">
                <input
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="px-3 py-4.5 border-gray-500 border-2 border-solid rounded-[8px] text-sm w-full focus:outline-none focus:border-[#6842ff]"
                />
                <label
                    className={`absolute left-3 transition-all duration-200 text-[#aaadbe] text-sm pointer-events-none h-full flex items-center ${
                        isFocused || email ? '-top-3.5 text-[12px]' : ' top-0 text-[14px]'
                    }`}
                >
                    Enter your email
                </label>
            </div>
            <button
                onClick={handleSubmit}
                disabled={!isValid}
                className={`py-[14px] rounded-[30px] text-sm transition-colors w-full mt-[16px] text-[16px] font-bold ${
                    isValid
                        ? ' bg-[rgb(104,66,255)] hover:bg-[#8668ff] text-white cursor-pointer'
                        : 'bg-[rgb(40,41,61)] text-[rgb(71,73,103)] cursor-not-allowed'
                }`}
            >
                Continue
            </button>
        </div>
    );
};

export default EmailForm;
