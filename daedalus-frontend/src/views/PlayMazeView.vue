<template>
    <div class="maze-container" v-if="maze.length > 0">
      <div class="maze-content">
        <div
          class="maze-grid"
          :style="{
            gridTemplateRows: `repeat(${maze[0].length}, ${cellSize}px)`,
            gridTemplateColumns: `repeat(${maze.length}, ${cellSize}px)`
          }"
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
          <button @click="moveToEndpoint" class="escape-button">Escape</button>
          <p class="step-count">Steps: {{ stepCount }}</p>
        </div>
      </div>
  
      <div v-if="showCompletionPopup" class="popup-overlay" @click.self="closePopup">
        <div class="popup-content">
            <h2 class="congratulations-text">Congratulations!</h2>
            <button @click="closePopup" class="close-button">Close</button>
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
        showCompletionPopup: false, // pentru popup
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
        const sizeY = parseInt(data.sizey?.$numberInt ?? data.sizey, 10);
        const sizeX = parseInt(data.sizex?.$numberInt ?? data.sizex, 10);
  
        if (isNaN(sizeX) || isNaN(sizeY) || sizeX <= 0 || sizeY <= 0) {
            console.error("Invalid maze dimensions:", sizeX, sizeY);
            return;
        }
  
        this.maze = Array.from({ length: sizeY }, () => Array(sizeX).fill(0));
  
        this.startX = parseInt(data.startx?.$numberInt ?? data.startx, 10);
        this.startY = parseInt(data.starty?.$numberInt ?? data.starty, 10);
        this.endX = parseInt(data.endx?.$numberInt ?? data.endx, 10);
        this.endY = parseInt(data.endy?.$numberInt ?? data.endy, 10);
  
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
      async showPath() {
        this.path = this.findPath();
        this.stepCount = this.path.length;
        await this.updateMazePath();
      },
      closePopup() {
  this.showCompletionPopup = false; // inchide popup-ul
},
      async updateMazePath() {
        const mazePath = localStorage.getItem("mazePath");
        const mazeId = localStorage.getItem("mazeId");
        if (!mazePath || !mazeId) {
          console.error("Path or Maze ID not found in local storage.");
          return;
        }
  
        try {
          const response = await fetch(`https://dedalus24bk.onrender.com/update/${mazeId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ path: mazePath })
          });
  
          if (!response.ok) throw new Error("Failed to update path on the server");
          console.log("Maze path successfully updated.");
        } catch (error) {
          console.error("Error updating maze path:", error);
        }
      },
      async moveToEndpoint() {
  if (this.path.length === 0) {
    alert("No path found! Please calculate the path first.");
    return;
  }

  let currentStep = 0;

  const movePlayer = () => {
    if (currentStep < this.path.length) {
      const [y, x] = this.path[currentStep];
      this.startX = x;
      this.startY = y;
      this.$forceUpdate();

      if (this.startX === this.endX && this.startY === this.endY) {
        this.showCompletionPopup = true;
        clearInterval(animationInterval);
      }
      currentStep++;
    } else {
      clearInterval(animationInterval);
    }
  };

  const animationInterval = setInterval(movePlayer, 100);
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
            path.reverse();
            localStorage.setItem('mazePath', JSON.stringify(path));
            return path;
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
  padding: 10px; /* Add padding for mobile */
}
  
.maze-content {
  display: flex;
  flex-direction: column; /* Stack maze and controls vertically */
  align-items: center;
  width: 100%; /* Take full width on mobile */
}
  
.maze-grid {
  display: grid;
  background-color: rgba(238, 238, 238, 0.5);
  backdrop-filter: blur(6px);
  gap: 0;
  padding: 20px;
  border-radius: 12px;
  width: 100%; /* Make grid take full width */
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
    background-color: rgba(238, 238, 238, 0.5);
    backdrop-filter: blur(6px);
    margin-left: 50px;
    border-radius: 12px;
    padding: 35px;
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
    font-family: "Jacquard 12", system-ui;
    margin-top: 10px;
    font-size: 2.2em;
  }
    
  .escape-button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 10px; 
  }
    
  .escape-button:hover {
    background-color: #e53935;
  }

  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.show-path-button,
.escape-button {
  width: 100%; /* Make buttons full width on mobile */
  padding: 12px; /* Increase padding */
  margin-top: 10px; /* Add margin for spacing */
}

.popup-content {
    background-image: url('../assets/win2.jpeg');
    background-size: cover;
    background-position: center;
    padding: 30px;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;
    text-align: center;
    color: black;
    
    background-color: rgba(255, 255, 255, 0.8);
}

.congratulations-text {
    font-family: "Jacquard 12", system-ui;
    font-size: 3em;
    margin: 0;
}

.close-button {
    background: #DAA520;
    color: white;
    border: none;
    padding: 8px 16px;
    margin-top: 15px;
    border-radius: 4px;
    cursor: pointer;
}
  
.close-button:hover {
    background-color: #B8860B;
}

/* Media queries for mobile screens */
@media only screen and (max-width: 768px) {
  .step-count {
    font-size: 1.5em; /* Reduce font size for mobile */
  }

  .popup-content {
    padding: 20px; /* Reduce padding in popup */
  }

  .congratulations-text {
    font-size: 2em; /* Adjust text size */
  }

  .close-button {
    width: 100%; /* Make close button full width */
  }
}

/* Additional media query for larger screens */
@media only screen and (min-width: 769px) {
  .controls {
    margin-left: 50px;
  }
}

</style>
  