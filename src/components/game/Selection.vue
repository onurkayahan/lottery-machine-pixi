<template>
   <v-container class="container bg-white">
      <v-row justify="center">
         <v-col class="p-1" cols="auto" v-for="item in props.items" :key="item">
            <v-img
               width="75"
               class="lottery-ball mt-3"
               :class="[`ball-${item}`, { selected: selected === item }]"
               :src="getLotteryBallImage(item)"
               :onclick="
                  () => {
                     selectLotteryBall(item);
                  }
               "
            />
         </v-col>
      </v-row>
   </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { getLotteryBallImage } from "../../utils";
import { onMounted } from "vue";
import gsap from "gsap";

const selected = ref();
const gsapAnimation = ref();

const emit = defineEmits(["onLotteryBallSelect"]);

const props = defineProps({
   items: { type: Array<number>, required: true },
   selectedNumber: { type: Number, required: true },
   isCountDownInProgress: { type: Boolean, required: true },
   balance: { type: Number, required: true },
});

watch(
   () => props.selectedNumber,
   (selectedNumber) => {
      if (selectedNumber === 0) {
         selected.value = 0;
      }
   }
);

watch(
   () => props.isCountDownInProgress,
   (isInProgress) => {
      if (!isInProgress) {
         gsapAnimation.value.pause(0, false);
      } else {
         gsapAnimation.value.resume();
      }
   }
);

function selectLotteryBall(number: number) {
   if (props.isCountDownInProgress && props.balance > 0) {
      selected.value = number;
      emit("onLotteryBallSelect", number);
   }
}

onMounted(() => {
   gsapAnimation.value = gsap.to(".lottery-ball", {
      scale: 0.75,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "power4.in",
   });
});
</script>

<style scoped>
.container {
   max-height: 30vh;
   overflow-y: auto;
}

.selected {
   border-radius: 50%;
   border: 0.25rem #1a2b45 dotted;
}
</style>
