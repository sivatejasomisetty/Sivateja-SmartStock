import axios from "axios";


// //For Running Locally
// const api = axios.create({
//   baseURL: "http://localhost:8000",
// });

//For Deployment
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 🔐 Automatically attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
