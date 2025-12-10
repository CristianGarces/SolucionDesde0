import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

const AppContent = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando aplicación...</div>;
    }

    return (
        <Routes>
            {/* Ruta principal - Con MainLayout si está autenticado */}
            <Route path="/" element={
                isAuthenticated ? (
                    <MainLayout>
                        <HomePage />
                    </MainLayout>
                ) : <Navigate to="/login" />
            } />

            {/* Rutas públicas sin layout */}
            <Route path="/login" element={
                isAuthenticated ? <Navigate to="/" /> : <LoginPage />
            } />

            <Route path="/register" element={
                isAuthenticated ? <Navigate to="/" /> : <RegisterPage />
            } />

            {/* Ruta 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;