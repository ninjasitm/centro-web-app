/* eslint-disable @typescript-eslint/no-throw-literal */
import type { StoreDefinition } from 'pinia';
import { defineStore } from 'pinia';
import utils from '@nitm/js-api-client-base/dist/services/utils';
import type { StateInterface, StoreModule } from '@/types';
import { axios } from '@/plugins/axios';
import { useEventBus } from '@vueuse/core';
import { reactive } from 'vue';

export const useStore = (): any => {
	const notifyAlert = useEventBus('toggleNotifyAlert');
	const basePath = import.meta.env.VITE_API_URL;

	const resolveError = (error: any): void => {
		let errorMessage = '';
		let errors: any = null;
		console.error('Error', error, error?.response);
		if (typeof error === 'object') {
			const messages = [];
			if (
				error?.response?.data &&
				error.response.data.errors instanceof Object
			) {
				errors = {};
				for (const e in error.response.data.errors) {
					messages.push(error.response.data.errors[e][0]);
				}

				errors = error.response.data.errors;
				errorMessage = messages.join(' ');
			} else {
				errorMessage = error?.response?.data?.message;
			}
		} else {
			errorMessage =
				error == 'Retry'
					? 'Something went wrong! Please try again later.'
					: error;
		}

		notifyAlert.emit({
			type: 'error',
			message: errorMessage,
		});
		throw { error: 'Error', message: errorMessage, errors };
	};

	const prepareResponse = (response: any, notify: boolean = true): any => {
		if (response) {
			if (notify) {
				notifyAlert.emit({
					type: 'success',
					message: response.data.message,
				});
			}
			return response.data.data || response.data;
		} else {
			resolveError('Retry');
		}
	};

	const preparePaginatedResponse = (
		response: any,
		notify: boolean = true
	): any => {
		if (response) {
			if (notify) {
				notifyAlert.emit({
					type: 'success',
					message: response.data.message,
				});
			}
			return response.data;
		} else {
			resolveError('Retry');
		}
	};

	const addToStateData = (
		state: any[] | StateInterface,
		originalItem: any,
		stateIsTarget = false,
		push = false
	): void => {
		const addData = function (_state: any[] | any, _item: any): void {
			if (_state instanceof Array) {
				const itemId = _item instanceof Object ? _item.id : _item;
				const filteredState: any[] = _state.filter(
					c => c instanceof Object
				);
				const index = filteredState.findIndex(
					(current: any) =>
						current instanceof Object && current.id == itemId
				);
				if (index > -1) {
					const existing = filteredState.find(
						current =>
							current instanceof Object && current.id == itemId
					);
					if (existing instanceof Object) {
						_state.splice(index, 1, {
							...existing,
							..._item,
						});
					} else {
						_state.splice(index, 1, _item);
					}
				} else if (push) {
					_state.push(_item);
				} else {
					_state.unshift(_item);
				}
			}
		};
		const items =
			originalItem instanceof Array ? originalItem : [originalItem];
		items.forEach(item => {
			if (stateIsTarget || state instanceof Array) {
				addData(state, item);
			} else {
				addData(state.data.data, item);
				state.all?.push(item);
				state.data.total =
					state.data.data instanceof Array
						? state.data.data.length
						: state.all.length;
			}
		});
	};

	const updateStateData = (
		state: any[] | StateInterface,
		originalItem: any,
		stateIsTarget = false,
		addToState = false
	): void => {
		const items =
			originalItem instanceof Array ? originalItem : [originalItem];
		const updateData = function (_state: any[] | any, _item: any): void {
			if (_state instanceof Array) {
				const itemId = _item instanceof Object ? _item.id : _item;
				const filteredState: any[] = _state.filter(
					c => c instanceof Object
				);
				const index = filteredState.findIndex(
					current => current instanceof Object && current.id == itemId
				);
				if (index > -1) {
					const existing = filteredState.find(
						current =>
							current instanceof Object && current.id == itemId
					);
					if (existing instanceof Object) {
						_state.splice(index, 1, {
							...existing,
							..._item,
						});
					} else {
						_state.splice(index, 1, _item);
					}
				} else if (addToState) {
					addToStateData(state, _item, stateIsTarget);
				}
			}
		};
		items.forEach(item => {
			if (stateIsTarget || state instanceof Array) {
				updateData(state, item);
			} else updateData(state.data.data, item);
		});
	};

	const removeFromStateData = (
		state: any[] | StateInterface,
		originalItem: any,
		stateIsTarget = false
	): void => {
		const items =
			originalItem instanceof Array ? originalItem : [originalItem];
		const removeData = function (_state: any[] | any, _item: any): void {
			if (_state instanceof Array) {
				const index = _state.findIndex((current: any) => {
					const itemId = _item instanceof Object ? _item.id : _item;
					if (current instanceof Object) {
						return (
							current instanceof Object && current.id == itemId
						);
					} else if (_item instanceof Function) return _item(current);
					else return current === _item;
				});
				if (index > -1) _state.splice(index, 1);
			}
		};
		items.forEach(item => {
			const id = item instanceof Object ? item.id : item;
			if (stateIsTarget || state instanceof Array) {
				removeData(state, id);
			} else {
				removeData(state.data.data, id);
				state.data.total =
					state.data.data instanceof Array
						? state.data.data.length
						: state.all.length;
			}
		});
	};

	const findItemInState = (
		state: any[] | StateInterface,
		item: any,
		stateIsTarget = false
	): any => {
		const itemId = item instanceof Object ? item.id : item;
		if (stateIsTarget || state instanceof Array) {
			return state.findIndex(
				(current: any) =>
					current instanceof Object && current.id == itemId
			);
		} else {
			return state.data.data.findIndex(
				(current: any) =>
					current instanceof Object && current.id == itemId
			);
		}
	};

	const getItemInState = (
		state: any[] | StateInterface,
		item: any,
		stateIsTarget = false
	): any => {
		const itemId = item instanceof Object ? item.id : item;
		if (stateIsTarget || state instanceof Array) {
			return state.find((current: any) => current.id == itemId);
		} else {
			return state.data.data.find(
				(current: any) =>
					current instanceof Object && current.id == itemId
			);
		}
	};

	const customDefineStore = (
		name: string,
		extra: any = {},
		_apiKey = null
	): StoreDefinition => {
		const apiKey = _apiKey || name;
		const base: StoreModule = {
			state: () => ({
				data: { data: [], total: 0 },
				isDataLoading: false,
				appendsData: false,
				tableOptions: {
					isLoading: true,
					columns: [],
					sortable: {
						order: 'created_at',
						sort: 'desc',
					},
				},
			}),

			getters: {
				table: (state: any) => {
					return Object.assign(
						{
							rows: state.data.data,
							totalRecordCount: state.data.total,
						},
						state.tableOptions
					);
				},
			},

			actions: {
				async getOne(id: any): Promise<any> {
					try {
						const response = await axios().get(
							`api/${apiKey}/${id}`
						);
						return prepareResponse(response, false);
					} catch (error) {
						resolveError(error);
					}
				},
				async getAll(params: any, callback?: any): Promise<any> {
					try {
						this.isDataLoading = true;
						this.setTableLoading(true);
						const response = await axios().get(`api/${apiKey}`, {
							params,
						});
						if (callback instanceof Function) {
							// Callback with signature: (state: any, response: any) => {}
							console.debug(
								'[Store]: Calling custom callback',
								response
							);
							this.data = callback(
								preparePaginatedResponse(response, false)
							);
						} else {
							this.data = preparePaginatedResponse(
								response,
								false
							);
						}
						this.isDataLoading = false;
						this.setTableLoading(false);
						return this.data;
					} catch (error) {
						resolveError(error);
					}
				},
				async save(params: any): Promise<any> {
					try {
						const method = params.id ? 'put' : 'post';
						const id = params.id ? `/${params.id}` : '';
						let formData = params;
						let config = {};
						if (params.hasFiles) {
							formData = utils.createFormData({
								data: params,
								hasFiles: true,
							});
							config = {
								headers: {
									'Content-Type': 'multipart/form-data',
								},
							};
						}
						const response = await axios()[method](
							`api/${apiKey}${id}`,
							formData,
							config
						);
						const result = prepareResponse(response);
						useStore().updateStateData(
							this.data.data,
							result,
							true,
							true
						);
						return result;
					} catch (error) {
						resolveError(error);
						return error;
					}
				},
				async delete(id: any): Promise<any> {
					try {
						const response = await axios().delete(
							`api/${apiKey}/${id}`
						);
						const result = prepareResponse(response);
						useStore().removeFromStateData(
							this.data.data,
							{ id },
							true
						);
						return result;
					} catch (error) {
						resolveError(error);
					}
				},
				async formConfig(params?: any): Promise<any> {
					try {
						const response = await axios().get(
							`api/${apiKey}/form-config`,
							{
								params,
							}
						);
						return prepareResponse(response, false);
					} catch (error) {
						resolveError(error);
					}
				},
				prepareTableData(options: any = {}): any {
					this.tableOptions = Object.assign(
						this.tableOptions,
						options
					);
					return this.tableData;
				},
				setTableLoading(value: boolean | number | string): void {
					this.tableOptions.isLoading = !!value;
				},
				setAppendsData(value: boolean | number | string): void {
					this.appendsData = !!value;
				},
			},
		};
		const store = defineStore(name, merge(base, extra));

		return store;
	};

	// @url: https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
	// Merge a `source` object to a `target` recursively
	const merge = (target: any, source: any): any => {
		// Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
		for (const key of Object.keys(source)) {
			if (
				source[key] instanceof Object &&
				target[key] instanceof Object
			) {
				Object.assign(source[key], merge(target[key], source[key]));
			}
		}

		// Join `target` and modified `source`
		Object.assign(target || {}, source);
		return target;
	};

	const prepareTableData = (extra: any = {}): any => {
		return reactive(
			merge(
				{
					isLoading: false,
					columns: [],
					sortable: {
						order: 'created_at',
						sort: 'desc',
					},
				},
				extra
			)
		);
	};

	return {
		basePath,
		merge,
		defineStore: customDefineStore,
		prepareTableData,
		resolveError,
		prepareResponse,
		preparePaginatedResponse,
		addToStateData,
		updateStateData,
		removeFromStateData,
		getItemInState,
		findItemInState,
	};
};
