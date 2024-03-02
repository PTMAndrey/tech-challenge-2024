import { createContext, useEffect, useState } from "react";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

  const [rememberMe, setRememberMe] = useState(true);
  // user
  const [user, setUser] = useState(null);

  const userID =
    rememberMe || !!localStorage.getItem("token")
      ? localStorage.getItem("token")
      : sessionStorage.getItem("token");


  const isLoggedIn = () => {
    return !!userID;
  };

 // logout function
 function logout() {
  sessionStorage.clear();
  sessionStorage.removeItem("userID");
  localStorage.removeItem("userID");
  setUser(null);
}


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        rememberMe,
        setRememberMe,
        logout,
        isLoggedIn,
        userID
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;