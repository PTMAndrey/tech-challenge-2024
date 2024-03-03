import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.headers = {
  // 'Content-Type': 'multipart/form-data',
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
  'Content-Type': 'application/json'
};

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

    console.log(response)
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong... Try again later");

    } else {
      throw new Error("Network error or other issue");
    }
  }
};
