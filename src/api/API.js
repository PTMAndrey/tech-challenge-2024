import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_BASE_URL;

axios.defaults.headers = {
  // 'Content-Type': 'multipart/form-data',
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
  'Content-Type': 'application/json'
};

axios.interceptors.request.use(
  (config) => {
    // Attempt to retrieve the token from localStorage or sessionStorage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    // If the token exists, append it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// access control axios
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// ---------------------------- Calls ----------------------------------

// login  authenticate
export const login = async (email, password) => {
  try {
    const response = await axios.post(
      '/api/auth/login', {
      'eMailAdress': email,
      'password': password,
    }
    );
    if (response.data.jwt === '')
      return null;
    else
      return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


export const registerAdmin = async (data) => {
  try {
    const response = await axios.post('/api/auth/register', data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};

export const registerUser = async (data) => {
  try {
    const response = await axios.post('/api/auth/register/employee',
      {
        firstName: data.firstName,
        lastName: data.lastName,
        eMailAdress: data.eMailAdress,
        password: data.password,
        idOrganisation: data.organisationName, //! organisationName = idOrganisation only when registerUser is CALLED
      });
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};



export const sendEmailInvitations = async (data) => {
  try {
    const response = await axios.post('/email/send', data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};

// get user by id
export const getUserById = async (id) => {
  try {
    const response = await axios.get("/user/getById?idUser=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};



//remove User From Department
export const removeUserFromDepartment = async (id) => {
  try {
    const response = await axios.put("/user/removeUserFromDepartment?idUser=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};



//remove User From Department
export const addUserToDepartment = async (idUser, idDep) => {
  try {
    const response = await axios.put("/user/assignUserToDepartment?idUser=" + idUser + '&idDepartment=' + idDep);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};



// update organisation headquarter address
export const updateOrganisationAddress = async (idOrganisation, address) => {
  try {
    const response = await axios.put("/organisation/updateHeadquarterAddress?idOrganisation=" + idOrganisation + "&newHeadquarterAddress=" + address);

    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};

// get all team roles
export const getAllTeamRoles = async (id) => {
  try {
    const response = await axios.get("/teamRole/getAll?idOrganisation=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};

// add team roles
export const addTeamRoles = async (id, data) => {
  try {
    const response = await axios.post("/teamRole/addTeamRole?idOrganisationAdmin=" + id, data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};

// update team roles
export const updateTeamRoles = async (id, data) => {
  try {
    const response = await axios.put("/teamRole/updateTeamRole?idTeamRole=" + id, data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// delete team roles by id
export const deleteTeamRoles = async (id) => {
  try {
    const response = await axios.delete("/teamRole/deleteTeamRole?idTeamRole=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// getAllEmployees
export const getAllEmployees = async (id) => {
  try {
    const response = await axios.get("/user/getAll?idOrganisation=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// get department_managers without a department
export const getUnassignedDepartmentManagers = async (id) => {
  try {
    const response = await axios.get("/user/getUnassignedDepartmentManagers?idOrganisation=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};

// get employees without a department
export const getUsersWithoutDepartment = async (id) => {
  try {
    const response = await axios.get("/user/getUsersWithoutDepartment?idOrganisation=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// add role to employee
export const addRoleToEmployee = async (idUser, idRole) => {
  try {
    const response = await axios.put("/user/addRole?idUser=" + idUser + "&idRole=" + idRole);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};

// add department manager to department

export const addDepartmentManager = async (idUser, idDepartment) => {
  try {
    const response = await axios.put("/user/addDepartmentManager?idUser=" + idUser + "&idDepartment=" + idDepartment);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};

// remove department manager from department

export const removeDepartmentManagerFromDepartment = async (idUser, idDepartment) => {
  try {
    const response = await axios.delete("/user/removeDepartmentManagerFromDepartment?idUser=" + idUser);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};




// remove role to employee
export const deleteRoleFromEmployee = async (idUser, idRole) => {
  try {
    const response = await axios.delete("/user/removeRole?idUser=" + idUser + "&idRole=" + idRole);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// get all organisation roles
export const getAllRoles = async () => {
  try {
    const response = await axios.get("/role/getAll");
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// add Department
export const addDepartment = async (id, data) => {
  try {
    const response = await axios.post("/department/addDepartment?idOrganisationAdmin=" + id, data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// update Department
export const updateDepartment = async (id, data) => {
  try {
    const response = await axios.put("/department/updateDepartment?idDepartment=" + id, data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// delete Department
export const deleteDepartment = async (id) => {
  try {
    const response = await axios.delete("/department/deleteDepartment?idDepartment=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};
// get all departments
export const getAllDepartments = async (id) => {
  try {
    const response = await axios.get("/department/getAll?idOrganisation=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// get department by id
export const getDepartmentByID = async (id) => {
  try {
    const response = await axios.get("/department/getById?idDepartment=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// add user skill
export const addUserSkill = async (data) => {
  try {
    const response = await axios.post("/user_skill/addUserSkill", data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// add user skill
export const deleteUserSkill = async (id) => {
  try {
    const response = await axios.delete("/user_skill/deleteUserSkill?idUserSkill=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};

// get UserSkills by id
export const getUserSkillsByUserAndApproved = async (id) => {
  try {
    const response = await axios.get("/user_skill/getUserSkillsByUserAndApproved?idUser=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "You don't have approved skills");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};



// get all skills
export const getAllSkills = async (idOrganisation, idUser) => {
  try {
    const response = await axios.get("/skill/getAll?idOrganisation=" + idOrganisation + '&idUser=' + idUser);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// get all skills categories
export const getAllSkillCategory = async (id) => {
  try {
    const response = await axios.get("/skillCategory/getAll?idOrganisation=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// get all pending skills of an user
export const getUserSkillsByUserAndUnapproved = async (id) => {
  try {
    const response = await axios.get("/user_skill/getUserSkillsByUserAndUnapproved?idUser=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};

// get all skills from categorie id
export const getAllSkillsFromCategory = async (idCategory, idUser) => {
  try {
    const response = await axios.get("/skill/getSkillsByCategory?idCategory=" + idCategory + '&idUser=' + idUser);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


// get unassigned skill proposals
export const getUnassignedSkillsProposals = async (idUser) => {
  try {
    const response = await axios.get("/user_skill/unapprovedByDepartmentManager?idDepartmentManager=" + idUser);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


export const approveUserSkill = async (idUserSkill) => {
  try {
    const response = await axios.put("/user_skill/approveUserSkill?idUserSkill=" + idUserSkill);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};

export const rejectUserSkill = async (idUserSkill) => {
  try {
    const response = await axios.put("/user_skill/desapproveUserSkill?idUserSkill=" + idUserSkill);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};



export const addSkill = async (idOrganisation, data) => {
  try {
    const response = await axios.post("/skill/addSkill", data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};



export const updateSkill = async (idSkill, idUser, data) => {
  try {
    const response = await axios.put("/skill/updateSkill?idSkill=" + idSkill + '&idUser=' + idUser, data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


export const deleteSkill = async (idSkilCategory) => {
  try {
    const response = await axios.delete("/skillCategory/deleteSkillCategory?idSkilCategory=" + idSkilCategory);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};

export const addSkillCategory = async (idOrganisation, data) => {
  try {
    const response = await axios.post("/skillCategory/addSkillCategory?idOrganisationAdmin=" + idOrganisation, data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};



export const updateSkillCategory = async (idSkillCategory, data) => {
  try {
    const response = await axios.put("/skillCategory/updateSkillCategory?idSkilCategory=" + idSkillCategory, data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


export const deleteSkillCategory = async (idSkilCategory) => {
  try {
    const response = await axios.delete("/skillCategory/deleteSkillCategory?idSkilCategory=" + idSkilCategory);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};


export const addSkillToMyDepartment = async (idSkill, idUser, data) => {
  try {
    const response = await axios.post("/skill/addSkillToMyDepartment?idSkill="+idSkill+"&idUser="+idUser, data);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};



export const deleteSkillFromMyDepartment = async (idSkill, idUser ) => {
  try {
    const response = await axios.delete("/skill/removeSkillFromMyDepartment?idSkill=" + idSkill+"&idUser="+idUser);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};



export const getOrganisationStatistics = async (id) => {
  try {
    const response = await axios.get("/organisation/statistics?idOrganisation=" + id);
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);

    } else {
      throw new Error("Network error or other issue");
    }
  }
};