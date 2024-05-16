<template>
   <v-progress-linear :model-value="countDown"> </v-progress-linear>
</template>

<script setup>
import { ref, watch } from "vue";

const countDown = ref();

const props = defineProps({
   isCountDownInProgress: { type: Boolean, required: true },
});

watch(
   () => props.isCountDownInProgress,
   (isCountDownInProgress, prevValue) => {
      if (!prevValue) {
         if (isCountDownInProgress) {
            countDown.value = 100;
            countDownTimer();
         }
      }
   }
);

const emit = defineEmits(["onTimerEnd"]);

function countDownTimer() {
   if (countDown.value > 0) {
      setTimeout(() => {
         countDown.value = countDown.value - 100 / 15;
         countDownTimer();
      }, 1000);
   } else {
      emit("onTimerEnd");
   }
}
</script>
