<template>
   <v-row class="text-center bg-white">
      <Countdown
         :is-count-down-in-progress="isCountDownInProgress"
         @on-timer-end="handleTimerEnd"
      />
      <v-col cols="12">
         <v-img
            :src="logo"
            class="my-3"
            contain
            height="100"
            :onclick="openModal"
         />
      </v-col>
      <Game
         :is-count-down-in-progress="isCountDownInProgress"
         @start-timer="handleStartTimer"
      />
   </v-row>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Game from "./game/Game.vue";
import Countdown from "./Countdown.vue";

const logo = new URL(`@/assets/logo.png`, import.meta.url).href;

const isResultModalOpen = ref(false);

const openModal = () => {
   isResultModalOpen.value = true;
};

const isCountDownInProgress = ref(false);

function handleStartTimer() {
   isCountDownInProgress.value = true;
}

function handleTimerEnd() {
   isCountDownInProgress.value = false;
}
</script>
