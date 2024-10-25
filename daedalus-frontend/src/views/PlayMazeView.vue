<template>
    <div class="maze-container" v-if="maze.length > 0">
      <div
        v-for="(row, rowIndex) in maze"
        :key="rowIndex"
        class="maze-row"
        :style="{ height: cellSize + 'px' }"
      >
        <div
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          :class="getCellClass(rowIndex, cellIndex)"
          class="maze-cell"
          :style="{ width: cellSize + 'px', height: cellSize + 'px' }"
        ></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        maze: [],
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        cellSize: 20, // dimensiunea fiecărei celule
      };
    },
    methods: {
      async fetchMazeData() {
        const mazeId = localStorage.getItem("mazeid");
        if (!mazeId) {
          console.error("Maze ID not found in local storage.");
          return;
        }
        try {
          const response = await fetch(`https://dedalus24bk.onrender.com/get/${mazeId}`);
          if (!response.ok) throw new Error("Failed to fetch maze data");
          
          const data = await response.json();
          this.setupMaze(data);
        } catch (error) {
          console.error("Error fetching maze data:", error);
        }
      },
      setupMaze(data) {
        // Conversia pereților din string în matrice
        const walls = JSON.parse(data.wallarray);
        
        // Inițializarea matricei
        const sizeY = parseInt(data.sizey.$numberInt);
        const sizeX = parseInt(data.sizex.$numberInt);
        this.maze = Array(sizeY).fill().map(() => Array(sizeX).fill(0));
  
        // Setează pozițiile de start și de final
        this.startX = parseInt(data.startx.$numberInt);
        this.startY = parseInt(data.starty.$numberInt);
        this.endX = parseInt(data.endx.$numberInt);
        this.endY = parseInt(data.endy.$numberInt);
  
        // Adaugă pereții în matrice
        walls.forEach(([y, x]) => {
          if (y < sizeY && x < sizeX) {
            this.maze[y][x] = 1; // 1 pentru pereți
          }
        });
  
        // Ajustează dimensiunea celulei pentru a se potrivi pe ecran
        const displayWidth = Math.min(window.innerWidth - 40, sizeX * this.cellSize);
        this.cellSize = Math.floor(displayWidth / sizeX);
      },
      getCellClass(rowIndex, cellIndex) {
        if (rowIndex === this.startY && cellIndex === this.startX) {
          return "start";
        } else if (rowIndex === this.endY && cellIndex === this.endX) {
          return "end";
        } else if (this.maze[rowIndex][cellIndex] === 1) {
          return "wall";
        }
        return "";
      },
    },
    mounted() {
      this.fetchMazeData();
    },
  };
  </script>
  
  <style scoped>
  .maze-container {
    margin: 20px;
    display: inline-block;
  }
  .maze-row {
    display: flex;
  }
  .maze-cell {
    border: 1px solid #eee;
  }
  .wall {
    background-color: #333;
  }
  .start {
    background-color: #4CAF50;
  }
  .end {
    background-color: #f44336;
  }
  </style>
  