<template>
    <div class="play-container">
      <div class="play-content">
        <h1 class="play-title">Import one maze</h1>
        
        <!-- Example of Maze Card -->
        <div class="maze-card">
          <h2>Maze Preview</h2>
          <p><strong>Starting Point:</strong> ({{ startX }}, {{ startY }})</p>
          <p><strong>Ending Point:</strong> ({{ endX }}, {{ endY }})</p>
          <p><strong>Size:</strong> {{ mazeWidth }} x {{ mazeHeight }}</p>
          <p><strong>Wall Density:</strong> {{ wallDensity }}%</p>
        </div>
        <!-- Adăugăm câteva exemple de maze cards -->
        <div class="maze-card" v-for="index in 5" :key="index">
          <h2>Maze Preview {{ index }}</h2>
          <p><strong>Starting Point:</strong> ({{ startX }}, {{ startY }})</p>
          <p><strong>Ending Point:</strong> ({{ endX }}, {{ endY }})</p>
          <p><strong>Size:</strong> {{ mazeWidth }} x {{ mazeHeight }}</p>
          <p><strong>Wall Density:</strong> {{ wallDensity }}%</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        startX: 0,
        startY: 0,
        endX: 10,
        endY: 10,
        mazeWidth: 20,
        mazeHeight: 20,
        wallDensity: 30
      };
    }
  };
  </script>
  
  <style scoped>
  .play-container {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    height: 100vh;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .play-content {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 40px;
    border: 2px solid #DAA520;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 600px;
    max-height: 80vh; /* înălțime maximă pentru a activa scroll-ul */
    overflow-y: auto; /* scroll vertical */
  }
  
  .play-title {
    font-family: "Jacquard 12", system-ui;
    font-size: 2.5em;
    color: #1C1C1C;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .maze-card {
    background-color: #F5F5F5;
    padding: 20px;
    border: 1px solid #DAA520;
    border-radius: 12px;
    margin-top: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .maze-card h2 {
    font-size: 1.5em;
    color: #DAA520;
    margin-bottom: 10px;
  }
  
  .maze-card p {
    font-size: 1.1em;
    color: #333333;
    margin: 5px 0;
  }
  </style>
  