<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Jacquard+12&display=swap" rel="stylesheet">

  <div v-for="index in 20" :key="index" class="star"></div>

  <main>
    <div class="welcome-container">
      <RouterView />
    </div>
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';

const coords = { x: 0, y: 0 };
const stars = [];

function initStars() {
  const starElements = document.querySelectorAll(".star");
  const colors = [
    "#B22222", 
    "#0072B8", 
    "#6B8E23", 
    "#FFD700", 
    "#C72C41", 
    "#A9A9A9", 
    "#C4A664", 
    "#6A5ACD", 
    "#40E0D0", 
    "#CC4E3C", 
    "#87CEEB", 
    "#D8BFD8", 
    "#000000", 
    "#8B0000", 
    "#D3D3D3", 
    "#008B8B", 
    "#DC143C", 
    "#BEBEBE", 
    "#4682B4", 
    "#FFFFFF"  
  ];

  starElements.forEach((star, index) => {
    star.style.backgroundColor = colors[index % colors.length];
    stars.push(star);
  });
}

onMounted(() => {
  initStars();

  window.addEventListener("mousemove", (e) => {
    coords.x = e.clientX;
    coords.y = e.clientY;
  });

  function animateStars() {
    let x = coords.x;
    let y = coords.y;

    stars.forEach((star, index) => {
      setTimeout(() => {
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;

        const scale = (stars.length - index) / stars.length;
        star.style.transform = `scale(${scale})`;

        if (index > 0) {
          const prevStar = stars[index - 1];
          x += (prevStar.offsetLeft - x) * 0.3;
          y += (prevStar.offsetTop - y) * 0.3;
        }
      }, index * 15);
    });

    requestAnimationFrame(animateStars);
  }

  animateStars();
});
</script>

<style scoped>
.welcome-container {
  height: 100vh;
  background-image: url('assets/background9.jpeg');
  background-size: cover;
  background-position: center;
}

.star {
  width: 30px;
  height: 30px;
  background-color: transparent;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  clip-path: polygon(
    50% 0%, 
    61% 35%, 
    98% 35%, 
    68% 57%, 
    79% 91%, 
    50% 70%, 
    21% 91%, 
    32% 57%, 
    2% 35%, 
    39% 35%
  );
  transition: transform 0.15s, background-color 0.5s;
}
</style>
