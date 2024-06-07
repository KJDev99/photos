// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://31.129.99.177:8000", // Asosiy URL ni shu yerda belgilaysiz
});

export default api;
