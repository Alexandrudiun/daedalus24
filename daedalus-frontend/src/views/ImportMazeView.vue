<template>
    <div class="play-container">
      <div class="play-content">
        <h1 class="play-title">Import a Maze</h1>
        
        <!-- Display each maze in a maze card -->
        <div 
          class="maze-card" 
          v-for="maze in mazes" 
          :key="maze._id.$oid"
        >
          <h2>Maze Preview</h2>
          <p><strong>Starting Point:</strong> ({{ maze.startx.$numberInt }}, {{ maze.starty.$numberInt }})</p>
          <p><strong>Ending Point:</strong> ({{ maze.endx.$numberInt }}, {{ maze.endy.$numberInt }})</p>
          <p><strong>Size:</strong> {{ maze.sizex.$numberInt }} x {{ maze.sizey.$numberInt }}</p>
          <p><strong>Wall Density:</strong> {{ calculateWallDensity(maze) }}%</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MazeImport',
    data() {
      return {
        mazes: [], // Array to hold maze data from the database
      };
    },
    methods: {
      // Fetch maze data from the database on component mount
      fetchMazes() {
        fetch('https://dedalus24bk.onrender.com/getall')
          .then(response => response.json())
          .then(data => {
            this.mazes = data; // Populate mazes array with fetched data
          })
          .catch(error => console.error('Error fetching mazes:', error));
      },
  
      // Calculate wall density based on wall array length
      calculateWallDensity(maze) {
        const width = Number(maze.sizex.$numberInt);
        const height = Number(maze.sizey.$numberInt);
        const wallCount = JSON.parse(maze.wallarray).length;
        const totalCells = width * height;
        return ((wallCount / totalCells) * 100).toFixed(2);
      },
    },
    created() {
      this.fetchMazes(); // Fetch mazes when component is created
    },
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
    max-height: 80vh;
    overflow-y: auto; /* Enables vertical scroll */
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