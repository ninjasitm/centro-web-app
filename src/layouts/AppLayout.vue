<script setup lang="ts">
import { useConfig } from '@/store';
import { useAuthStore } from '@/store/auth';

import LogoSVG from '@/assets/logo.svg';
import LogoWhiteSVG from '@/assets/logo-white.svg';

/** Config Store */
const configStore = useConfig();
const authStore = useAuthStore();
</script>
<template>
    <v-layout
        class="flex-wrap align-between mx-auto"
        style="max-width: 768px"
    >
        <v-app-bar class="elevation-0 pt-4 mb-3 px-4">
            <template v-slot:prepend>
                <!-- Toggle Dark mode -->
                <v-img
                    contain
                    alt="Centro Advertising"
                    max-height="32"
                    :src="configStore.theme ? LogoWhiteSVG : LogoSVG"
                    @click="configStore.toggleTheme"
                />
            </template>
            <v-spacer />
            <v-btn
                v-if="authStore.loggedIn"
                variant="tonal"
                rounded="xl"
                @click="authStore.logout"
            >Logout</v-btn>
        </v-app-bar>
        <v-main>
            <v-container>
                <router-view />
            </v-container>
        </v-main>
        <v-footer
            class="mt-auto mb-3 pt-5 text-caption px-6"
            :color="configStore.theme ? 'inherit' : '#f0f0f0'"
        >
            <div>
                <hr class="mb-2" />
                {{ new Date().getFullYear() }} — Centro Advertising, a company of Clean
                Ventures Inc.
            </div>
        </v-footer>
    </v-layout>
</template>
<style scoped lang="scss">
.v-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    flex: 1 0 100%;
    height: 48px;
    width: 100%;
    align-self: baseline;
    font-size: 8px !important;

    div {
        width: 100%;
    }

    hr {
        border-top: 0.5px solid rgba(0, 0, 0, 0.19);
    }
}
</style>
