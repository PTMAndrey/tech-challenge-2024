import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Layout from './pages/Layout/Layout';
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Alert from "./components/Alert/Alert";
import useStateProvider from "./hooks/useStateProvider";
import Onboarding from "./pages/Onboarding/Onboarding";
import Sidebar from "./components/Sidebar/SidebarNavigation";
import Users from './pages/Users/Users';
import NotFound from './pages/NotFound/NotFound';

function App() {
  const { alert } = useStateProvider();

return (
  <Router>
    <Routes>
      <Route
        element={
          <>
            <Layout>
              <Sidebar />
              <ProtectedRoutes />
            </Layout>
          </>
        }
      >
        {/* protected routes */}
        <Route path="/" element={<Home />} />
        <Route path="/employees" element={<Users />} />
      </Route>

      <Route
        element={
          <>
            <Outlet />
          </>
        }
      >
        {/* public routes */}
        <Route path="/login" element={<Onboarding />} />
        <Route path="/register" element={<Onboarding />} />
        <Route path="/register/employee/:id" element={<Onboarding />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    {alert && <Alert message={alert.message} type={alert.type} />}
  </Router>
);
}

export default App;
