/* eslint-disable @typescript-eslint/no-var-requires */
const { createAuth } = require('@websanova/vue-auth/dist/v3/vue-auth.esm.js');
const driverAuthBearer =
	require('@websanova/vue-auth/dist/drivers/auth/bearer.esm.js').default;
const driverHttpAxios =
	require('@websanova/vue-auth/dist/drivers/http/axios.1.x.esm.js').default;
const driverRouterVueRouter =
	require('@websanova/vue-auth/dist/drivers/router/vue-router.2.x.esm.js').default;

export default {
	install: (app: any) => {
		const auth = createAuth({
			plugins: {
				http: app.config.globalProperties.$http,
				router: app.config.globalProperties.$router,
			},
			drivers: {
				http: driverHttpAxios,
				auth: driverAuthBearer,
				router: driverRouterVueRouter,
			},
			options: {
				rolesKey: 'type',
				notFoundRedirect: { name: 'Home' },
				authRedirect: { name: 'Landing' },
				fetchData: {
					url: 'auth/me',
					enabled: false,
				},
				refreshData: {
					enabled: false,
				},
			},
		});

		app.use(auth);
	},
};
