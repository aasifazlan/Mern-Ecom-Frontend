import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://mern-ecom-backend-oay9.onrender.com/api",
	withCredentials: true,
});

export default axiosInstance;
