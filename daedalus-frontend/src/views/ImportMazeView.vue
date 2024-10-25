<template>
    <div class="play-container">
        <div class="play-content">
            <h1 class="play-title">Available Mazes</h1>

            <div class="grid">
                <div v-for="maze in mazes" :key="maze._id" class="maze-card">
                    <div class="border-b border-gray-100 p-6">
                    <h2 class="text-red-800 font-bold" style="color: #8B0000 !important; font-weight: bold;">
                    Maze {{ maze._id.slice(-12) }}
                </h2>
                </div>
                    <div class="p-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <p>
                                    <strong>Start Position:</strong>
                                    ({{ maze.startx }}, {{ maze.starty }})
                                </p>
                                <p>
                                    <strong>End Position:</strong>
                                    ({{ maze.endx }}, {{ maze.endy }})
                                </p>
                            </div>

                            <div class="space-y-1">
                                <p>
                                    <strong>Size:</strong>
                                    {{ maze.sizex }} x {{ maze.sizey }}
                                </p>
                                <p>
                                    <strong>Wall Density:</strong>
                                    {{ calculateWallDensity(maze) }}%
                                </p>
                            </div>
                        </div>

                        <button @click="playMaze(maze._id)"
                            class="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
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
            mazes: [],
        };
    },

    methods: {
        calculateWallDensity(maze) {
            const walls = JSON.parse(maze.wallarray).length;
            const totalCells = maze.sizex * maze.sizey;
            return ((walls / totalCells) * 100).toFixed(2);
        },

        playMaze(mazeId) {
            localStorage.clear();
            localStorage.setItem('mazeId', mazeId);
            this.$router.push('/play-maze');
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
    max-height: 95vh;
    overflow-y: auto;
}

.play-content {
    scrollbar-width: thin;
    scrollbar-color: #DAA520 #f0f0f0;
}

.play-title {
    font-family: "Jacquard 12", system-ui;
    font-size: 2.5em;
    color: #1C1C1C;
    text-align: center;
    margin-bottom: 20px;
}

.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}

.maze-card {
    background-image: url('../assets/maze_card.jpeg');
    background-size: contain;
    background-color: rgba(255, 255, 255, 0.8);
    background-blend-mode: overlay;
    backdrop-filter: blur(8px);
    padding: 20px;
    border: 1px solid #DAA520;
    border-radius: 12px;
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