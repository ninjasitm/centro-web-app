<script setup lang="ts">
import { reactive, computed } from 'vue';
import IconUp from '../assets/arrow-up.svg';
import IconDown from '../assets/arrow-down.svg';
import { useConfig } from '@/store';

const configStore = useConfig();

const state = reactive({
    show: false,
    icon: computed(() => (state.show ? IconDown : IconUp)),
    howItWorksItems: [
        {
            title: 'Bluetooth scanning',
            description:
                'Visit this link to open a new tab and enable “Experimental Web Platform Features”',
            icon: 'mdi-bluetooth',
        },
        {
            title: 'Driver login',
            description:
                'Use your WhatsApp number to login – an OTP will be sent via SMS to continue',
            icon: 'mdi-cellphone',
        },
        {
            title: 'Device permissions',
            description:
                'Grant access to your device’s GPS location and Bluetooth while you’re on this website',
            icon: 'mdi-lock-open-outline',
        },
        {
            title: 'Drive reach',
            description:
                'While you drive stay logged in and allow Google Chrome to run in the background for tracking',
            icon: 'mdi-car',
        },
    ],
});
</script>
<template>
    <v-card
        id="how-it-works"
        :color="configStore.theme ? 'inherit' : '#f0f0f0'"
        :class="{
            'mb-4': true,
            'elevation-0': true,
            open: state.show,
        }"
    >
        <v-card-title class="text-center pt-6">
            <v-btn
                size="x-large"
                class="ml-4 text-h5 font-weight-bold"
                variant="plain"
                @click="state.show = !state.show"
            >
                How it works
                <v-img
                    width="40"
                    height="40"
                    :class="{
                        'ml-3': true,
                        open: state.show,
                    }"
                    :src="IconUp"
                ></v-img>
            </v-btn>
        </v-card-title>
        <v-card-text>
            <v-fade-transition>
                <p v-show="!state.show">
                    Standard Audience Reach is in beta and can only be accessed on Android
                    devices using Google Chrome
                </p>
            </v-fade-transition>
            <v-fade-transition>
                <v-list
                    v-show="state.show"
                    lines="three"
                    class="bg-transparent"
                >
                    <v-list-item
                        v-for="item in state.howItWorksItems"
                        class="px-2"
                        :key="item.title"
                    >
                        <v-list-item-title class="text-h6 font-weight-black mb-2">
                            <v-icon>{{ item.icon }}</v-icon>
                            {{ item.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <div v-html="item.description" />
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-fade-transition>
        </v-card-text>
    </v-card>
</template>
<style scoped lang="scss">
#how-it-works {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
    transition: all 0.300s ease-in-out;
    height: 138px;
    min-height: 1px;

    &.open {
        min-height: 508px;
    }

    .v-list {
        .v-list-item {
            font-size: 12px;
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            line-height: 150%;
        }
    }

    .v-img {
        background-color: #000;
        color: #fff;
        border-radius: 100px;
        font-weight: 200 !important;
        transition: all 0.3s ease-in-out;
        // transform: rotate(45deg);

        &.open {
            transform: rotate(180deg);
        }
    }
}
</style>
