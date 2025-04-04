import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import UserManagement from "./components/UserManagement";
import ListingManagement from "./components/ListingManagement";
import PaymentManagement from "./components/PaymentManagement";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("isAuthenticated", true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.setItem("isAuthenticated", false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const authStatus = sessionStorage.getItem("isAuthenticated");
    if (authStatus) {
      setIsAuthenticated(authStatus === "true");
    }
  }, []);

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {isAuthenticated && (
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isAuthenticated && (
            <Header onToggleSidebar={toggleSidebar} onLogout={handleLogout} />
          )}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <Routes>
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Login onLogin={handleLogin} />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/users"
                element={
                  isAuthenticated ? (
                    <UserManagement />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/listings"
                element={
                  isAuthenticated ? (
                    <ListingManagement />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/payments"
                element={
                  isAuthenticated ? (
                    <PaymentManagement />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="*"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
