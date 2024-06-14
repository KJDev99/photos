// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.163:9090/", // Asosiy URL ni shu yerda belgilaysiz
});

export default api;
