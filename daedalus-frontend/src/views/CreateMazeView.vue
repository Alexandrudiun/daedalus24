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
          <button type="button" @click="importMaze" class="import-button">Import</button>
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
      errorCode: null, // Initialize error code
    };
  },
  methods: {
    handleSubmit() {
      const width = Number(this.mazeWidth);
      const height = Number(this.mazeHeight);
      const startX = Number(this.startX);
      const startY = Number(this.startY);
      const endX = Number(this.endX);
      const endY = Number(this.endY);

      // Validations
      if (width <= 16 || height <= 16) {
        this.errorCode = 100; // Error code for invalid dimensions
        this.showError('Dimensiunea labirintului trebuie sa fie mai mare de 16x16.');
        return;
      }
      if (startX < 0 || startY < 0 || startX >= width || startY >= height) {
        this.errorCode = 101; // Error code for invalid starting point
        this.showError('Punctul de start trebuie sa fie in interiorul labirintului.');
        return;
      }
      if (endX < 0 || endY < 0 || endX >= width || endY >= height) {
        this.errorCode = 102; // Error code for invalid ending point
        this.showError('Punctul de final trebuie sa fie in interiorul labirintului.');
        return;
      }

      if (endX === endY && startX === startY) {
        this.errorCode = 103; // Error code for identical start and end points
        this.showError('Putintele de start si final nu pot fi aceleasi.');
        return;
      }

      if (
        startX !== 0 && startX !== width - 1 &&
        startY !== 0 && startY !== height - 1
      ) {
        this.errorCode = 104; // Error code for invalid start point position
        this.showError('Punctul de start trebuie sa fie pe marginea labirintului.');
        return;
      }

      if (
        endX !== 0 && endX !== width - 1 &&
        endY !== 0 && endY !== height - 1
      ) {
        this.errorCode = 105; // Error code for invalid end point position
        this.showError('Punctul de final trebuie sa fie pe marginea labirintului.');
        return;
      }

      // Ensure start and end points are not adjacent
      if (this.areAdjacent(startX, startY, endX, endY)) {
        this.errorCode = 106; // Error code for adjacent points
        this.showError('Punctul de start si punctul de final nu pot fi adiacente.');
        return;
      }

      // Create the object to send
      const mazeData = {
        _id: { "$oid": "671b783f2e1f63735acf3cea" }, // Replace with a generated ID if needed
        startx: { "$numberInt": startX },
        starty: { "$numberInt": startY },
        sizex: { "$numberInt": width },
        sizey: { "$numberInt": height },
        endx: { "$numberInt": endX },
        endy: { "$numberInt": endY },
        wallarray: `[[1, 2], [3, 4], [5, 6]]`, // Modify this as per your requirements
        __v: { "$numberInt": "0" },
      };

      // Send the data to the server
      fetch('https://dedalus24bk.onrender.com/register', {
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
        
        // Store the returned ID in local storage
        if (data && data._id) {
          localStorage.setItem('mazeId', data._id['$oid']);
        }

        alert('Labirintul a fost creat cu succes!');
      })
      .catch((error) => {
        console.error('Error:', error);
        this.errorCode = 200; // General error code for network/server issues
        this.showError('A apărut o eroare la crearea labirintului: ' + error.message);
      });
    },
    areAdjacent(x1, y1, x2, y2) {
      return (
        (Math.abs(x1 - x2) === 1 && y1 === y2) || // adiacenta orizontala
        (Math.abs(y1 - y2) === 1 && x1 === x2)    // adiacenta verticala
      );
    },
    showError(message) {
      alert(message); // You can customize this to show errors in your UI
    },
    importMaze() {
      console.log('Importing maze...');
    },
  },
};
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
