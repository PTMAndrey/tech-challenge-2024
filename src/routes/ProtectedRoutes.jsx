import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoutes = ({ role }) => {
  return <Outlet/>
};

export default ProtectedRoutes;
