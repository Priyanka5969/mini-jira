import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./features/auth/authSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";

function AppContent() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  // Restore authentication on app load (works with both cookies and localStorage)
  useEffect(() => {
    const restoreAuth = async () => {
      // Check if we have a token in localStorage (fallback for blocked cookies)
      const token = localStorage.getItem('authToken');
      
      try {
        // Try to fetch user info to verify token is still valid
        await dispatch(fetchMe()).unwrap();
      } catch (error) {
        // Only clear token if it's a 401 (unauthorized), not network errors
        if (error.response?.status === 401 || !error.response) {
          localStorage.removeItem('authToken');
        }
      } finally {
        setAuthChecked(true);
      }
    };

    restoreAuth();
  }, [dispatch]);

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
