import * as PIXI from "pixi.js";
import { Emitter } from "@pixi/particle-emitter";

export function getLotteryBallImage(value: number) {
   return new URL(`./assets/lottery-balls/${value}.png`, import.meta.url).href;
}

export function getParticleEmitter(container: PIXI.ParticleContainer): Emitter {
   const emitter = new Emitter(container, {
      lifetime: {
         min: 5,
         max: 15,
      },
      frequency: 0.01,
      spawnChance: 1,
      particlesPerWave: 1,
      emitterLifetime: 0.5,
      maxParticles: 25,
      pos: {
         x: 0.5,
         y: 0.5,
      },
      addAtBack: false,
      behaviors: [
         {
            type: "alpha",
            config: {
               alpha: {
                  list: [
                     {
                        value: 0.2,
                        time: 0,
                     },
                     {
                        value: 0.05,
                        time: 1,
                     },
                  ],
               },
            },
         },
         {
            type: "scale",
            config: {
               scale: {
                  list: [
                     {
                        value: 0.2,
                        time: 0,
                     },
                     {
                        value: 0.05,
                        time: 1,
                     },
                  ],
               },
            },
         },
         {
            type: "moveSpeed",
            config: {
               speed: {
                  list: [
                     {
                        value: 200,
                        time: 0,
                     },
                     {
                        value: 100,
                        time: 1,
                     },
                  ],
                  isStepped: false,
               },
            },
         },
         {
            type: "rotationStatic",
            config: {
               min: 0,
               max: 360,
            },
         },
         {
            type: "spawnShape",
            config: {
               type: "torus",
               data: {
                  x: 0,
                  y: 0,
                  radius: 5,
               },
            },
         },
         {
            type: "textureSingle",
            config: {
               texture: PIXI.Texture.from("src/assets/confetti.png"),
            },
         },
      ],
   });
   return emitter;
}
