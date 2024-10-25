<template>
  <div class="play-container">
    <div class="play-content">
      <h1 class="play-title">Create Your Maze</h1>
      <form @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="mazeWidth">Maze Width:</label>
          <input
            type="number"
            id="mazeWidth"
            v-model.number="mazeWidth"
            placeholder="Width"
            required
          />
        </div>
        <div class="input-group">
          <label for="mazeHeight">Maze Heigth:</label>
          <input
            type="number"
            id="mazeHeight"
            v-model.number="mazeHeight"
            placeholder="Height"
            required
          />
        </div>
        <div class="input-group">
          <label for="startX">Starting Point X:</label>
          <input
            type="number"
            id="startX"
            v-model.number="startX"
            placeholder="X"
            required
          />
        </div>
        <div class="input-group">
          <label for="startY">Starting Point Y:</label>
          <input
            type="number"
            id="startY"
            v-model.number="startY"
            placeholder="Y"
            required
          />
        </div>
        <div class="input-group">
          <label for="endX">Ending Point X:</label>
          <input
            type="number"
            id="endX"
            v-model.number="endX"
            placeholder="X"
            required
          />
        </div>
        <div class="input-group">
          <label for="endY">Ending Point Y:</label>
          <input
            type="number"
            id="endY"
            v-model.number="endY"
            placeholder="Y"
            required
          />
        </div>
        <div class="input-group">
          <label for="wallDensity">Wall Density:</label>
          <input
            type="range"
            id="wallDensity"
            v-model="wallDensity"
            min="10"
            max="40"
          />
          <span>{{ wallDensity }}%</span>
        </div>
        <div class="button-group">
            <button type="submit" class="create-button">Create</button>
          <RouterLink to="/import-maze">
            <button type="button" @click="importMaze" class="import-button">Import</button>
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
<script>export default {
  name: 'CreateMaze',
  data() {
    return {
      mazeWidth: '',
      mazeHeight: '',
      startX: '',
      startY: '',
      endX: '',
      endY: '',
      wallDensity: 25,
      errorCode: null,
      cellSize: 20,
    };
  },
  computed: {
    maxDimensions() {
      const maxWidth = Math.floor((window.innerWidth - 80) / this.cellSize);
      const maxHeight = Math.floor((window.innerHeight - 80) / this.cellSize);
      
      return {
        width: maxWidth,
        height: maxHeight
      };
    }
  },
  mounted() {
    this.setInitialDimensions();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    setInitialDimensions() {
      this.mazeWidth = this.maxDimensions.width;
      this.mazeHeight = this.maxDimensions.height;
      
      this.startX = 0;
      this.startY = 0;
      this.endX = this.mazeWidth - 1;
      this.endY = this.mazeHeight - 1;
    },
    
    handleResize() {
      const newDimensions = this.maxDimensions;
      
      if (newDimensions.width < this.mazeWidth) {
        this.mazeWidth = newDimensions.width;
        if (this.endX >= this.mazeWidth) {
          this.endX = this.mazeWidth - 1;
        }
      }
      
      if (newDimensions.height < this.mazeHeight) {
        this.mazeHeight = newDimensions.height;
        if (this.endY >= this.mazeHeight) {
          this.endY = this.mazeHeight - 1;
        }
      }
    },

    generateWallArray(width, height, density) {
      const maxDensity = 40;
      const validDensity = Math.min(Math.max(0, density), maxDensity);
      
      const totalCells = width * height;
      const maxWalls = Math.floor(totalCells * 0.4);
      const requestedWalls = Math.floor(totalCells * (validDensity / 100));
      const numberOfWalls = Math.min(requestedWalls, maxWalls);
      
      // Array pentru a ține evidența pozițiilor ocupate
      const occupiedPositions = new Set();
      occupiedPositions.add(`${this.startX},${this.startY}`);
      occupiedPositions.add(`${this.endX},${this.endY}`);

      // Array pentru stocarea coordonatelor pereților
      const walls = [];
      let attempts = 0;
      const maxAttempts = totalCells * 2;

      while (walls.length < numberOfWalls && attempts < maxAttempts) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const posKey = `${x},${y}`;

        if (!occupiedPositions.has(posKey)) {
          // Verificăm să nu blocăm calea
          if (!this.wouldBlockPath(x, y, width, height, walls)) {
            walls.push([y, x]);  // Adăugăm [y, x] pentru a menține formatul corect
            occupiedPositions.add(posKey);
          }
        }
        attempts++;
      }

      // Convertim array-ul direct într-un string în formatul dorit
      const wallArrayString = JSON.stringify(walls);
      console.log("Generated wall array:", wallArrayString);
      return wallArrayString;
    },

    wouldBlockPath(wallX, wallY, width, height, currentWalls) {
      const grid = Array(height).fill().map(() => Array(width).fill(0));
      
      // Marcăm pereții existenți
      currentWalls.forEach(([y, x]) => {
        grid[y][x] = 1;
      });

      // Marcăm noul perete
      grid[wallY][wallX] = 1;

      const visited = new Set();
      const queue = [[this.startX, this.startY]];
      visited.add(`${this.startX},${this.startY}`);

      while (queue.length > 0) {
        const [x, y] = queue.shift();
        
        if (x === this.endX && y === this.endY) {
          return false; // Am găsit o cale
        }

        // Verificăm vecinii
        const neighbors = [
          [x + 1, y], [x - 1, y],
          [x, y + 1], [x, y - 1]
        ];

        for (const [nx, ny] of neighbors) {
          if (nx >= 0 && nx < width && 
              ny >= 0 && ny < height && 
              grid[ny][nx] === 0 && 
              !visited.has(`${nx},${ny}`)) {
            visited.add(`${nx},${ny}`);
            queue.push([nx, ny]);
          }
        }
      }

      return true; // Nu am găsit nicio cale
    },
    
    validateInput() {
      const width = Number(this.mazeWidth);
      const height = Number(this.mazeHeight);
      const startX = Number(this.startX);
      const startY = Number(this.startY);
      const endX = Number(this.endX);
      const endY = Number(this.endY);

      // if (width > this.maxDimensions.width || height > this.maxDimensions.height) {
      //   this.errorCode = 100;
      //   this.showError(`Dimensiunea maximă permisă este ${this.maxDimensions.width}x${this.maxDimensions.height}`);
      //   return false;
      // }

      if (!this.isValidPosition(startX, startY, width, height) ||
          !this.isValidPosition(endX, endY, width, height)) {
        this.errorCode = 101;
        this.showError('Punctele de start și sfârșit trebuie să fie în interiorul labirintului.');
        return false;
      }

      if (startX === endX && startY === endY) {
        this.errorCode = 102;
        this.showError('Punctele de start și sfârșit nu pot fi identice.');
        return false;
      }

      return true;
    },

    isValidPosition(x, y, width, height) {
      return x >= 0 && x < width && y >= 0 && y < height;
    },

    handleSubmit() {
      if (!this.validateInput()) {
        return;
      }

      const wallarray = this.generateWallArray(
        Number(this.mazeWidth),
        Number(this.mazeHeight),
        this.wallDensity
      );

      const mazeData = {
        startx: Number(this.startX),
        starty: Number(this.startY),
        sizex: Number(this.mazeWidth),
        sizey: Number(this.mazeHeight),
        endx: Number(this.endX),
        endy: Number(this.endY),
        wallarray: wallarray  // Acum este direct un string
      };

      fetch('https://dedalus24bk.onrender.com/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mazeData),
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
      })
      .then(data => {
        if (data && data.id) {
          localStorage.setItem('mazeId', data.id);
          this.$router.push('/play-maze');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        this.errorCode = 200;
        this.showError('Eroare la crearea labirintului: ' + error.message);
      });
    },

    showError(message) {
      alert(message);
    },
  },
};
// // Validations
// if (width <= 16  height <= 16) {
//         this.errorCode = 100; // Error code for invalid dimensions
//         this.showError('Dimensiunea labirintului trebuie sa fie mai mare de 16x16.');
//         return;
//       }
//       if (startX < 0  startY < 0  startX >= width  startY >= height) {
//         this.errorCode = 101; // Error code for invalid starting point
//         this.showError('Punctul de start trebuie sa fie in interiorul labirintului.');
//         return;
//       }
//       if (endX < 0  endY < 0  endX >= width || endY >= height) {
//         this.errorCode = 102; // Error code for invalid ending point
//         this.showError('Punctul de final trebuie sa fie in interiorul labirintului.');
//         return;
//       }

//       if (endX === startX && endY === startY) {
//         this.errorCode = 103; // Error code for identical start and end points
//         this.showError('Putintele de start si final nu pot fi aceleasi.');
//         return;
//       }

//       if (
//         startX !== 0 && startX !== width - 1 &&
//         startY !== 0 && startY !== height - 1
//       ) {
//         this.errorCode = 104; // Error code for invalid start point position
//         this.showError('Punctul de start trebuie sa fie pe marginea labirintului.');
//         return;
//       }

//       if (
//         endX !== 0 && endX !== width - 1 &&
//         endY !== 0 && endY !== height - 1
//       ) {
//         this.errorCode = 105; // Error code for invalid end point position
//         this.showError('Punctul de final trebuie sa fie pe marginea labirintului.');
//         return;
//       }

//       // Ensure start and end points are not adjacent
//       if (this.areAdjacent(startX, startY, endX, endY)) {
//         this.errorCode = 106; // Error code for adjacent points
//         this.showError('Punctul de start si punctul de final nu pot fi adiacente.');
//         return;
//       }

</script>

<style scoped>
.play-container {
  display: flex;
  align-items: center;
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
}

.play-title {
  font-family: "Jacquard 12", system-ui;
  font-size: 2.5em;
  color: #1C1C1C;
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

label {
  margin-right: 10px;
  font-weight: bold;
  width: 150px;
}

input[type="number"],
input[type="range"] {
  width: calc(100% - 160px);
  padding: 10px;
  border: 1px solid #DAA520;
  border-radius: 8px;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.create-button,
.import-button {
  font-family: "Jacquard 12", system-ui;
  font-size: 1.2em;
  color: #ffffff;
  background-color: #DAA520;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-button:hover,
.import-button:hover {
  background-color: #B8860B;
}
</style>
