import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import JadwalView from '../views/JadwalView.vue'
import PanduanView from '../views/PanduanView.vue'
import PilahView from '../views/PilahView.vue'
import LokasiView from '../views/LokasiView.vue'
import PilahAiView from '../views/PilahAiView.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingView
  },
  {
    path: '/jadwal',
    name: 'Jadwal',
    component: JadwalView
  },
  {
    path: '/panduan',
    name: 'Panduan',
    component: PanduanView
  },
  {
    path: '/pilah',
    name: 'Pilah',
    component: PilahView
  },
  {
    path: '/lokasi',
    name: 'Lokasi',
    component: LokasiView
  },
  {
    path: '/pilah-ai',
    name: 'PilahAI',
    component: PilahAiView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
