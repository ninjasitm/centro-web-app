<!-- eslint-disable import/first -->
<script lang="ts">
export default {
    name: 'Home',
    inheritAttrs: false,
    customOptions: {},
};
</script>
<script setup lang="ts">
import { reactive, onMounted } from 'vue';

import 'mapbox-gl/dist/mapbox-gl.css'
import 'v-mapbox/dist/v-mapbox.css';
import Mapbox from "mapbox-gl";
import {
    VMap,
    VControlGeolocate,
    VControlNavigation
} from "v-mapbox";
import { useCampaignStore } from '@/store/campaign';
import useGlobalStore from '@/store/GlobalStore';
import HowItWorks from '../HowItWorks.vue';

const campaignStore = useCampaignStore();
const { onRequestBluetoothAccess, onRequestLocationAccess } = useGlobalStore();

const state: any = reactive({
    coords: [],
    accessToken: import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN,
    mapStyle: "mapbox://styles/mapbox/basic-v10",
    mapbox: null,
    access: {
        bluetooth: {},
        location: {},
    }
});

const campaign: any = campaignStore.campaign;

function onMapLoaded() {

}

onMounted(async () => {
    state.mapbox = Mapbox;
    state.access.location = await onRequestLocationAccess();
    state.access.bluetooth = await onRequestBluetoothAccess();
});
</script>
<template>
    <v-row id="home-container">
        <v-col>
            <v-card class="campaign ma-2 mt-4">
                <v-card-text class="text-center">
                    <h2>{{ campaign.Campaign_name }}</h2>
                    <p class="my-1">{{ campaign.Brand_name }}&nbsp;&bullet;&nbsp;ID{{ campaign.Brand_id }}</p>
                    <p class="my-1">Start {{ campaign.Start_Date }}&nbsp;&bullet;&nbsp;End {{ campaign.End_Date }}</p>
                    <v-row class="mt-2 px-0">
                        <v-col
                            class="px-0"
                            cols="6"
                        >
                            <v-btn
                                variant="flat"
                                size="small"
                            >
                                <v-icon class="mr-2">mdi-crosshairs-gps</v-icon>
                                Location {{ state.access.location.isEnabled ? 'On' : 'Off' }}
                                <v-icon
                                    class="ml-2"
                                    :color="state.access.location.isEnabled ? '#03D025' : 'red'"
                                >mdi-circle</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col
                            class="px-0"
                            cols="6"
                        >
                            <v-btn
                                variant="flat"
                                size="small"
                            >
                                <v-icon class="mr-2">mdi-bluetooth</v-icon>
                                Bluetooth {{ state.access.bluetooth.isEnabled ? 'On' : 'Off' }}
                                <v-icon
                                    class="ml-2"
                                    :color="state.access.bluetooth.isEnabled ? '#03D025' : 'red'"
                                >mdi-circle</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <VMap
                :accessToken="state.accessToken"
                :mapStyle="state.mapStyle"
            >
                <!-- <VControlGeolocate position="bottom-right" /> -->
                <!-- <VControlNavigation position="bottom-right" /> -->
            </VMap>
            <HowItWorks style="bottom: 40px" />
        </v-col>
    </v-row>
</template>
<style scopes lang="scss">
#home-container {
    height: calc(100vh - 120px);
    width: 100vw;
}

.v-field__outline {
    border: 1px solid #000;
    border-radius: 100px !important;

    .v-field__outline__start,
    .v-field__outline__end {
        border: none !important;
    }
}

.campaign {
    right: 10px;
    left: 10px;
    position: fixed;
    border-radius: 8px;
    border: 1px solid #121212;
}
</style>
