import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/LandingView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterView.vue')
  },
  {
    path: '/jadwal',
    name: 'Jadwal',
    component: () => import('../views/JadwalView.vue')
  },
  {
    path: '/panduan',
    name: 'Panduan',
    component: () => import('../views/PanduanView.vue')
  },
  {
    path: '/pilah',
    name: 'Pilah',
    component: () => import('../views/PilahView.vue')
  },
  {
    path: '/lokasi',
    name: 'Lokasi',
    component: () => import('../views/LokasiView.vue')
  },
  {
    path: '/pilah-ai',
    name: 'PilahAI',
    component: () => import('../views/PilahAiView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard: Hanya warga yang sudah login yang dapat mengakses PilahAI
router.beforeEach((to, from, next) => {
  const hasUser = !!localStorage.getItem('pilahki_user')
  if (to.meta.requiresAuth && !hasUser) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
