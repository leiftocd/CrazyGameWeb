import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from './context/AuthContext';
import useAuth from './auth/userAuth';
import HomePage from './pages/homePage.jsx';
import GamePlayPage from './pages/gamePlayPage';
import CategoriesPage from './pages/categoriesPage';
import SearchResultsPage from './pages/searchResultsPage';
import ScrollToTop from './components/scroll/scrollToTop';

function App() {
    const auth = useAuth();

    return (
        <GoogleOAuthProvider clientId="714648690123-ds96n7pr2jchljki7etjfphsd6s7ak8s.apps.googleusercontent.com">
            <AuthContext.Provider value={auth}>
                {' '}
                {/* Add GameProvider */}
                <BrowserRouter>
                    <ScrollToTop />
                    <ToastContainer />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/game/:slug" element={<GamePlayPage />} />
                        <Route path="/:slug" element={<CategoriesPage />} />
                        <Route path="/search" element={<SearchResultsPage />} />
                        <Route
                            path="*"
                            element={
                                <div className="text-white p-4">
                                    404: Page not found.{' '}
                                    <a href="/" className="text-[#6842ff] underline">
                                        Back to Home
                                    </a>
                                </div>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
}

export default App;
