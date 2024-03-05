import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuthProvider from "../hooks/useAuthProvider";

const ProtectedRoutes = ({ role }) => {
  let location = useLocation();
  const { isLoggedIn } = useAuthProvider();

  return isLoggedIn() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoutes;
