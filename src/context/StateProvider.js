import { createContext, useEffect, useState } from "react";
import { getAllTeamRoles } from "../api/API";
// import {  } from "../api/API";
import useAuthProvider from '../hooks/useAuthProvider';

const StateContext = createContext({});

export const StateProvider = ({ children }) => {

  const [teamRoles, setTeamRoles] = useState(); // folosit in pagina principala

  // alert
  const [alert, setAlert] = useState(null);
  if (alert) {
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  }

  const fetchTeamRoles = async (idOrganisation) => {
    try {
      const response = await getAllTeamRoles(idOrganisation);
      if (response?.status === 200) {
        setTeamRoles(response.data)
      }
      else
        setTeamRoles(null);

    } catch (error) { }
  };



  return <StateContext.Provider
    value={{
      alert,
      setAlert,
      teamRoles,
      setTeamRoles,
      fetchTeamRoles,
    }}
  >{children}</StateContext.Provider>;
};

export default StateContext;
