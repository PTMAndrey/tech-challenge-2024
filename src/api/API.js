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
    console.log(response);
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

// update organisation headquarter address
export const updateOrganisationAddress = async (idOrganisation, address) => {
  try {
    const response = await axios.put("/organisation/updateHeadquarterAddress?idOrganisation=" + idOrganisation + "&newHeadquarterAddress="+address);
    console.log(response);
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


// add role to employee
export const addRoleToEmployee = async (idUser, idRole) => {
  try {
    const response = await axios.put("/user/addRole?idUser=" + idUser + "&idRole="+idRole);
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
    const response = await axios.delete("/user/removeRole?idUser=" + idUser +"&idRole="+idRole);
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