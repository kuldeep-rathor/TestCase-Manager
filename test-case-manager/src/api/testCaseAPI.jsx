import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // your backend port
});

export const getTestCases = (module) =>
  API.get("/testcases", module ? { params: { module } } : {});

export const createTestCase = (data) => API.post("/testcases", data);
export const updateTestCase = (id, data) => API.put(`/testcases/${id}`, data);
export const deleteTestCase = (id) => API.delete(`/testcases/${id}`);

export const uploadTestCasesFromExcel = (formData) =>
  API.post("/testcases/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Add this to your existing api/testCaseAPI.js file
export const downloadTestCasesExcel = (module) => {
  const url = "/testcases/download" + (module ? `?module=${module}` : "");
  window.location.href = `${API.defaults.baseURL}${url}`;
};
