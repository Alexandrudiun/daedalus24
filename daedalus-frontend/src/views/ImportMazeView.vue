<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">
        Available Mazes
      </h1>
      
      <div class="grid gap-6">
        <div 
          v-for="maze in mazes" 
          :key="maze._id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-amber-200"
        >
          <!-- Maze Header -->
          <div class="border-b border-gray-100 p-6">
            <h2 class="text-2xl font-semibold text-amber-600">
              Maze {{ maze._id.slice(-6) }}
            </h2>
          </div>
          
          <!-- Maze Content -->
          <div class="p-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <p class="text-gray-600">
                  <span class="font-medium">Start Position:</span>
                  ({{ maze.startx }}, {{ maze.starty }})
                </p>
                <p class="text-gray-600">
                  <span class="font-medium">End Position:</span>
                  ({{ maze.endx }}, {{ maze.endy }})
                </p>
              </div>
              
              <div class="space-y-2">
                <p class="text-gray-600">
                  <span class="font-medium">Size:</span>
                  {{ maze.sizex }} x {{ maze.sizey }}
                </p>
                <p class="text-gray-600">
                  <span class="font-medium">Wall Density:</span>
                  {{ calculateWallDensity(maze) }}%
                </p>
              </div>
            </div>
            
            <!-- Play Button -->
            <button 
              @click="playMaze(maze._id)"
              class="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
            >
              <!-- Link Icon -->
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
                />
              </svg>
              Play This Maze
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MazeDisplay',
  
  data() {
    return {
      mazes: [], // Will be populated by API call
    }
  },

  methods: {
    calculateWallDensity(maze) {
      const walls = JSON.parse(maze.wallarray).length;
      const totalCells = maze.sizex * maze.sizey;
      return ((walls / totalCells) * 100).toFixed(2);
    },

    playMaze(mazeId) {
      this.$router.push(`/play/${mazeId}`);
    },

    async fetchMazes() {
      try {
        const response = await fetch('https://dedalus24bk.onrender.com/getall');
        const data = await response.json();
        this.mazes = data;
      } catch (error) {
        console.error('Error fetching mazes:', error);
      }
    },
  },

  created() {
    this.fetchMazes();
  },
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

/* Ensure smooth transitions */
.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>