import Axios, { type AxiosInstance } from 'axios';

const instance = Axios.create({
	baseURL: import.meta.env.VITE_APP_API_URL,
});

/**
 * @returns AxiosInstance
 */
export function axios(): AxiosInstance {
	const token = localStorage.getItem('access_token');
	if (token) {
		instance.defaults.headers.common.Authorization = `Bearer ${token}`;
	}

	return instance;
}

export default {
	install: (app: any) => {
		const axiosInstance = axios();
		app.config.globalProperties.axios = axiosInstance;
		app.config.globalProperties.$http = axiosInstance;
	},
};
