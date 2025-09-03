import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthProvider, AuthContext } from "./hooks/useAuth";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Layout from "../src/components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import UserManagement from "./components/Users/UserManagement";
import RoleManagement from "./components/Roles/RoleManagement";
import PermissionManagement from "./components/Permissions/PermissionManagement";
import DoctorsView from "./components/Data/DoctorsView";
import ChemistsView from "./components/Data/ChemistsView";
import HospitalsView from "./components/Data/HospitalsView";
import TerritoriesView from "./components/Data/TerritoriesView";
import ResetPassword from "./pages/ActivateAccount";
import DrugsView from "./components/Data/DrugsView";

export default function App() {
  const auth = useAuthProvider();
  const location = useLocation();

  // Check if current path is activate-account - this should be independent of auth
  if (location.pathname === "/activate-account") {
    return (
      <AuthContext.Provider value={auth}>
        <ResetPassword />
      </AuthContext.Provider>
    );
  }

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (auth.authMode === "login") {
    return (
      <AuthContext.Provider value={auth}>
        <Login />
      </AuthContext.Provider>
    );
  }

  if (auth.authMode === "signup") {
    return (
      <AuthContext.Provider value={auth}>
        <Signup />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <Routes>
        {/* Private routes */}
        {auth.isAuthenticated ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="roles" element={<RoleManagement />} />
            <Route path="permissions" element={<PermissionManagement />} />
            <Route path="doctors" element={<DoctorsView />} />
            <Route path="chemists" element={<ChemistsView />} />
            <Route path="hospitals" element={<HospitalsView />} />
            <Route path="territories" element={<TerritoriesView />} />
            <Route path="drugs" element={<DrugsView />} />
            <Route
              path="organization"
              element={
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-text-primary mb-2">
                    Organization Settings
                  </h2>
                  <p className="text-text-secondary">Coming soon...</p>
                </div>
              }
            />
            <Route
              path="settings"
              element={
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-text-primary mb-2">
                    System Settings
                  </h2>
                  <p className="text-text-secondary">Coming soon...</p>
                </div>
              }
            />
            <Route path="*" element={<Dashboard />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </AuthContext.Provider>
  );
}