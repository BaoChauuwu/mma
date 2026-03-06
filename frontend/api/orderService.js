import axios from "./axiosInstance";

export const createOrderAPI = (data) =>
  axios.post("/orders", data);

export const getRevenueAPI = (filter = "") => {
  const query = filter !== "All Time" && filter !== "" ? `?filter=${filter}` : "";
  return axios.get(`/orders/revenue${query}`);
};