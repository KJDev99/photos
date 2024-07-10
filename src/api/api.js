// src/api.js
import axios from "axios";

const api = axios.create({
  // baseURL: "http://31.129.99.177:8000", // Asosiy URL ni shu yerda belgilaysiz
  baseURL: "http://192.168.0.163:8000", // Asosiy URL ni shu yerda belgilaysiz
  withCredentials: true,
});

export default api;
