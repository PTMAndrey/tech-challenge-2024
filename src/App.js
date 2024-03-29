import React, { useEffect, useState } from 'react';
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
import useAuthProvider from './hooks/useAuthProvider';
import Proposals from './pages/Proposals/Proposals';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const { alert } = useStateProvider();
  const { user } = useAuthProvider();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return <>
      <Backdrop
        sx={{ display: 'flex', flexDirection: 'column', color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <h3>We prepare the data for you!</h3>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>;
  }

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
          <Route path="/profile">
            <Route path="info" element={<Profile />} />
            <Route path="skills" element={<Profile />} />
          </Route>
          <Route path="/" element={<Home />} />
          {user?.authorities.some(authority => authority.authority === "ORGANISATION_ADMIN") &&
            <Route path="/team-roles" element={<TeamRoles />} />
          }
          {user?.authorities.some(authority => authority.authority === "ORGANISATION_ADMIN") &&
            <>
              <Route path="/departments/admin/all" element={<Departments />} />
              {/* <Route path="/departments/myDepartment/:id" element={<Departments/>} /> */}
            </>
          }
          {(user?.authorities.some(authority => authority.authority === "DEPARTMENT_MANAGER") &&
            user?.isDepartmentManager) &&
            <Route path="/departments/myDepartment/:id" element={<Departments />} />
          }

          <Route path="/projects" element={<Projects />} />

          {
            user?.authorities.some(authority => authority.authority === "DEPARTMENT_MANAGER") &&
            <Route path="/skills">
              <Route path="all" element={<Skills />} />
              <Route path="categories" element={<Skills />} />
            </Route>
          }
          {user?.authorities.some(authority => authority.authority === "PROJECT_MANAGER") &&
            <Route path="/teams" element={<Teams />} />
          }

          {user?.authorities.some(authority => authority.authority === "ORGANISATION_ADMIN") &&
            <Route path="/employees">
              <Route path="all" element={<Users />} />
              <Route path="invitations" element={<Users />} />
            </Route>
          }
          {user?.authorities.some(authority => authority.authority === "DEPARTMENT_MANAGER") &&
            <Route path="/proposals">
              <Route path="skills" element={<Proposals />} />
              <Route path="assignment" element={<Proposals />} />
              <Route path="dealocation" element={<Proposals />} />
            </Route>
          }

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
