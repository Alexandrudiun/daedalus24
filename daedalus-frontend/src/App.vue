<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jacquard+12&display=swap" rel="stylesheet">

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
  width: 50px;
  height: 50px;
  background-image: url('assets/cursor.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
}
</style>
