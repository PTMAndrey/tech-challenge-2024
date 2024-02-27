import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import React from 'react';
import Home from "./pages/Home/Home";
import Layout from './pages/Layout/Layout'
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Alert from "./components/Alert/Alert";
import useStateProvider from "./hooks/useStateProvider";
import useWindowDimensions from "./hooks/useWindowDimensions"
import useAuth from "./hooks/useAuth";
import Onboarding from "./pages/Onboarding/Onboarding";

function App() {
  const { width } = useWindowDimensions();
  const { alert } = useStateProvider();
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        <Route
          element={
            <>
              <Layout>
                <ProtectedRoutes />
              </Layout>
            </>
          }
        >
          {/* protected routes */}
          <Route path="/" element={<Home/>} />
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
        </Route>
      </Routes>
      {alert && <Alert message={alert.message} type={alert.type} />}
    </Router>
  );
}

export default App;
