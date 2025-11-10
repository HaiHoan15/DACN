// api
import axios from "axios";

const api = axios.create({
  // baseURL: "https://68ef675bb06cc802829d40f4.mockapi.io/", url api
  baseURL: "http://localhost/petcare_api/", // url local
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
