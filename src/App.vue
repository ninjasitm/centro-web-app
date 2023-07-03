<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue';
import { useRouter } from 'vue-router';

import { useTheme } from 'vuetify';

import logo from '@/assets/logo.svg';
import AppLayout from '@/layouts/AppLayout.vue';
import { useGlobals } from '@/main';
import { useAuthStore } from '@/store/auth';
import { useGlobal, useConfig } from '@/store/index';

/** Vuetify Theme */
const theme = useTheme();

/** Global Store */
const globalStore = useGlobal();

/** Config Store */
const configStore = useConfig();

const $router = useRouter();

/** Title */
const title = import.meta.env.VITE_APP_TITLE ?? 'Vuetify3 Application';

/** drawer visibility */
// const drawer: Ref<boolean> = ref(false);

/** loading overlay visibility */
// const loading: WritableComputedRef<boolean> = computed({
//   get: () => globalStore.loading,
//   set: v => globalStore.setLoading(v),
// });

/** Appbar progressbar value */
// const progress: ComputedRef<number | null> = computed(
//   () => globalStore.progress
// );

/** Snackbar visibility */
const snackbarVisibility: Ref<boolean> = ref(false);

/** Snackbar text */
// const snackbarText: ComputedRef<string> = computed(() => globalStore.message);

/** Toggle Dark mode */
const isDark: ComputedRef<string> = computed(() =>
  configStore.theme ? 'dark' : 'light'
);

// When snackbar text has been set, show snackbar.
watch(
  () => globalStore.message,
  (message: string) => (snackbarVisibility.value = message !== '')
);

/** Clear store when snackbar hide */
// const onSnackbarChanged = async () => {
//   globalStore.setMessage();
//   await nextTick();
// };

$router.isReady().then(async () => {

  const authStore = useAuthStore();
  // Fetch the logged in user
  await authStore.load();
  const { $auth } = useGlobals();
  console.debug('[App]: Router is ready');
  console.debug('[App]: Is Ready?', $auth.ready(), $auth.check());
}).catch((err: Error) => {
  console.error('[App]: Router is not ready', err);
});

onMounted(() => {
  document.title = title;
});
</script>

<template>
  <v-app
    :theme="isDark"
    class="align-center justify-content-center"
  >
    <AppLayout />
  </v-app>
  <teleport to="head">
    <meta
      name="theme-color"
      :content="theme.computedThemes.value[isDark].colors.primary"
    />
    <link
      rel="icon"
      :href="logo"
      type="image/svg+xml"
    />
  </teleport>
</template>

<style lang="scss">
@use 'vuetify/_settings';

html {
  // Fix always scrollbar shown.
  overflow-y: auto;
  // Modern scrollbar style
  scrollbar-width: thin;
  scrollbar-color: map-get(settings.$grey, 'lighten-2') map-get(settings.$grey, 'base');
}

::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0.5rem rgba(0, 0, 0, 0.1);
  background-color: map-get(settings.$grey, 'lighten-2');
}

::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: map-get(settings.$grey, 'base');
  box-shadow: inset 0 0 0.5rem rgba(0, 0, 0, 0.1);
}

// Fixed a bug that the theme color is interrupted when scrolling
.v-application {
  overflow-y: auto;

  .v-application__wrap {
    justify-content: center;
  }
}

// Fix app-bar's progress-bar
.v-app-bar .v-progress-linear {
  position: absolute;
  bottom: 0;
}
</style>
