import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { useGeolocation, useBluetooth } from '@vueuse/core';

/** Global Store */
const useGlobalStore = defineStore('global', () => {
  // State

  /** Loading overlay */
  const loading: Ref<boolean> = ref(true);
  /** ProgressBar Percentage */
  const progress: Ref<number | null> = ref(null);
  /** SnackBar Text */
  const message: Ref<string> = ref('');

  // Actions

  /**
   * Show loading Overlay
   *
   * @param display - visibility
   */
  function setLoading(display: boolean): void {
    loading.value = display;
    if (!display) {
      // Reset Progress value
      progress.value = null;
    }
  }

  /**
   * Update progress value
   *
   * @param v - progress value
   */
  function setProgress(v: number | null = null): void {
    // update progress value
    progress.value = v;
    // display loading overlay
    loading.value = true;
  }

  /**
   * Show snackbar message
   *
   * @param msg - snackbar message
   */
  function setMessage(msg: string = ''): void {
    // put snackbar text
    message.value = msg;
  }

  /**
   * Request bluetooth access
   */
  async function onRequestBluetoothAccess(): any {
    console.log('onRequestBluetooth');

    const {
      isSupported,
      isConnected,
      device,
      requestDevice,
      server,
    } = useBluetooth({
      acceptAllDevices: true,
    });

    if (!isConnected) {
      await requestDevice();
    }

    return {
      isSupported,
      isEnabled: isConnected,
      isConnected,
      device,
      requestDevice,
      server,
    };
  }

  /**
   *
   * @returns Request location access
   */
  async function onRequestLocationAccess(): any {
    console.log('onRequestLocationAccess');
    const { coords, locatedAt, error, resume, pause } = useGeolocation();
    const permissionStatus = await navigator?.permissions?.query({ name: 'geolocation' });

    return {
      isEnabled: permissionStatus?.state === 'granted',
      coords,
      locatedAt,
      error,
      resume,
      pause,
    };
  }

  return {
    loading, progress, message, setLoading, setProgress, setMessage, onRequestBluetoothAccess, onRequestLocationAccess
  };
});

export default useGlobalStore;
