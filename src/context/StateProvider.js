import { createContext, useEffect, useState } from "react";
import { getAllEmployees, getAllRoles, getAllTeamRoles } from "../api/API";

const StateContext = createContext({});

export const StateProvider = ({ children }) => {

  const [teamRoles, setTeamRoles] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [organisationRoles, setOrganisationRoles] = useState(null);
  
  let pageSize = 3;
  const [currentPageTeamRoles, setCurrentPageTeamRoles] = useState(1);
  const [currentPageEmployees, setCurrentPageEmployees] = useState(1);

  // alert
  const [alert, setAlert] = useState(null);
  if (alert) {
    setTimeout(() => {
      setAlert(null);
    }, 500000);
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

    } catch (error) {
      console.log(error.message, "error");
      setAlert({
        type: "danger",
        message: error.message || "Something went wrong...", // Use the error message from the catch
      });
    }
  };


  const fetchEmployees = async (idOrganisation) => {
    try {
      const response = await getAllEmployees(idOrganisation);
      if (response?.status === 200) {
        const sortedEmployees = response.data.map(employee => {
          const sortedAuthorities = employee.authorities.sort((a, b) => a.id - b.id);
          return {...employee, authorities: sortedAuthorities};
        });
        setEmployees(response.data)
        setCurrentPageEmployees(1);
      }
      else{
        setCurrentPageEmployees(null);
      }

    } catch (error) {
      console.log(error.message, "error");
      setAlert({
        type: "danger",
        message: error.message || "Something went wrong...", // Use the error message from the catch
      });
    }
  };

  const fetchOrganisationRoles = async (idOrganisation) => {
    try {
      const response = await getAllRoles(idOrganisation);
      if (response?.status === 200) {
        setOrganisationRoles(response.data);
      }

    } catch (error) {
      console.log(error.message, "error");
      setAlert({
        type: "danger",
        message: error.message || "Something went wrong...", // Use the error message from the catch
      });
    }
  };


  return <StateContext.Provider
    value={{
      alert,
      setAlert,
      teamRoles,
      setTeamRoles,
      fetchTeamRoles,
      employees,
      setEmployees,
      fetchEmployees,
      pageSize,
      currentPageTeamRoles,
      setCurrentPageTeamRoles,
      currentPageEmployees,
      setCurrentPageEmployees,
      organisationRoles,
      setOrganisationRoles,
      fetchOrganisationRoles,
    }}
  >{children}</StateContext.Provider>;
};

export default StateContext;
