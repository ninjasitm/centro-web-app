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
        <v-footer class="mt-auto mb-3 pt-5 text-caption px-6">
            <div>
                <hr class="mb-2" />
                {{ new Date().getFullYear() }} — Centro Advertising, a company of Clean Ventures Inc.
            </div>
        </v-footer>
    </v-layout>
</template>
<style scoped lang="scss">
.v-footer {
    text-align: center;
    flex: 1 0 100%;
    height: 48px;
    width: 100%;
    align-self: baseline;
    font-size: 8px !important;
    background-color: #F0F0F0;

    div {
        width: 100%;
    }

    hr {
        border-top: 0.5px solid rgba(0, 0, 0, 0.19);
    }
}
</style>
