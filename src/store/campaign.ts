
import { defineStore } from 'pinia';

import { useStore } from '@/composables/store';
// import { useGlobals } from '@/main';
// import { axios } from '@/plugins/axios';
//
// const storeHelper = useStore();

export const useCampaignStore = defineStore('campaign', {
    state: () => {
        let campaign: any = localStorage.getItem('campaignDetails');
        campaign =
            typeof campaign === 'string' && campaign !== 'undefined' ? JSON.parse(campaign) : {};
        return {
            campaign,
            isLoading: true,
        };
    },

    getters: {},

    actions: {
        async getOne() {
            // Will use firebase to load campaign details from the firestore database
        }
    }
});