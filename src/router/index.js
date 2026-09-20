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
    component: () => import('../views/auth/LoginView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/jadwal',
    name: 'Jadwal',
    component: () => import('../views/JadwalView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/panduan',
    name: 'Panduan',
    component: () => import('../views/PanduanView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pilah',
    name: 'Pilah',
    component: () => import('../views/PilahView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/lokasi',
    name: 'Lokasi',
    component: () => import('../views/LokasiView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pilah-ai',
    name: 'PilahAI',
    component: () => import('../views/PilahAiView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  let hasUser = false
  try {
    const raw = localStorage.getItem('pilahki_user')
    if (raw) {
      const parsed = JSON.parse(raw)
      hasUser = !!(parsed && parsed.email)
    }
  } catch (e) {
    hasUser = false
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some(record => record.meta.guestOnly)

  if (requiresAuth && !hasUser) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (isGuestOnly && hasUser) {
    next({ path: '/pilah' })
  } else {
    next()
  }
})

export default router
