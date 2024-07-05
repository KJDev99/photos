// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.164:8000/", // Asosiy URL ni shu yerda belgilaysiz
  withCredentials: true,
});

export default api;
