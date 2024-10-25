<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jacquard+12&display=swap" rel="stylesheet">

  <!-- Imaginea cursorului -->
  <div class="cursor-image"></div>

  <main>
    <div class="welcome-container">
      <RouterView />
    </div>
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';

onMounted(() => {
  const cursorImage = document.querySelector(".cursor-image");

  // Urmărire poziție cursor
  window.addEventListener("mousemove", (e) => {
    cursorImage.style.left = `${e.clientX}px`;
    cursorImage.style.top = `${e.clientY}px`;
  });
});
</script>

<style scoped>
.welcome-container {
  height: 100vh;
  background-image: url('assets/background9.jpeg');
  background-size: cover;
  background-position: center;
}

.cursor-image {
  width: 30px; /* Ajustează dimensiunea pe baza imaginii cursor.png */
  height: 30px;
  background-image: url('assets/cursor.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  pointer-events: none; /* Nu interferează cu alte elemente */
  z-index: 9999;
  transform: translate(-50%, -50%); /* Centrare pe poziția cursorului */
}
</style>
