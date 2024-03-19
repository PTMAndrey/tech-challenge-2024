import { createContext, useEffect, useState } from "react";
import { getAllDepartments, getAllEmployees, getAllRoles, getAllSkillCategory, getAllSkillsFromCategory, getAllTeamRoles, getDepartmentByID, getUnassignedDepartmentManagers, getUserSkillsByUserAndApproved, getUsersWithoutDepartment } from "../api/API";

const StateContext = createContext({});

export const StateProvider = ({ children }) => {

  const [teamRoles, setTeamRoles] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [organisationRoles, setOrganisationRoles] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [departmentByID, setDepartmentByID] = useState(null);
  const [usersWithoutDepartment, setUsersWithoutDepartment] = useState(null);
  const [unassignedDepartmentManagers, setUnassignedDepartmentManagers] = useState(null);
  const [unassignedEmployeesOnDepartment, setunassignedEmployeesOnDepartment] = useState(null);
  const [approvedUserSkills, setApprovedUserSkills] = useState(null);
  const [allSkillCategory, setAllSkillCategory] = useState(null);
  const [allSkillsFromCategory, setAllSkillsFromCategory] = useState(null);


  // these 2 are arrays for drodpown
  const [managersWithoutDepartments_dropdown, setManagersWithoutDepartments_dropdown] = useState([]);
  const [employeesWithoutDepartments_dropdown, setEmployeesWithoutDepartments_dropdown] = useState([]);
  const [allSkillCategory_dropdown, setAllSkillCategory_dropdown] = useState([]);
  const [allSkillsFromCategory_dropdown, setAllSkillsFromCategory_dropdown] = useState([]);

  let pageSize = 3; // teamroles + employees
  let pageSizeDepartments = 3;
  let pageSizeMyDepartmentEmployees = 2;
  let pageSizeMyDepartmentEmployeesWithoutDepartment = 2;
  let pageSizeMySkills = 3;
  const [currentPageTeamRoles, setCurrentPageTeamRoles] = useState(1);
  const [currentPageEmployees, setCurrentPageEmployees] = useState(1);
  const [currentPageDepartments, setCurrentPageDepartments] = useState(1);

  const [currentPageMyDepartmentEmployees, setCurrentPageMyDepartmentEmployees] = useState(1);
  const [currentPageMyDepartmentEmployeesWithoutDepartment, setCurrentPageMyDepartmentEmployeesWithoutDepartment] = useState(1);
  const [currentPageMySkills, setCurrentPageMySkills] = useState(1);

  // alert
  const [alert, setAlert] = useState(null);
  if (alert) {
    setTimeout(() => {
      setAlert(null);
    }, 4000);
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



  const fetchGetDepartmentByID = async (idDepartment) => {
    try {
      const response = await getDepartmentByID(idDepartment);
      if (response?.status === 200) {
        setDepartmentByID(response.data);
      }

    } catch (error) {
      console.log(error.message, "error");
      setAlert({
        type: "danger",
        message: error.message || "Something went wrong...", // Use the error message from the catch
      });
    }
  };

  const fetchGetUsersWithoutDepartment = async (idOrganisation) => {
    try {
      const response = await getUsersWithoutDepartment(idOrganisation);
      if (response?.status === 200) {
        setUsersWithoutDepartment(response.data);
      }

    } catch (error) {
      console.log(error.message, "error");
      setAlert({
        type: "danger",
        message: error.message || "Something went wrong...", // Use the error message from the catch
      });
    }
  };

  
  const fetchApprovedUserSkills = async (idUser) => {
    try {
      const response = await getUserSkillsByUserAndApproved(idUser);
      if (response?.status === 200) {
        setApprovedUserSkills(response.data);
        console.log(response.data);
      }
      if(response?.status === 400){
        setAlert({
          type: "warning",
          message: "You don't have approved skills"
        });
      }

    } catch (error) {
      console.log(error.message, "error");
      // setAlert({
      //   type: "danger",
      //   message: error.message // Use the error message from the catch
      // });
    }
  };

  const fetchAllSkillCategory = async (idOrganisation) => {
    try {
      const response = await getAllSkillCategory(idOrganisation);
      if (response?.status === 200) {
        setAllSkillCategory(response.data);
        console.log(response.data);
      }
      if(response?.status === 400){
        setAlert({
          type: "warning",
          message: "You don't have approved skills"
        });
      }

    } catch (error) {
      console.log(error.message, "error");
      // setAlert({
      //   type: "danger",
      //   message: error.message // Use the error message from the catch
      // });
    }
  };
  
  const fetchAllSkillsFromCategory = async (idCategory,idUser) => {
    try {
      const response = await getAllSkillsFromCategory(idCategory, idUser);
      if (response?.status === 200) {
        setAllSkillsFromCategory(response.data);
        console.log(response.data);
      }
      if(response?.status === 400){
        setAlert({
          type: "warning",
          message: "You don't have approved skills"
        });
      }

    } catch (error) {
      console.log(error.message, "error");
      setAlert({
        type: "danger",
        message: error.message // Use the error message from the catch
      });
    }
  };

  useEffect(() => {
    const newDropdownOptions = unassignedDepartmentManagers?.map(item => ({
      value: item.idUser,
      label: `${item.firstName} ${item.lastName}`,
    })) || [];
    setManagersWithoutDepartments_dropdown(newDropdownOptions);
  }, [unassignedDepartmentManagers]);

  useEffect(() => {
    const newDropdownOptions = unassignedEmployeesOnDepartment?.map(item => ({
      value: item.idUser,
      label: `${item.firstName} ${item.lastName}`,
    })) || [];
    setEmployeesWithoutDepartments_dropdown(newDropdownOptions);
  }, [unassignedEmployeesOnDepartment]);

  useEffect(() => {
    const newDropdownOptions = allSkillCategory?.map(item => ({
      value: item.idSkillCategory,
      label: item.skillCategoryName,
    })) || [];
    console.log(newDropdownOptions);
    setAllSkillCategory_dropdown(newDropdownOptions);
  }, [allSkillCategory]);

  useEffect(() => {
    const newDropdownOptions = allSkillsFromCategory?.map(item => ({
      value: item.idSkill,
      label: item.skillName,
    })) || [];
    console.log(newDropdownOptions);
    setAllSkillsFromCategory_dropdown(newDropdownOptions);
  }, [allSkillsFromCategory]);




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
      departmentByID,
      setDepartmentByID,
      fetchGetDepartmentByID,
      usersWithoutDepartment, 
      setUsersWithoutDepartment,
      fetchGetUsersWithoutDepartment,
      pageSizeMyDepartmentEmployeesWithoutDepartment,
      currentPageMyDepartmentEmployeesWithoutDepartment, 
      setCurrentPageMyDepartmentEmployeesWithoutDepartment,
      pageSizeMySkills,
      currentPageMySkills, 
      setCurrentPageMySkills,
      approvedUserSkills,
      setApprovedUserSkills,
      fetchApprovedUserSkills,

      fetchAllSkillCategory,
      allSkillCategory_dropdown,

      fetchAllSkillsFromCategory,
      allSkillsFromCategory_dropdown,
    }}
  >{children}</StateContext.Provider>;
};

export default StateContext;
