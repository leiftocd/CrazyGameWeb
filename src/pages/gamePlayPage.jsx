// src/pages/GamePlayPage.jsx
import { useParams } from 'react-router-dom';
import GameLayout from '../layouts/gameLayout';

function GamePlayPage() {
    const { slug } = useParams(); // Extract slug from URL
    return <GameLayout slug={slug} />;
}

export default GamePlayPage;
