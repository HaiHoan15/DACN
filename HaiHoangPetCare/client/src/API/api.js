// api
import axios from "axios";

const api = axios.create({
  baseURL: "https://haihoanpetcare.online/petcare_api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
