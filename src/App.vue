<template>
   <v-app :style="{ background: $vuetify.theme.themes.dark.colors.background }">
      <v-main id="main">
         <Board />
      </v-main>
   </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Board from "./components/Board.vue";

export default defineComponent({
   name: "App",
   components: {
      Board,
   },
});
</script>

<style scoped>
#main {
   display: flex;
   align-items: center;
   justify-content: center;
   padding: 0 4.5rem;
}
</style>
