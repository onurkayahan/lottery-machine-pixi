<template>
    <v-container class="bg-white">
        <v-row align="center" justify="center">
            <v-col
                class="p-1"
                cols="auto"
                v-for="(item, index) in items"
                :key="item"
            >
                <v-img
                    width="75"
                    class="mt-3"
                    :class="selectedBall === item ? 'selected' : ''"
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
import { ref } from "vue";
import { getLotteryBallImage } from "../../utils";

const selectedBall = ref();

const emit = defineEmits(["onLotteryBallSelect"]);

const props = defineProps({
    items: { type: Array<number>, required: true },
});

function selectLotteryBall(number: number) {
    console.log("child", number);
    selectedBall.value = number;
    emit("onLotteryBallSelect", number);
}
</script>

<style scoped>
.selected {
    border-radius: 50%;
    padding: 1rem;
    border: 0.5rem #1a2b45 dashed;
}
</style>
