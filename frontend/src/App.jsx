import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "./features/auth/authSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";

function AppContent() {
  const dispatch = useDispatch();

  // Restore authentication on app load (works with both cookies and localStorage)
  useEffect(() => {
    // Check if we have a token in localStorage (fallback for blocked cookies)
    const token = localStorage.getItem('authToken');
    if (token) {
      // Try to fetch user info to verify token is still valid
      dispatch(fetchMe()).catch(() => {
        // Token is invalid, clear it
        localStorage.removeItem('authToken');
      });
    } else {
      // Try with cookies (if available)
      dispatch(fetchMe()).catch(() => {
        // No valid auth, user will be redirected to login
      });
    }
  }, [dispatch]);

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
