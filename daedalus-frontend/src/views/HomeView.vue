<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <h1 class="welcome-text">Welcome to Daedalus 24</h1>
      <RouterLink to="/create-maze">
        <button class="play-button">Play</button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.welcome-container {
  display: flex;
  align-items: center;
  justify-content: center; 
  height: 100vh; 
  margin: 0;
  padding: 0;
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

.welcome-text {
  font-family: "Jacquard 12", system-ui;
  font-size: 5.5em;
  color: #1C1C1C;
  margin-bottom: 20px;

  opacity: 0;
  animation: fadeIn 1s ease-in forwards;
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

.play-button:hover {
  background-color: #B8860B;
}
</style>
