<template>
   <v-container id="app">
      <div class="lottery-result">
         <div class="lottery-balls"></div>
      </div>
   </v-container>
   <Selection
      :items="items"
      :selected-number="selectedNumber"
      :is-count-down-in-progress="props.isCountDownInProgress"
      :balance="balance"
      @on-lottery-ball-select="onLotteryBallSelect"
   />
   <Balance :balance="balance" />
   <ResultModal :is-open="isCurrentRoundWin" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getLotteryBallImage } from "../../utils";
import Selection from "./Selection.vue";
import ResultModal from "../ResultModal.vue";
import Balance from "../Balance.vue";
import gsap from "gsap";

const selectedNumber = ref<number>(0);
const isCurrentRoundWin = ref<boolean>(false);
const balance = ref<number>(3);

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const pool: Array<number> = [];

const lotteryResult = ref();

const emit = defineEmits(["startTimer"]);

const props = defineProps({
   isCountDownInProgress: { type: Boolean, required: true },
});

watch(
   () => props.isCountDownInProgress,
   (isCountDownInProgress) => {
      if (!isCountDownInProgress) {
         spin();
      }
   }
);

onMounted(() => {
   lotteryResult.value = document.querySelector(
      ".lottery-result"
   ) as HTMLDivElement;

   emit("startTimer");
   init();
});

function init(firstInit = true, groups = 10, duration = 10) {
   const balls = document.querySelector(".lottery-balls") as HTMLDivElement;

   lotteryResult.value.dataset.spinned = "0";
   pool.length = 0;

   if (firstInit) {
      pool.push(0);
   }

   if (lotteryResult.value.dataset.spinned === "1") {
      return;
   }

   const ballsClone = balls.cloneNode(false) as HTMLDivElement;

   if (!firstInit) {
      const arr = [];
      for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
         arr.push(...items);
      }
      pool.push(...gsap.utils.shuffle(arr));

      ballsClone.addEventListener(
         "transitionstart",
         function () {
            lotteryResult.value.dataset.spinned = "1";
            const balls = this.querySelectorAll(
               ".ball"
            ) as NodeListOf<HTMLImageElement>;
            balls.forEach((ball) => {
               ball.style.filter = "blur(1px)";
            });
         },
         { once: true }
      );

      ballsClone.addEventListener(
         "transitionend",
         function () {
            const balls = this.querySelectorAll(
               ".ball"
            ) as NodeListOf<HTMLImageElement>;
            balls.forEach((ball, index) => {
               ball.style.filter = "blur(0)";
               if (index > 0) this.removeChild(ball);
            });
         },
         { once: true }
      );
   }

   for (let i = pool.length - 1; i >= 0; i--) {
      const ball = document.createElement("img");
      ball.classList.add("ball");
      ball.style.width = lotteryResult.value.clientWidth + "px";
      ball.style.height = lotteryResult.value.clientHeight + "px";
      ball.src = getLotteryBallImage(pool[i]);
      ballsClone.appendChild(ball);
   }
   ballsClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
   ballsClone.style.transform = `translateY(-${
      lotteryResult.value.clientHeight * (pool.length - 1)
   }px)`;
   lotteryResult.value.replaceChild(ballsClone, balls);
}

async function spin() {
   const duration = 10;
   init(false, duration, 5);

   animate();

   checkIsWin(duration);
}

function animate() {
   setTimeout(async () => {
      const balls = lotteryResult.value.querySelector(
         ".lottery-balls"
      ) as HTMLDivElement;
      if (balls) {
         const duration = parseInt(balls.style.transitionDuration);
         balls.style.transform = "translateY(0)";
         await new Promise((resolve) => {
            setTimeout(resolve, duration * 100);
         });
      }
   }, 250);
}

function checkIsWin(duration: number) {
   setTimeout(() => {
      const winnerNumber = pool.pop();
      if (selectedNumber.value) {
         if (winnerNumber === selectedNumber.value) {
            balance.value = balance.value + 2;
            isCurrentRoundWin.value = true;
         } else {
            balance.value = balance.value - 1;

            isCurrentRoundWin.value = false;
         }
      }

      const tl = gsap.timeline({
         defaults: { duration: 0.5, ease: "linear" },
      });
      tl.to(`.ball-${winnerNumber}`, { y: "-2", rotate: -15 });
      tl.to(`.ball-${winnerNumber}`, { y: "-2", rotate: +15 });
      tl.to(`.ball-${winnerNumber}`, { y: "-2", rotate: -15 });
      tl.to(`.ball-${winnerNumber}`, { y: "-2", rotate: +15 });
      tl.to(`.ball-${winnerNumber}`, { y: "0", rotate: 0 });

      setTimeout(() => {
         reset();
      }, (duration / 2) * 1000);
   }, (duration / 2) * 1000);
}

function onLotteryBallSelect(selectedBall: number) {
   selectedNumber.value = selectedBall;
}

function reset() {
   //reset state
   isCurrentRoundWin.value = false;
   selectedNumber.value = 0;
   emit("startTimer");
}
</script>

<style scoped>
#app {
   width: 100%;
   height: 100%;
   background: #1a2b45;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
}

.lottery-result {
   width: 6rem;
   height: 6rem;
   overflow: hidden;
   border-radius: 0.5rem;
   margin: 1rem;
}

.lottery-balls {
   transition: transform 1s ease-in-out;
}

.ball {
   display: flex;
   justify-content: center;
   align-items: center;
   background-position: "center";
}

@media (max-width: 1024px) {
   .lottery-result {
      width: 4rem;
      height: 4rem;
   }
}
</style>
