import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import './styles/index.css';

// Lazy load all route components for better performance
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Services = lazy(() => import('./pages/Services'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Contact = lazy(() => import('./pages/Contact'));
const ProjectDetail = lazy(() => import('./components/ProjectDetails'));
const Blog = lazy(() => import('./pages/Blog'));
const GetAquote = lazy(() => import('./pages/GetAquote'));
const ServiceDetails = lazy(() => import('./components/ServiceDetails'));
const AboutUsSection = lazy(() => import('./components/AboutUsSection'));
const ProductsPage = lazy(() => import('./pages/Products'));
const ProjectSection = lazy(() => import('./components/projects/ProjectsSection'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const BlogDetail = lazy(() => import('./components/BlogDetail'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--primary-green)"></div>
  </div>
);

export default function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="projects/section/:id" element={<ProjectSection />} />
                <Route path="services" element={<Services />} />
                <Route path="services/:title" element={<ServiceDetails />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:category" element={<ProductsPage />} />
                <Route path="about-us" element={<AboutUs />} />
                <Route path="about-us/:id" element={<AboutUsSection />} />
                <Route path="contact" element={<Contact />} />
                <Route path="blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="get-a-quote" element={<GetAquote />} />
                <Route path="testimonials" element={<Testimonials />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}