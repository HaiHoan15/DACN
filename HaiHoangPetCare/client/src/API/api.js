// api
import axios from "axios";

const api = axios.create({
  baseURL: "https://68ef675bb06cc802829d40f4.mockapi.io/", //url api
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
