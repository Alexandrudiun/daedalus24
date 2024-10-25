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
          <label for="mazeHeight">Maze Height:</label>
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
<script>
export default {
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
    };
  },
  methods: {
    generateWallArray(width, height, density) {
      // Validăm și ajustăm densitatea la maxim 40%
      const maxDensity = 40;
      const validDensity = Math.min(Math.max(0, density), maxDensity);
      
      // Calculăm numărul EXACT de celule care reprezintă procentajul dorit
      const totalCells = width * height;
      const maxWalls = Math.floor(totalCells * 0.4); // 40% din total
      const requestedWalls = Math.floor(totalCells * (validDensity / 100));
      
      // Ne asigurăm că nu depășim 40% din celule
      const numberOfWalls = Math.min(requestedWalls, maxWalls);
      
      console.log(`Total cells: ${totalCells}`);
      console.log(`Requested density: ${validDensity}%`);
      console.log(`Maximum allowed walls (40%): ${maxWalls}`);
      console.log(`Walls to generate: ${numberOfWalls}`);

      // Creăm un array cu toate pozițiile posibile, exclusiv start și sfârșit
      let allPositions = [];
      for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
          // Excludem pozițiile de start și sfârșit
          if(!(x === this.startX && y === this.startY) && 
             !(x === this.endX && y === this.endY)) {
            allPositions.push([x, y]);
          }
        }
      }

      // Amestecăm array-ul pentru a selecta aleatoriu pozițiile
      for (let i = allPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
      }

      // Luăm exact numărul de poziții de care avem nevoie
      const walls = allPositions.slice(0, numberOfWalls);
      
      // Verificăm procentajul final
      const actualPercentage = (walls.length / totalCells * 100).toFixed(2);
      console.log(`Generated ${walls.length} walls (${actualPercentage}% of total cells)`);
      
      return JSON.stringify(walls);
    },
    
    handleSubmit() {
      const width = Number(this.mazeWidth);
      const height = Number(this.mazeHeight);
      const startX = Number(this.startX);
      const startY = Number(this.startY);
      const endX = Number(this.endX);
      const endY = Number(this.endY);

      // Validări
      if (this.areAdjacent(startX, startY, endX, endY)) {
        this.errorCode = 106;
        this.showError('Punctul de start si punctul de final nu pot fi adiacente.');
        return;
      }
      
      if (this.wallDensity > 40) {
        this.errorCode = 107;
        this.showError('Densitatea pereților nu poate depăși 40% din totalul celulelor');
        return;
      }

      // Setăm valorile pentru generarea pereților
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;

      // Generăm array-ul de pereți
      const wallarray = this.generateWallArray(width, height, this.wallDensity);

      const mazeData = {
        startx: startX,
        starty: startY,
        sizex: width,
        sizey: height,
        endx: endX,
        endy: endY,
        wallarray: wallarray,
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
        console.log('Success:', data);
        
        if (data && data.id) {
          localStorage.setItem('mazeId', data.id);
          console.log('Maze ID saved to local storage:', data.id);
        }

        alert('Labirintul a fost creat cu succes!');
      })
      .catch((error) => {
        console.error('Error:', error);
        this.errorCode = 200;
        this.showError('A apărut o eroare la crearea labirintului: ' + error.message);
      });
    },
    
    areAdjacent(x1, y1, x2, y2) {
      return (
        (Math.abs(x1 - x2) === 1 && y1 === y2) ||
        (Math.abs(y1 - y2) === 1 && x1 === x2)
      );
    },
    
    showError(message) {
      alert(message);
    },
    
    importMaze() {
      console.log('Importing maze...');
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
