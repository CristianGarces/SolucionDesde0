import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import CategoriesPage from './pages/Category/CategoriesPage';
import CreateCategoryPage from './pages/Category/CreateCategoryPage';
import EditCategoryPage from './pages/Category/EditCategoryPage';
import NotFoundPage from './pages/NotFoundPage';
import CreateProductPage from './pages/Product/CreateProductPage';
import ProductsPage from './pages/Product/ProductsPage';
import ProfilePage from './pages/User/ProfilePage';
import EditProductPage from './pages/Product/EditProductPage';
import UsersPage from './pages/User/UsersPage';
import CreateUserPage from './pages/User/CreateUserPage';
import EditUserPage from './pages/User/EditUserPage';


const AppContent = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando aplicacion...</div>;
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

            {/* Rutas de productos */}
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

            <Route path="/products/edit/:id" element={
                isAuthenticated ? (
                    <MainLayout>
                        <EditProductPage />
                    </MainLayout>
                ) : <Navigate to="/login" />
            } />

            {/* Rutas de categorías (solo Admin) */}
            <Route path="/categories" element={
                isAuthenticated ? (
                    <MainLayout>
                        <CategoriesPage />
                    </MainLayout>
                ) : <Navigate to="/login" />
            } />

            <Route path="/categories/create" element={
                isAuthenticated ? (
                    <MainLayout>
                        <CreateCategoryPage />
                    </MainLayout>
                ) : <Navigate to="/login" />
            } />

            <Route path="/categories/edit/:id" element={
                isAuthenticated ? (
                    <MainLayout>
                        <EditCategoryPage />
                    </MainLayout>
                ) : <Navigate to="/login" />
            } />

            {/* Rutas de usuarios (solo Admin) */}
            <Route path="/users" element={
                isAuthenticated ? (
                    <MainLayout>
                        <UsersPage />
                    </MainLayout>
                ) : <Navigate to="/login" />
            } />

            <Route path="/users/create" element={
                isAuthenticated ? (
                    <MainLayout>
                        <CreateUserPage />
                    </MainLayout>
                ) : <Navigate to="/login" />
            } />

            <Route path="/users/edit/:id" element={
                isAuthenticated ? (
                    <MainLayout>
                        <EditUserPage />
                    </MainLayout>
                ) : <Navigate to="/login" />
            } />
            <Route path="/profile" element={
                isAuthenticated ? (
                    <MainLayout>
                        <ProfilePage />
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