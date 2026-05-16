import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { GalleryPage } from "./pages/GalleryPage";
import { AboutPage } from "./pages/AboutPage";
import { BookingPage } from "./pages/BookingPage";
import { ContactPage } from "./pages/ContactPage";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";

export const App = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};
