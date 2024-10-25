import { createRouter, createWebHistory } from 'vue-router'
import CreateMazeView from '../views/CreateMazeView.vue'
import HomeView from '../views/HomeView.vue'
import ImportMazeView from '../views/ImportMazeView.vue'
import PlayMazeView from '../views/PlayMazeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/create-maze',
      name: 'create-maze',
      component: CreateMazeView
    },
    {
      path: '/import-maze',
      name: 'import-maze',
      component: ImportMazeView
    },
    {
      path: '/play-maze',
      name: 'play-maze',
      component: PlayMazeView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
  ]
})

export default router
