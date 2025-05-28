import { create } from 'zustand';
import api from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	setUser: (user) => set({ user }),

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error('Passwords do not match');
		}

		try {
			const res = await api.post('/auth/signup', { name, email, password });
			set({ user: res.data, loading: false });
			toast.success('Signed up successfully');
		} catch (error) {
			toast.error(error.response?.data?.message || 'An error occurred');
			set({ loading: false });
		}
	},

	login: async ({ email, password }) => {
		set({ loading: true });
		try {
			const res = await api.post('/auth/login', { email, password });
			set({ user: res.data, loading: false });
			toast.success('Logged in successfully');
		} catch (error) {
			toast.error(error.response?.data?.message || 'An error occurred');
			set({ loading: false });
		}
	},

	logout: async () => {
		try {
			await api.post('/auth/logout');
			set({ user: null });
			console.log('User after logout: ', get().user);
			toast.success('Logged out successfully');
		} catch (error) {
			console.log(error.message);
			toast.error(error.response?.data?.message || 'Found some errors while logging out');
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await api.get('/auth/profile');
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ user: null, checkingAuth: false });
		}
	},

	refreshToken: async () => {
		if (get().checkingAuth) return;

		set({ checkingAuth: true });

		try {
			const response = await api.post('/auth/refresh-token');
			await get().checkAuth();
			return response.data;
		} catch (error) {
			set({ user: null });
			throw error;
		} finally {
			set({ checkingAuth: false });
		}
	}
}));

// ✅ Axios interceptor for refreshing the access token
let refreshPromise = null;

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				if (!refreshPromise) {
					refreshPromise = useUserStore.getState().refreshToken();
				}

				await refreshPromise;
				return api(originalRequest);
			} catch (refreshError) {
				await useUserStore.getState().logout();
				return Promise.reject(refreshError);
			} finally {
				refreshPromise = null;
			}
		}

		return Promise.reject(error);
	}
);
