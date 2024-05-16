<template>
    <v-dialog v-model="props.isOpen" width="500">
        <canvas id="view"></canvas>
    </v-dialog>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import * as PIXI from "pixi.js";

const props = defineProps({
    isOpen: { type: Boolean, required: true },
});

onMounted(() => {
    renderPixi();
});

const renderPixi = () => {
    const view = document.getElementById("view") as HTMLCanvasElement;
    if (view) {
        const app = new PIXI.Application({
            view: view,
            resizeTo: view,
        });
        document.body.appendChild(app.view);
        let texture = PIXI.Texture.from("../assets/logo.png");
        let sprite = new PIXI.Sprite(texture);
        app.stage.addChild(sprite);
    }
};
</script>

<style scoped></style>
