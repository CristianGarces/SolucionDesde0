import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import ProductsPage from './pages/ProductsPage';
import CreateProductPage from './pages/CreateProductPage';

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

            <Route path="/profile" element={
                isAuthenticated ? (
                    <MainLayout>
                        <ProfilePage />
                    </MainLayout>
                ) : <Navigate to="/login" />
            } />

            <Route path="/products" element={
                isAuthenticated ? (
                    <MainLayout>
                        <ProductsPage />
                    </MainLayout>
                ) : <Navigate to="/login" />
            } />

            <Route path="/products/create" element={
                isAuthenticated ? (
                    <MainLayout>
                        <CreateProductPage />
                    </MainLayout>
                ) : <Navigate to="/login" />
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