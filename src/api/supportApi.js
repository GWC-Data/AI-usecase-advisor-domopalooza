import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://domo-workflow-product-api.onrender.com",
});

export const submitSupportRequest = async ({
  customerName,
  email,
  usecase
}) => {
  const res = await API.post("/support-request", {
    customerName,
    email,
    usecase
  });

  return res.data;
};