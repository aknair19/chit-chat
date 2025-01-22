import axios from "axios";

//by using axios.create we can create multiple instances
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

//we write withCrendentials: true because we need to send cookies to the backend
