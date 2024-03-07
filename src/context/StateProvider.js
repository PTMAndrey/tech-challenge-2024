import { createContext, useState } from "react";
// import {  } from "../api/API";

const StateContext = createContext({});

export const StateProvider = ({ children }) => {

  const [activeNavbarItem, setActiveNavbarItem] = useState("/");
  // alert
  const [alert, setAlert] = useState(null);
  if (alert) {
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  }
  function handeNavbarOption(option) {
    setActiveNavbarItem(option);
  }
  return <StateContext.Provider
    value={{
      alert,
      setAlert,
      activeNavbarItem,
      handeNavbarOption,
    }}
  >{children}</StateContext.Provider>;
};

export default StateContext;
