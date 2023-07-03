
import { defineStore } from 'pinia';

import { useStore } from '@/composables/store';
import { useGlobals } from '@/main';
import { axios } from '@/plugins/axios';

const storeHelper = useStore();

export const useAuthStore = defineStore('auth', {
	state: () => {
		let user: any = localStorage.getItem('user');
		user =
			typeof user === 'string' && user !== 'undefined' ? JSON.parse(user) : {};
		const loggedIn =
			localStorage.getItem('access_token') !== undefined && user.id != null;
		return {
			loggedIn,
			user,
			loginDetails: {},
			isLoading: true,
		};
	},

	getters: {},

	actions: {
		doInitialNavigation() {
			const { $router } = useGlobals();
			console.debug('[Auth Store]: doInitialNavigation: Logged in');
			// NOTE: After logging in the router needs to navigate to the right location
			const string = localStorage.getItem('lastRoute') || '';
			try {
				const lastRoute = JSON.parse(string);
				if (!this.user.grouped_matching_criteria?.length) {
					$router.push({ name: 'RegisterStart' });
				}
				if (
					lastRoute instanceof Object &&
					!['Home', 'Login', 'Register'].includes(lastRoute.name)
				) {
					$router.push(lastRoute);
				}
			} catch (error) {
				console.debug('[Auth Store]: doInitialNavigation: Error', error);
				$router.push({ name: 'Home' });
			}
		},
		async load() {
			const { $auth } = useGlobals();
			$auth
				.load()
				.catch((e) => {
					console.debug('[App]: Failed to load auth');
					console.error(e);
				})
				.then(() => {
					if (localStorage.getItem('onboarded') === 'true') {
						const account = JSON.parse(localStorage.getItem('account'));
						console.debug('[App]: Loaded auth', account);
						this.setLogin('local_mode', account);
						this.setLoginDetails(JSON.parse(localStorage.getItem('loginDetails')));
						this.$state.loggedIn = true;
						this.$state.isLoading = false;
					} else {
						localStorage.removeItem('onboarded');
						localStorage.removeItem('account');
						localStorage.removeItem('loginDetails');
						localStorage.removeItem('campaignDetails');
						this.$state.isLoading = false;
					}
				});
		},
		async register(params: any) {
			try {
				params.name = params.name || `${params.first_name} ${params.last_name}`;
				const response = await axios().post('auth/register', params);
				if (response) {
					this.setLogin(
						response.data.data.token || response.data.data.access_token,
						response.data.data.user
					);
					return this.$state.user;
				} else {
					storeHelper.resolveError('Retry');
				}
			} catch (error) {
				storeHelper.resolveError(error);
			}
		},
		setLoginDetails(loginDetails: any) {
			console.debug('[Auth Store]: setLoginDetails', loginDetails);
			localStorage.setItem('loginDetails', JSON.stringify(loginDetails));
			this.$state.loginDetails = loginDetails;
		},
		setUser(user: any) {
			console.debug('[Auth Store]: setUser', user);
			const { $auth } = useGlobals();
			localStorage.setItem('user', JSON.stringify(user));
			this.$state.user = user;
			$auth.user(user);
			this.$state.isLoading = false;
		},
		async login(credentials: any) {
			try {
				const response = await axios().post('auth/login', credentials);
				if (response) {
					this.setLogin(
						response.data.data.access_token || response.data.data.token,
						response.data.data.user
					);
					return response.data.data;
				} else {
					storeHelper.resolveError('Retry');
				}
			} catch (error: any) {
				storeHelper.resolveError(error?.response?.data?.message);
			}
		},
		async mockLogin(params: any) {
			const { $auth } = useGlobals();
			this.setLogin(params.access_token || params.token, params.user);
			$auth.user(params.user);
			if (!params.user.id) {
				this.$state.loggedIn = false;
			}
			$auth.token(null, params.access_token || params.token, false);
			console.debug('[Auth Store]: Mocking user using', params, $auth.check());
		},
		setLogin(token: string, user: any = null) {
			console.debug('[Auth Store]: setLogin', token, user);
			const { $auth } = useGlobals();
			localStorage.setItem('access_token', token);
			$auth.token(null, token, false);
			this.$state.loggedIn = true;
			if (user) {
				this.setUser(user);
				this.doInitialNavigation();
			}
		},
		async logout() {
			console.log('[Auth]: Logging out');
			const { $auth } = useGlobals();
			localStorage.removeItem('access_token');
			localStorage.removeItem('user');
			localStorage.removeItem('onboarded');
			localStorage.removeItem('account');
			localStorage.removeItem('loginDetails');
			localStorage.removeItem('campaignDetails');
			$auth.logout();
			this.$state.loggedIn = false;
			console.log('[Auth]: Logged out');
			return true;
		},
		async recover(params: any) {
			try {
				const response = await axios().post('auth/forgot-password', params);
				return storeHelper.prepareResponse(response);
			} catch (error) {
				storeHelper.resolveError(error);
			}
		},
		async reset(params: any) {
			try {
				const response = await axios().put('auth/reset-password', params);
				return storeHelper.prepareResponse(response);
			} catch (error) {
				storeHelper.resolveError(error);
			}
		},
		async verify(url: string) {
			try {
				const response = await axios().get(url);
				return storeHelper.prepareResponse(response, false);
			} catch (error) {
				storeHelper.resolveError(error);
			}
		},
		async resend(params: any) {
			try {
				const response = await axios().get('api/email/resend', {
					params,
				});
				return storeHelper.prepareResponse(response);
			} catch (error) {
				storeHelper.resolveError(error);
			}
		},
	},
});
