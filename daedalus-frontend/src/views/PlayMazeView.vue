<template>
    <div class="maze-container" v-if="maze.length > 0">
      <div
        class="maze-grid"
        :style="{ gridTemplateColumns: `repeat(${maze[0].length}, ${cellSize}px)` }"
      >
        <div
          v-for="(row, rowIndex) in maze"
          :key="rowIndex"
          class="maze-row"
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
        const mazeId = localStorage.getItem("mazeId");
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
        const walls = JSON.parse(data.wallarray);

        // Extrage dimensiunile labirintului și convertește la numere
        const sizeY = parseInt(data.sizey?.$numberInt ?? data.sizey, 10);
        const sizeX = parseInt(data.sizex?.$numberInt ?? data.sizex, 10);
        
        // Verifică dacă dimensiunile sunt valide
        if (isNaN(sizeX) || isNaN(sizeY) || sizeX <= 0 || sizeY <= 0) {
            console.error("Invalid maze dimensions:", sizeX, sizeY);
            return;
        }

        // Initializează matricea
        this.maze = Array.from({ length: sizeY }, () => Array(sizeX).fill(0));

        // Setează pozițiile de start și de final după verificarea valorilor numerice
        this.startX = parseInt(data.startx?.$numberInt ?? data.startx, 10);
        this.startY = parseInt(data.starty?.$numberInt ?? data.starty, 10);
        this.endX = parseInt(data.endx?.$numberInt ?? data.endx, 10);
        this.endY = parseInt(data.endy?.$numberInt ?? data.endy, 10);

        // Populează pereții în matrice
        walls.forEach(([y, x]) => {
            if (y < sizeY && x < sizeX) {
            this.maze[y][x] = 1; // 1 pentru pereți
            }
        });

        // Ajustează dimensiunea celulei
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.maze-grid {
  display: grid;
  background-color: rgba(238, 238, 238, 0.5);
  backdrop-filter: blur(8px);
  gap: 0px;
  padding: 10px;
  border-radius: 12px;
}

.maze-cell {
  border: 2px transparent #eee;
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
  