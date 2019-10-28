import axios from "axios";

export default () => {
  axios.defaults.headers.common["Authorization"] = localStorage.getItem(
    "jwtToken"
  );
  return axios.create({
    baseURL: `http://localhost:8081`
  });
};
