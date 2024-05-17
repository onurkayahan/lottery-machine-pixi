<template>
   <v-container class="container text-white">
      <v-row justify="center">
         <v-col cols="auto" class="d-flex g-4">
            <p class="font-weight-bold">Balance:</p>
            <p class="font-weight-medium">{{ props.balance }}</p>
         </v-col>
      </v-row>
   </v-container>
</template>

<script setup lang="ts">
const props = defineProps({
   balance: { type: Number, required: true },
});
</script>

<style scoped>
.container {
   background: #1a2b45;
}
p {
   font-size: 2rem;
   padding: 1rem;
}

@media (max-width: 1024px) {
   p {
      font-size: 1rem;
      padding: 0.5rem;
   }
}
</style>
