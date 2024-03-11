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
import Profile from './pages/Profile/Profile';
import TeamRoles from './pages/TeamRoles/TeamRoles';
import Departments from './pages/Departments/Departments';
import Projects from './pages/Projects/Projects';
import Skills from './pages/Skills/Skills';
import Teams from './pages/Teams/Teams';
import Users from './pages/Users/Users';
import Notifications from './pages/Notifications/Notifications';
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
        <Route path="/team-roles" element={<TeamRoles/>} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/employees" element={<Users />} />
        <Route path="/notifications" element={<Notifications />} />
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
