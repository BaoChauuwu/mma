import axios from "./axiosInstance";

export const registerAPI = (data) => {
  return axios.post("/auth/register", data);
};

export const loginAPI = (data) => {
  return axios.post("/auth/login", data);
};