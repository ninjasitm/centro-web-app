<script setup lang="ts">
import { useConfig } from '@/store';

/** Config Store */
const configStore = useConfig();
</script>
<template>
    <v-layout
        class="flex-wrap align-between mx-auto"
        style="max-width:768px"
    >
        <v-app-bar>
            <!-- Toggle Dark mode -->
            <v-btn
                icon="mdi-theme-light-dark"
                variant="flat"
                @click="configStore.toggleTheme"
            />
        </v-app-bar>
        <v-main>
            <v-container>
                <router-view />
            </v-container>
        </v-main>
        <v-footer class="mt-auto text-caption">
            {{ new Date().getFullYear() }} — Centro Advertising, a company of Clean Ventures Inc.
        </v-footer>
    </v-layout>
</template>
<style scoped lang="scss">
.v-footer {
    text-align: center;
    flex: 1 0 100%;
    height: 40px;
    align-self: baseline;
    font-size: 8px;
    background-color: #F0F0F0;
}
</style>
