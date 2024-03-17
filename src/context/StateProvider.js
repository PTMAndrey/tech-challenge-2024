import { createContext, useEffect, useState } from "react";
import { getAllDepartments, getAllEmployees, getAllRoles, getAllTeamRoles, getUnassignedDepartmentManagers, getUsersWithoutDepartment } from "../api/API";

const StateContext = createContext({});

export const StateProvider = ({ children }) => {

  const [teamRoles, setTeamRoles] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [organisationRoles, setOrganisationRoles] = useState(null);
  const [departments, setDepartments] = useState(null);
  let managersWithoutDepartments_dropdown = [];
  const [unassignedDepartmentManagers, setUnassignedDepartmentManagers] = useState(null);
  let employeesWithoutDepartments_dropdown = [];
  const [unassignedEmployeesOnDepartment, setunassignedEmployeesOnDepartment] = useState(null);

  let pageSize = 3;
  let pageSizeDepartments = 7;
  const [currentPageTeamRoles, setCurrentPageTeamRoles] = useState(1);
  const [currentPageEmployees, setCurrentPageEmployees] = useState(1);
  const [currentPageDepartments, setCurrentPageDepartments] = useState(1);

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
      else {
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
          return { ...employee, authorities: sortedAuthorities };
        });
        setEmployees(response.data)
        setCurrentPageEmployees(1);
      }
      else {
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


  const fetchDepartments = async (idOrganisation) => {
    try {
      const response = await getAllDepartments(idOrganisation);
      if (response?.status === 200) {
        setDepartments(response.data);
      }

    } catch (error) {
      console.log(error.message, "error");
      setAlert({
        type: "danger",
        message: error.message || "Something went wrong...", // Use the error message from the catch
      });
    }
  };

  const fetchUnassignedDepartmentManagers = async (idOrganisation) => {
    try {
      const response = await getUnassignedDepartmentManagers(idOrganisation);
      if (response?.status === 200) {
        setUnassignedDepartmentManagers(response.data);
        response.data.map(item =>
          managersWithoutDepartments_dropdown.push({ value: item.idUser, label: (item.firstName + ' ' + item.lastName) })
        );
        console.log(response.data);
      }

    } catch (error) {
      console.log(error.message, "error");
      setAlert({
        type: "danger",
        message: error.message || "Something went wrong...", // Use the error message from the catch
      });
    }
  };

  const fetchUsersWithoutDepartment = async (idOrganisation) => {
    try {
      const response = await getUsersWithoutDepartment(idOrganisation);
      if (response?.status === 200) {
        setunassignedEmployeesOnDepartment(response.data);
        console.log(response.data);
      }

    } catch (error) {
      console.log(error.message, "error");
      setAlert({
        type: "danger",
        message: error.message || "Something went wrong...", // Use the error message from the catch
      });
    }
  };


  useEffect(() => {
    unassignedDepartmentManagers?.map(item =>
      managersWithoutDepartments_dropdown.push({ value: item.idUser, label: (item.firstName + ' ' + item.lastName) })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unassignedDepartmentManagers]);

  useEffect(() => {
    unassignedEmployeesOnDepartment?.map(item =>
      employeesWithoutDepartments_dropdown.push({ value: item.idUser, label: (item.firstName + ' ' + item.lastName) })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unassignedEmployeesOnDepartment]);

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
      pageSizeDepartments,
      currentPageTeamRoles,
      setCurrentPageTeamRoles,
      currentPageEmployees,
      setCurrentPageEmployees,
      organisationRoles,
      setOrganisationRoles,
      fetchOrganisationRoles,
      departments,
      setDepartments,
      currentPageDepartments,
      setCurrentPageDepartments,
      fetchDepartments,
      fetchUnassignedDepartmentManagers,
      fetchUsersWithoutDepartment,
      unassignedDepartmentManagers,
      setUnassignedDepartmentManagers,
      unassignedEmployeesOnDepartment,
      setunassignedEmployeesOnDepartment,
      managersWithoutDepartments_dropdown,
      employeesWithoutDepartments_dropdown,
    }}
  >{children}</StateContext.Provider>;
};

export default StateContext;
