import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

  const [rememberMe, setRememberMe] = useState(true);
  // user
  const [user, setUser] = useState(null);

  const userToken =
    rememberMe || !!localStorage.getItem("token")
      ? localStorage.getItem("token")
      : sessionStorage.getItem("token");


  const isLoggedIn = () => {
    return !!userToken;
  };

  // logout function
  function logout(){
    sessionStorage.removeItem("token")
    localStorage.removeItem("token")
    setUser(null);
  }

  useEffect(() => {
    if (!user && userToken) {
      const decodedToken = jwtDecode(JSON.stringify(userToken));
      setUser(decodedToken);
    }
  }, [])



  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        rememberMe,
        setRememberMe,
        isLoggedIn,
        userToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;