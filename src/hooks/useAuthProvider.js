import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuthProvider = () => {
  return useContext(AuthContext);
};

export default useAuthProvider;
