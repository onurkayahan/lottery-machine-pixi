<template>
    <v-container id="app">
        <div class="doors">
            <div class="door">
                <div class="lottery-balls"></div>
            </div>
        </div>
        <div class="buttons">
            <v-btn :disabled="!selectedNumber" id="spinner" :onclick="spin"
                >Spin</v-btn
            >
            <v-btn id="reseter" :onclick="init">Reset</v-btn>
        </div>
    </v-container>
    <Selection :items="items" @on-lottery-ball-select="onLotteryBallSelect" />
    <ResultModal :is-open="isCurrentRoundWin" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getLotteryBallImage } from "../../utils";
import Selection from "./Selection.vue";
import ResultModal from "../ResultModal.vue";

const selectedNumber = ref();
const isCurrentRoundWin = ref(false);

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const pool = [0];

const doorRef = ref();

onMounted(() => {
    doorRef.value = document.querySelector(".door") as HTMLDivElement;

    init();
});

function init(firstInit = true, groups = 10, duration = 10) {
    const balls = document.querySelector(".lottery-balls") as HTMLDivElement;

    if (firstInit) {
        doorRef.value.dataset.spinned = "0";
        pool.length = 0;
        pool.push(0);
    } else if (doorRef.value.dataset.spinned === "1") {
        return;
    }

    const ballsClone = balls.cloneNode(false) as HTMLDivElement;

    if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
            arr.push(...items);
        }
        pool.push(...shuffle(arr));
        console.log(pool);
        ballsClone.addEventListener(
            "transitionstart",
            function () {
                doorRef.value.dataset.spinned = "1";
                const balls = this.querySelectorAll(
                    ".box"
                ) as NodeListOf<HTMLImageElement>;
                balls.forEach((box) => {
                    box.style.filter = "blur(1px)";
                });
            },
            { once: true }
        );

        ballsClone.addEventListener(
            "transitionend",
            function () {
                const balls = this.querySelectorAll(
                    ".box"
                ) as NodeListOf<HTMLImageElement>;
                balls.forEach((box, index) => {
                    box.style.filter = "blur(0)";
                    if (index > 0) this.removeChild(box);
                });
            },
            { once: true }
        );
    }

    for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("img");
        box.classList.add("box");
        box.style.width = doorRef.value.clientWidth + "px";
        box.style.height = doorRef.value.clientHeight + "px";

        box.src = getLotteryBallImage(pool[i]);
        ballsClone.appendChild(box);
    }
    ballsClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
    ballsClone.style.transform = `translateY(-${
        doorRef.value.clientHeight * (pool.length - 1)
    }px)`;
    doorRef.value.replaceChild(ballsClone, balls);
}

function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
}
async function spin() {
    const duration = 10;
    if (selectedNumber.value) {
        init(false, duration, 5);

        animate();

        checkIsWin(duration);
    }
}

function animate() {
    setTimeout(async () => {
        const balls = doorRef.value.querySelector(
            ".lottery-balls"
        ) as HTMLDivElement;
        if (balls) {
            const duration = parseInt(balls.style.transitionDuration);
            balls.style.transform = "translateY(0)";
            await new Promise((resolve) => {
                setTimeout(resolve, duration * 100);
            });
        }
    }, 0);
}

function checkIsWin(duration: number) {
    setTimeout(() => {
        const winnerNumber = pool.pop();
        if (winnerNumber === selectedNumber.value) {
            isCurrentRoundWin.value = true;
        } else {
            isCurrentRoundWin.value = false;
        }
    }, (duration / 2) * 1000);
}

function onLotteryBallSelect(selectedBall: number) {
    selectedNumber.value = selectedBall;
    console.log("onSelect", selectedBall);
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

.doors {
    display: flex;
}

.door {
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 5px;
    margin: 5px;
    margin: 1rem;
}

.lottery-balls {
    /* transform: translateY(0); */
    transition: transform 1s ease-in-out;
}

.box {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    width: 100%;
    height: 100;
    background-position: "center";
}

.buttons {
    margin: 1rem 0 2rem 0;
}

button {
    cursor: pointer;
    font-size: 1.2rem;
    margin: 0 0.2rem;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
}

.info {
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
}
</style>
