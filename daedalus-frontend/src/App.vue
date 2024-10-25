<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jacquard+12&display=swap" rel="stylesheet">

  <div class="cursor-image"></div>

  <main>
    <div class="welcome-container">
      <button @click="goBack" class="back-button hide-on-mobile">Back</button> <!-- Clasă adăugată -->
      <button @click="toggleMusic" class="music-button hide-on-mobile" :class="{ playing: isPlaying }"></button> <!-- Clasă adăugată -->
      <RouterView />
    </div>
  </main>
</template>

<script setup>
import { RouterView, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import musicPath from './assets/music.wav';

const router = useRouter();
const audio = new Audio(musicPath);
const isPlaying = ref(false);

const goBack = () => {
  router.go(-1);
};

const toggleMusic = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    audio.play().catch((error) => console.error('Error playing audio:', error));
  } else {
    audio.pause();
  }
};

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
  position: relative;
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

.back-button {
  position: absolute;
  font-family: "Jacquard 12", system-ui;
  font-size: 1.7em;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #DAA520;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #B8860B;
}

.music-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-image: url('assets/harp.png');
  background-size: cover;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s;
}

.music-button.playing {
  transform: scale(1.1);
}

/* Clasă pentru a ascunde butoanele pe telefoane */
.hide-on-mobile {
  display: none; /* Ascunde butonul implicit */
}

/* Activează butoanele doar pe ecrane mari */
@media only screen and (min-width: 769px) {
  .hide-on-mobile {
    display: inline-block; /* Afișează butoanele pe ecrane mari */
  }
}
</style>
