<script setup lang="ts">
import Meta from '@/Meta';
import HowItWorks from '../HowItWorks.vue';

const title = import.meta.env.VITE_APP_TITLE;
</script>
<template>
    <v-row>
        <v-col>
            <h1 class="text-center mt-12">Let's make brand campaigns a success</h1>
            <p class="text-center mt-4">We provide and generate Standard Audience Reach data for campaigns by utilizing our driver fleet’s location and device.</p>
            <v-form class="mt-12">
                <v-row>
                    <v-col>
                        <v-text-field placeholder="WhatsApp Number"></v-text-field>
                        <v-btn
                            block
                            class="mb-3 brand-button"
                            variant="flat"
                            rounded="xl"
                            size="large"
                        >Next</v-btn>
                        <v-checkbox label="I understand how Standard Audience Reach works and enabled bluetooth scanning"></v-checkbox>
                    </v-col>
                </v-row>
                <HowItWorks style="bottom: 40px" />
            </v-form>
        </v-col>
    </v-row>
</template>
