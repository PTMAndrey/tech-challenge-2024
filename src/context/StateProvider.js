import { createContext, useEffect, useState } from "react";
import { getAllDepartments, getAllEmployees, getAllRoles, getAllTeamRoles, getUnassignedDepartmentManagers, getUsersWithoutDepartment } from "../api/API";

const StateContext = createContext({});

export const StateProvider = ({ children }) => {

  const [teamRoles, setTeamRoles] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [organisationRoles, setOrganisationRoles] = useState(null);
  const [departments, setDepartments] = useState(null);
  // let managersWithoutDepartments_dropdown = [];
  const [unassignedDepartmentManagers, setUnassignedDepartmentManagers] = useState(null);
  const [managersWithoutDepartments_dropdown, setManagersWithoutDepartments_dropdown] = useState([]);
  const [employeesWithoutDepartments_dropdown, setEmployeesWithoutDepartments_dropdown] = useState([]);

  const [unassignedEmployeesOnDepartment, setunassignedEmployeesOnDepartment] = useState(null);

  let pageSize = 3; // teamroles + employees
  let pageSizeDepartments = 3;
  let pageSizeMyDepartmentEmployees = 3;
  const [currentPageTeamRoles, setCurrentPageTeamRoles] = useState(1);
  const [currentPageEmployees, setCurrentPageEmployees] = useState(1);
  const [currentPageDepartments, setCurrentPageDepartments] = useState(1);
  
  const [currentPageMyDepartmentEmployees, setCurrentPageMyDepartmentEmployees] = useState(1);

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
        console.log('DEPARTMENTS', response.data);
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
        console.log('MANAGERS', response.data);
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
    const newDropdownOptions = unassignedDepartmentManagers?.map(item => ({
      value: item.idUser,
      label: `${item.firstName} ${item.lastName}`,
    })) || [];
    console.log("fetched again",newDropdownOptions);
    setManagersWithoutDepartments_dropdown(newDropdownOptions);
  }, [unassignedDepartmentManagers]);

  useEffect(() => {
    const newDropdownOptions = unassignedEmployeesOnDepartment?.map(item => ({
      value: item.idUser,
      label: `${item.firstName} ${item.lastName}`,
    })) || [];
    setEmployeesWithoutDepartments_dropdown(newDropdownOptions);
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
      pageSizeMyDepartmentEmployees,
      currentPageMyDepartmentEmployees,
      setCurrentPageMyDepartmentEmployees,
    }}
  >{children}</StateContext.Provider>;
};

export default StateContext;
