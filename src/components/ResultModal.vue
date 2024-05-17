<template>
   <v-dialog
      class="dialog"
      v-model="isDialogOpen"
      @click:outside="
         () => {
            handleDialogClose();
         }
      "
   >
      <canvas ref="view"></canvas>
   </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import * as PIXI from "pixi.js";
import { getParticleEmitter } from "../utils";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const props = defineProps({
   isOpen: { type: Boolean, required: true },
});

const isDialogOpen = ref(false);
const emit = defineEmits(["onDialogClose"]);

watch(
   () => props.isOpen,
   (isOpen) => {
      if (isOpen) {
         isDialogOpen.value = isOpen;
      }
   }
);

const view = ref<HTMLCanvasElement>();

const particleContainer = new PIXI.ParticleContainer();
const particleEmitter = getParticleEmitter(particleContainer);

const onMountCallback = () => {
   renderPixi();
   update();
   particleEmitter.emit = true;
};

watch(view, (element: any, prevElement) => {
   if (element instanceof HTMLCanvasElement) {
      view.value = element;
      if (onMountCallback && prevElement === undefined) {
         onMountCallback();
      }
   } else {
      view.value = undefined;
   }
});

const renderPixi = () => {
   if (view.value) {
      const app = new PIXI.Application({
         view: view.value,
         resizeTo: window,
         antialias: true,
         transparent: true,
      });

      const texture = PIXI.Texture.from(
         new URL("../assets/you-win.png", import.meta.url).href
      );
      const sprite = new PIXI.Sprite(texture);
      const tl = gsap.timeline({ defaults: { duration: 0.25 } });
      tl.to(sprite, { pixi: { hue: 180 } })
         .to(sprite, { pixi: { scale: 1 } })
         .to(sprite, { pixi: { brightness: 1 } })
         .to(sprite, { pixi: { hue: 0 } })
         .to(sprite, { pixi: { brightness: 2 } })
         .to(sprite, { pixi: { brightness: 1 } })
         .to(sprite, { pixi: { scale: 2 } })
         .to(sprite, { pixi: { alpha: 0 } })
         .then(() => {
            handleDialogClose();
         });

      sprite.anchor.set(0.5);
      sprite.position.set(app.screen.width / 2, app.screen.height / 2);

      app.stage.addChild(sprite);
      app.stage.addChild(particleContainer);

      particleEmitter.autoUpdate = true;
      particleEmitter.updateSpawnPos(app.view.width / 2, app.view.height / 2);
   }
};

let elapsed = Date.now();

const update = function () {
   requestAnimationFrame(update);

   var now = Date.now();

   particleEmitter.update((now - elapsed) * 0.001);
   elapsed = now;
};

const handleDialogClose = () => {
   isDialogOpen.value = false;
   emit("onDialogClose");
};
</script>

<style scoped>
.dialog {
   width: 100vw;
   height: 100vh;
}
</style>
