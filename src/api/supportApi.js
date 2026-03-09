import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://domo-ai-usecase-product-api-462434048008.asia-south2.run.app/",
});

export const submitSupportRequest = async ({
  customerName,
  email,
  companyName,
  businessType,
  usecase,
}) => {
  const res = await API.post("/support-request", {
    customerName,
    email,
    companyName,
    businessType,
    usecase,
  });

  return res.data;
};
