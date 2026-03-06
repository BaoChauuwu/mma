import axios from "./axiosInstance";

export const getProductsAPI = () => axios.get("/products");
export const addProductAPI = (data) => axios.post("/products", data);
export const updateProductAPI = (id, data) =>
  axios.put(`/products/${id}`, data);
export const deleteProductAPI = (id) =>
  axios.delete(`/products/${id}`);