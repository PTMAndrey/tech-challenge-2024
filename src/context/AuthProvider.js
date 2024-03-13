import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { getUserById } from "../api/API";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

  const [rememberMe, setRememberMe] = useState(true);
  // user
  const [user, setUser] = useState(null);

  const userToken =
    rememberMe || !!localStorage.getItem("token")
      ? localStorage.getItem("token")
      : sessionStorage.getItem("token");

console.log(user);
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
      // setUser(decodedToken);
      fetchUser(decodedToken.userId);
    }
  }, [])

  const fetchUser = async (userID) => {
    try {
        const response = await getUserById(userID);
        if (response?.status === 200) {
          setUser(response?.data);
        }
    } catch (error) {
      console.log("Error: ", error);
      logout();
      window.location.reload();
    }
  };



  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        rememberMe,
        setRememberMe,
        isLoggedIn,
        userToken,
        fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;