<template>
    <div class="maze-container" v-if="maze.length > 0">
      <div class="maze-content">
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
        <div class="controls">
          <button @click="showPath" class="show-path-button">Show Path</button>
          <p class="step-count">Steps: {{ stepCount }}</p>
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
      cellSize: 20,
      stepCount: 0,
      path: [],
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
      // Parse dimensions, ensuring we handle both string and NumberInt formats
      const sizeY = parseInt(data.sizey?.$numberInt ?? data.sizey, 10);
      const sizeX = parseInt(data.sizex?.$numberInt ?? data.sizex, 10);

      if (isNaN(sizeX) || isNaN(sizeY) || sizeX <= 0 || sizeY <= 0) {
        console.error("Invalid maze dimensions:", sizeX, sizeY);
        return;
      }

      // Initialize empty maze
      this.maze = Array.from({ length: sizeY }, () => Array(sizeX).fill(0));

      // Set start and end positions
      this.startX = parseInt(data.startx?.$numberInt ?? data.startx, 10);
      this.startY = parseInt(data.starty?.$numberInt ?? data.starty, 10);
      this.endX = parseInt(data.endx?.$numberInt ?? data.endx, 10);
      this.endY = parseInt(data.endy?.$numberInt ?? data.endy, 10);

      // Parse wall array - handle it as a string that needs to be parsed
      let walls;
      if (typeof data.wallarray === 'string') {
        try {
          walls = JSON.parse(data.wallarray);
        } catch (e) {
          console.error("Error parsing wall array:", e);
          return;
        }
      } else {
        walls = data.wallarray;
      }

      // Place walls
      if (Array.isArray(walls)) {
        walls.forEach(wall => {
          if (Array.isArray(wall) && wall.length === 2) {
            const [y, x] = wall;
            if (y >= 0 && y < sizeY && x >= 0 && x < sizeX) {
              this.maze[y][x] = 1;
            }
          }
        });
      }

      // Adjust cell size based on window width
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
      } else if (this.path.some(pos => pos[0] === rowIndex && pos[1] === cellIndex)) {
        return "road";
      }
      return "";
    },
    showPath() {
      this.path = this.findPath();
      this.stepCount = this.path.length;
    },
    findPath() {
      const openSet = [{ x: this.startX, y: this.startY, g: 0, f: 0 }];
      const cameFrom = new Map();
      const gScores = Array.from({ length: this.maze.length }, () => 
        Array(this.maze[0].length).fill(Infinity)
      );
      gScores[this.startY][this.startX] = 0;

      const h = (x, y) => Math.abs(x - this.endX) + Math.abs(y - this.endY);
      
      while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift();
        const { x, y } = current;

        if (x === this.endX && y === this.endY) {
          let path = [[y, x]];
          let currentY = y;
          let currentX = x;

          while (cameFrom.has(`${currentY},${currentX}`)) {
            [currentY, currentX] = cameFrom.get(`${currentY},${currentX}`);
            path.push([currentY, currentX]);
          }
          return path.reverse();
        }

        const neighbors = [
          [y - 1, x], [y + 1, x], [y, x - 1], [y, x + 1]
        ];

        for (const [ny, nx] of neighbors) {
          if (ny < 0 || ny >= this.maze.length || nx < 0 || nx >= this.maze[0].length || 
              this.maze[ny][nx] === 1) continue;

          const tentativeGScore = gScores[y][x] + 1;
          if (tentativeGScore < gScores[ny][nx]) {
            cameFrom.set(`${ny},${nx}`, [y, x]);
            gScores[ny][nx] = tentativeGScore;
            openSet.push({ 
              x: nx, 
              y: ny, 
              g: tentativeGScore, 
              f: tentativeGScore + h(nx, ny) 
            });
          }
        }
      }
      return [];
    }
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

.maze-content {
  display: flex;
  align-items: center;
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
  background-image: url('../assets/basic_tile.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.road {
  background-image: url('../assets/road.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.wall {
  background-image: url('../assets/wall.jpeg');
  background-position: center;
  background-repeat: no-repeat;
}

.start {
  background-image: url('../assets/player2.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.end {
  background-image: url('../assets/gate.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 50px;
  background-color: rgba(238, 238, 238, 0.5);
  border-radius: 12px;
  padding: 35px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.show-path-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.show-path-button:hover {
  background-color: #45a049;
}

.step-count {
  margin-top: 10px;
  font-size: 1.2em;
}
</style>