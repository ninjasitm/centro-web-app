<script lang="ts">
export default {
  name: 'Login',
  inheritAttrs: false,
  customOptions: {},
};
</script>
<script setup lang="ts">
import Meta from '@/Meta';
import { reactive, computed, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, sameAs, helpers } from '@vuelidate/validators';
import HowItWorks from '../HowItWorks.vue';
import { useBluetooth } from '@vueuse/core';
import { useGlobals } from '@/main';


const globalStore = useGlobals();

const state: any = reactive({
  step: 0,
  isLoading: false,
  form: {
    phone: null,
    otp: null,
    terms: false,
    locationAccess: false,
    bluetoothAccess: false,
  },
  steps: [
    {
      title: "Let's make brand campaigns a success",
      description:
        'We provide and generate Standard Audience Reach data for campaigns by utilizing our driver fleet’s location and device.',
      rules: {
        phone: {
          required: helpers.withMessage(
            'A valid phone number is required',
            required
          ),
        },
        terms: {
          sameAs: helpers.withMessage(
            'You will need to agree to the terms and conditions to continue',
            sameAs(true)
          ),
        },
      },
    },
    {
      title: 'Verify phone',
      description: computed(
        () =>
          `A 6-digit-code was sent to ${state.form.phone}, enter it below to continue`
      ),
      rules: {
        otp: {
          required: helpers.withMessage('A valid OTP is required', required),
        },
      },
    },
    {
      title: 'Location accesss',
      description:
        'For successful campaigns Centro collects location data from the time you’re logged in – you won’t be tracked when you logout',
      rules: {
        locationAccess: {
          sameAs: helpers.withMessage(
            'You will need to enable location access to continue',
            sameAs(true)
          ),
        },
      },
    },
    {
      title: 'Bluetooth access',
      description:
        'For successful campaigns Centro collects surrounding Bluetooth signals from the time you’re logged in – you won’t be tracked when you logout',
      rules: {
        bluetoothAccess: {
          sameAs: helpers.withMessage(
            'You will need to enable Bluetooth access to continue',
            sameAs(true)
          ),
        },
      },
    },
  ],
});

let $v = useVuelidate(state.steps[state.step].rules, state.form);

function onRequestOtp() {
  console.log('onRequestOtp');
}

async function onLogin() {
  console.log('onLogin');
  window.localStorage.setItem('onboarded', true);
  window.localStorage.setItem('loginDetails', JSON.stringify(state.form));
  window.localStorage.setItem(
    'account',
    JSON.stringify({
      Name: 'John Doe',
      LocaionAccess: true,
      BluetoothAccess: true,
      Phone: state.form.phone,
    })
  );
  window.localStorage.setItem(
    'campaignDetails',
    JSON.stringify({
      Campaign_name: 'Go Digital With Digicel',
      Brand_name: 'Digicel',
      Brand_id: '123456789',
      Start_Date: '2021-09-01',
      End_Date: '2021-09-30',
    })
  );
}

/**
 * On next step
 */
async function onNextStep() {
  const validated = await $v.value.$validate();
  console.log('Validating', validated);
  if (validated) {
    switch (state.step) {
      case 0:
        state.step = 1;
        break;
      case 1:
        state.step = 2;
        globalStore.onRequestBluetoothAccess();
        break;
      case 2:
        state.step = 3;
        globalStore.onRequestLocationAccess();
        break;

      default:
        await onLogin();
        break;
    }
  }
  $v = useVuelidate(state.steps[state.step].rules, state.form);
}

onMounted(() => { });
</script>
<template>
  <v-row>
    <v-col>
      <h1 class="text-center mt-12">{{ state.steps[state.step].title }}</h1>
      <p
        class="text-center mt-4"
        v-html="state.steps[state.step].description"
      ></p>
      <v-form class="mt-12">
        <v-row>
          <v-col v-if="state.step === 0">
            <v-text-field
              v-model="state.form.phone"
              required
              class="rounded-lg"
              variant="outlined"
              placeholder="WhatsApp Number"
              :error-messages="$v.phone.$errors.map(e => e.$message)"
              @input="$v.phone.$touch"
              @blur="$v.phone.$touch"
            />
            <v-btn
              block
              class="mb-3 brand-button"
              variant="flat"
              rounded="xl"
              size="x-large"
              :disabled="state.isLoading || !state.form.phone | !state.form.terms
                "
              :loading="state.isLoading"
              @click="onNextStep"
            >
              Next
            </v-btn>
            <v-checkbox
              v-model="state.form.terms"
              required
              class="text-caption"
              label="I understand how Standard Audience Reach works and enabled bluetooth scanning"
              :error-messages="$v.terms.$errors.map(e => e.$message)"
              @input="$v.terms.$touch"
              @blur="$v.terms.$touch"
            />
          </v-col>
          <v-col
            v-else-if="state.step === 1"
            class="pt-0"
          >
            <div class="text-center mb-6">
              <a
                class="font-weight-bold text-center"
                @click="state.step = 0"
              >
                Change WhatsApp number
              </a>
            </div>
            <v-text-field
              v-model="state.form.otp"
              variant="outlined"
              placeholder="OTP 6 digit code"
              :error-messages="$v.otp?.$errors.map(e => e.$message)"
              @blur="$v.otp?.$touch"
              @input="$v.otp?.$touch"
            />
            <v-btn
              block
              class="mb-3 brand-button"
              variant="flat"
              rounded="xl"
              size="x-large"
              :disabled="state.isLoading || !state.form.otp"
              :loading="state.isLoading"
              @click="onNextStep"
            >
              Next
            </v-btn>
            <p>
              Didn’t get a code?
              <a
                class="font-weight-bold"
                variant="plain"
                @click="onRequestOtp"
              >
                Resend
              </a>
            </p>
          </v-col>
          <v-col v-else-if="state.step === 2">
            <v-btn
              block
              class="mb-3 brand-button"
              variant="flat"
              rounded="xl"
              size="x-large"
              :disabled="state.isLoading"
              :loading="state.isLoading"
              @click="onNextStep"
            >
              Give access to location
            </v-btn>
            <v-alert
              v-if="$v.locationAccess?.$errors.length"
              type="warning"
              variant="tonal"
            >
              <p
                v-for="error in $v.locationAccess.$errors"
                :key="error"
              >
                {{ error.$message }}
              </p>
            </v-alert>
          </v-col>
          <v-col v-else-if="state.step === 3">
            <v-btn
              block
              class="mb-3 brand-button"
              variant="flat"
              rounded="xl"
              size="x-large"
              :disabled="state.isLoading"
              :loading="state.isLoading"
              @click="onNextStep"
            >
              Give access to Bluetooth
            </v-btn>
            <v-alert
              v-if="$v.bluetoothAccess?.$errors.length"
              type="warning"
              variant="tonal"
            >
              <p
                v-for="error in $v.bluetoothAccess.$errors"
                :key="error"
              >
                {{ error.$message }}
              </p>
            </v-alert>
          </v-col>
        </v-row>
        <HowItWorks style="bottom: 40px" />
      </v-form>
    </v-col>
  </v-row>
</template>
<style scopes lang="scss">
.v-field__outline {
  border: 1px solid #000;
  border-radius: 100px !important;

  .v-field__outline__start,
  .v-field__outline__end {
    border: none !important;
  }
}
</style>
