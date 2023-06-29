<script setup lang="ts">
import { reactive, computed } from 'vue';

const state = reactive({
    show: false,
    icon: computed(() => state.show ? 'mdi-arrow-down' : 'mdi-arrow-up')
});
</script>
<template>
    <v-card id="how-it-works">
        <v-card-title><v-btn
                class="ml-4"
                variant="flat"
            >How it works <v-icon>{{ state.icon }}</v-icon></v-btn></v-card-title>
        <v-card-text>
            <p>Standard Audience Reach is in beta and can only be accessed on Android devices using Google Chrome</p>
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
    ;
    transition: all 0.3s ease-in-out;
    background-color: #F0F0F0;
}
</style>
