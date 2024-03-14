import { createContext, useEffect, useState } from "react";
import { getAllTeamRoles } from "../api/API";

const StateContext = createContext({});

export const StateProvider = ({ children }) => {

  const [teamRoles, setTeamRoles] = useState();
  
  let pageSize = 3;
  const [currentPageTeamRoles, setCurrentPageTeamRoles] = useState(1);

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
        setCurrentPageTeamRoles(1);
      }
      else{
        setTeamRoles(null);
      }

    } catch (error) { }
  };



  return <StateContext.Provider
    value={{
      alert,
      setAlert,
      teamRoles,
      setTeamRoles,
      fetchTeamRoles,
      pageSize,
      currentPageTeamRoles,
      setCurrentPageTeamRoles,
    }}
  >{children}</StateContext.Provider>;
};

export default StateContext;
