<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jacquard+12&display=swap" rel="stylesheet">

  <main>
    <div class="welcome-container">
      <RouterView />
    </div>
  </main>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.welcome-container {

  height: 100vh;
  background-image: url('assets/background.jpeg');
  background-size: cover;
  background-position: center;
}
</style>

