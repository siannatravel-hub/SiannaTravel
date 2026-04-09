import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Spinner from './components/ui/Spinner';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Packages = lazy(() => import('./pages/Packages'));
const PackageDetail = lazy(() => import('./pages/PackageDetailNew'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const BeachTravel = lazy(() => import('./pages/BeachTravel'));
const CulturalTravel = lazy(() => import('./pages/CulturalTravel'));
const AdventureTravel = lazy(() => import('./pages/AdventureTravel'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageFeatured = lazy(() => import('./pages/admin/ManageFeatured'));
const ManagePackages = lazy(() => import('./pages/admin/ManagePackages'));
const ManageBlog = lazy(() => import('./pages/admin/ManageBlog'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* Public routes with layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/paquetes" element={<Packages />} />
              <Route path="/paquetes/:id" element={<PackageDetail />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/terminos" element={<Terms />} />
              <Route path="/privacidad" element={<Privacy />} />
              <Route path="/viajes-playa" element={<BeachTravel />} />
              <Route path="/viajes-culturales" element={<CulturalTravel />} />
              <Route path="/viajes-aventura" element={<AdventureTravel />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Route>

            {/* Admin routes without main layout */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/featured"
              element={
                <ProtectedRoute>
                  <ManageFeatured />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/packages"
              element={
                <ProtectedRoute>
                  <ManagePackages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog"
              element={
                <ProtectedRoute>
                  <ManageBlog />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
