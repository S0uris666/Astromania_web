import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

const client = axios.create({
  baseURL: "/api",
  withCredentials: true, 
});

export default client;
