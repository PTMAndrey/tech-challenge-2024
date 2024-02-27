import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
axios.defaults.headers = {
  // 'Content-Type': 'multipart/form-data',
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
};

// access control axios
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// ---------------------------- Calls ----------------------------------

// login  authenticate
export const login = async (email, password) => {
  try {
    const response = await axios.get(
      "/utilizator/login?email=" + email + "&parola=" + password
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};


export const register = async (data) => {
  try {
    const response = await axios.post('/utilizator/add',data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

// get user by id
export const getUserById = async (id) => {
  try {
    const response = await axios.get("/utilizator/getByID?id=" + id);
    return response;
  } catch (error) {
    console.log(error);
  }
};
