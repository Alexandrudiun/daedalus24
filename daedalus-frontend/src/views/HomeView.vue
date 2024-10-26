<template>
  <div class="app-container">
    <div class="transition-walls" :class="{ 'transition-active': isTransitioning }">
      <div class="wall wall-left"></div>
      <div class="wall wall-right"></div>
    </div>
    <div class="welcome-container">
      <div class="welcome-content">
        <h1 class="welcome-text initial-fade" :class="{ 'fade-out': isTransitioning, 'fade-in': !isTransitioning }">
          Welcome to Daedalus 24
        </h1>
        <button @click="handleTransition" class="play-button initial-fade"
                :class="{ 'fade-out': isTransitioning, 'fade-in': !isTransitioning }">
          Play
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isTransitioning = ref(false);

const handleTransition = async () => {
  isTransitioning.value = true;

  await new Promise(resolve => setTimeout(resolve, 3000));

  await router.push('/create-maze');
  
  await new Promise(resolve => setTimeout(resolve, 10500));
  
  isTransitioning.value = false;
};
</script>

<style scoped>
.welcome-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  padding: 0;
  position: relative;
}

.welcome-content {
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 50px;
  border: 2px solid #DAA520;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 600px;
}

.initial-fade {
  opacity: 0;
  animation: initialFadeIn 1s ease-in-out forwards;
}

@keyframes initialFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-out {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.fade-in {
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
}

.transition-walls {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.wall {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
}

.wall-left {
  background-image: url('../assets/left-entrance.webp');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.8);
  transition: transform 3s ease-in-out;
  left: 0;
  transform: translateX(-100%);
}

.wall-right {
  background-image: url('../assets/right-entrance.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.8);
  transition: transform 3s ease-in-out;
  right: 0;
  transform: translateX(100%);
}

.transition-active .wall-left {
  transform: translateX(0);
}

.transition-active .wall-right {
  transform: translateX(0);
}

.welcome-text {
  font-family: "Jacquard 12", system-ui;
  font-size: 5.5em;
  color: #1C1C1C;
  margin-bottom: 20px;
}

.play-button {
  font-family: "Jacquard 12", system-ui;
  font-size: 3.2em;
  color: #ffffff;
  background-color: #DAA520;
  padding: 10px 30px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

@media (max-width: 768px) {
  .welcome-text {
    font-size: 3em;
  }
  
  .play-button {
    font-size: 2em;
    padding: 8px 20px;
  }
  
  .welcome-content {
    padding: 30px;
    width: 90%;
  }
}

@media (max-width: 480px) {
  .welcome-text {
    font-size: 2.5em;
  }
  
  .play-button {
    font-size: 1.8em;
    padding: 6px 16px;
  }
}
</style>