import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.DEV
		? "http://localhost:5000/api"
		: "https://mern-ecom-backend-oay9.onrender.com",
	withCredentials: true,
});

export default axiosInstance;
