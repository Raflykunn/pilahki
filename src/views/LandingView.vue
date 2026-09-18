<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import AuthModal from '../components/AuthModal.vue'

const emit = defineEmits(['navigate', 'search-trash', 'open-ai'])

// Dapatkan router secara selamat jika vue-router dipasang
const instance = getCurrentInstance()
let router = null
if (instance?.appContext?.config?.globalProperties?.$router) {
  router = instance.appContext.config.globalProperties.$router
} else {
  try {
    router = useRouter()
  } catch {
    router = null
  }
}

// Pengesahan Pengguna (Supabase)
const { user, isAuthenticated, userEmail, initAuth, signOut } = useAuth()

// Pengurusan Dropdown Profil Pengguna
const userMenuRef = ref(null)
const isProfileDropdownOpen = ref(false)

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

const closeProfileDropdown = () => {
  isProfileDropdownOpen.value = false
}

const handleClickOutside = (e) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    isProfileDropdownOpen.value = false
  }
}

const handleLogout = async () => {
  closeProfileDropdown()
  isMobileMenuOpen.value = false
  await signOut()
}

const handleProfileClick = () => {
  closeProfileDropdown()
  isMobileMenuOpen.value = false
  navigateTo('/profil')
}

onMounted(() => {
  initAuth()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const searchQuery = ref('')
const isMobileMenuOpen = ref(false)

// Pengurusan Modal Log Masuk untuk Guest
const isAuthModalOpen = ref(false)
const modalTitle = ref('Masuk ke Pilahki')
const modalSubtitle = ref('Masuk untuk mengakses fitur lengkap pemilahan, fasilitas, dan jadwal angkut.')
const pendingAction = ref(null)

// Contoh sampah rumah tangga umum membingungkan warga
const quickExamples = [
  'Baterai Bekas',
  'Botol Minyak',
  'Kemasan Sachet',
  'Kulit Buah',
  'Lampu Neon'
]

// 4 Fitur utama sesuai PRD Seksyen 7
const features = [
  {
    id: 'pilah',
    title: 'Pilah Sampah',
    badge: 'Kategori & Solusi',
    desc: 'Cek apakah sampah masuk organik, anorganik, B3, atau residu serta cara penanganannya.',
    path: '/pilah',
    actionText: 'Cek Kategori'
  },
  {
    id: 'lokasi',
    title: 'Cari Lokasi',
    badge: 'Bank Sampah & TPS',
    desc: 'Temukan fasilitas penerima sampah terdekat, jam operasional, dan jenis yang diterima.',
    path: '/lokasi',
    actionText: 'Cari Fasilitas'
  },
  {
    id: 'jadwal',
    title: 'Jadwal Angkut',
    badge: 'Waktu Pengutipan',
    desc: 'Ketahui hari pengangkutan sampah di wilayah Anda agar tidak terlewat dan menumpuk.',
    path: '/jadwal',
    actionText: 'Lihat Jadwal'
  },
  {
    id: 'panduan',
    title: 'Panduan Praktis',
    badge: 'Edukasi Warga',
    desc: 'Tips ringkas memilah sampah rumah tangga dengan bahasa sederhana tanpa istilah rumit.',
    path: '/panduan',
    actionText: 'Baca Panduan'
  }
]

// Navigasi langsung
const navigateTo = (path, query = {}) => {
  isMobileMenuOpen.value = false
  emit('navigate', { path, query })
  if (router) {
    router.push({ path, query }).catch(() => {})
  }
}

// Kawalan keselamatan akses guest: Semak status log masuk sebelum membenarkan akses fitur lanjut
const executeWithAuth = (actionCallback, featureTitle = 'Fitur Pilahki') => {
  if (!isAuthenticated.value) {
    modalTitle.value = `Masuk untuk akses ${featureTitle}`
    modalSubtitle.value = 'Silakan masuk atau daftar menggunakan email dan kata sandi Anda untuk melanjutkan.'
    pendingAction.value = actionCallback
    isAuthModalOpen.value = true
    return
  }
  actionCallback()
}

// Navigasi ke fitur khusus dengan semakan auth
const handleFeatureClick = (feature) => {
  executeWithAuth(() => {
    navigateTo(feature.path)
  }, feature.title)
}

// Menangani carian dari hero bar dengan semakan auth
const handleSearch = (overrideQuery = null) => {
  if (overrideQuery !== null) {
    searchQuery.value = overrideQuery
  }
  const query = searchQuery.value.trim()
  if (!query) return

  executeWithAuth(() => {
    emit('search-trash', query)
    navigateTo('/pilah', { q: query })
  }, `Pilah Sampah "${query}"`)
}

// Membuka PilahAI dengan semakan auth
const handleOpenAI = () => {
  executeWithAuth(() => {
    emit('open-ai', { query: searchQuery.value.trim() })
    navigateTo('/pilah-ai', searchQuery.value.trim() ? { q: searchQuery.value.trim() } : {})
  }, 'PilahAI')
}

// Teruskan tindakan tertunda setelah berjaya log masuk
const handleAuthSuccess = () => {
  if (pendingAction.value) {
    const action = pendingAction.value
    pendingAction.value = null
    action()
  }
}

const openLoginModal = () => {
  modalTitle.value = 'Masuk ke Pilahki'
  modalSubtitle.value = 'Masuk untuk mengakses fitur lengkap pemilahan, fasilitas, dan jadwal angkut.'
  pendingAction.value = null
  isAuthModalOpen.value = true
}
</script>

<template>
  <div class="pilahki-container">
    <!-- 1. Header / Navigasi -->
    <header class="navbar">
      <div class="nav-content">
        <a href="/" class="brand-logo" @click.prevent="navigateTo('/')">
          <span class="logo-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
              <path d="M11 19h8.2a1.8 1.8 0 0 0 1.54-.86 1.78 1.78 0 0 0 .02-1.78L16.8 9.5" />
              <path d="M11 5h2" />
              <path d="M12 2v3" />
              <path d="m14 14-2 5-2-5" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </span>
          <span class="brand-text">
            <span class="brand-name">Pilahki</span>
            <span class="brand-tagline">Kelola Sampah Tanpa Bingung</span>
          </span>
        </a>

        <!-- Menu Desktop -->
        <nav class="nav-links desktop-nav" aria-label="Navigasi Utama">
          <a
            v-for="item in features"
            :key="item.id"
            :href="item.path"
            class="nav-item"
            @click.prevent="handleFeatureClick(item)"
          >
            {{ item.title }}
          </a>

          <button type="button" class="nav-ai-btn" @click="handleOpenAI">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Tanya PilahAI
          </button>

          <!-- Status Autentikasi Pengguna -->
          <div class="auth-section">
            <template v-if="isAuthenticated">
              <div ref="userMenuRef" class="user-menu-wrapper">
                <button
                  type="button"
                  class="user-account-btn"
                  :class="{ 'user-account-active': isProfileDropdownOpen }"
                  :aria-expanded="isProfileDropdownOpen"
                  aria-haspopup="true"
                  aria-label="Menu akun pengguna"
                  @click="toggleProfileDropdown"
                >
                  <span class="user-avatar-circle" aria-hidden="true">
                    {{ userEmail ? userEmail.charAt(0).toUpperCase() : 'U' }}
                  </span>
                  <span class="user-display-name">
                    {{ userEmail ? userEmail.split('@')[0] : 'Akun' }}
                  </span>
                  <svg
                    class="dropdown-chevron"
                    :class="{ 'chevron-rotate': isProfileDropdownOpen }"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                <!-- Dropdown Card -->
                <div v-show="isProfileDropdownOpen" class="user-dropdown-card" role="menu">
                  <div class="dropdown-user-header">
                    <div class="dropdown-avatar-large">
                      {{ userEmail ? userEmail.charAt(0).toUpperCase() : 'U' }}
                    </div>
                    <div class="dropdown-user-details">
                      <span class="dropdown-user-name">
                        {{ userEmail ? userEmail.split('@')[0] : 'Warga' }}
                      </span>
                      <span class="dropdown-user-email" :title="userEmail">
                        {{ userEmail }}
                      </span>
                    </div>
                  </div>

                  <div class="dropdown-divider"></div>

                  <div class="dropdown-menu-list">
                    <button
                      type="button"
                      class="dropdown-item"
                      role="menuitem"
                      @click="handleProfileClick"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="item-icon">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>Profil Saya</span>
                    </button>
                    <button
                      type="button"
                      class="dropdown-item"
                      role="menuitem"
                      @click="() => { closeProfileDropdown(); navigateTo('/jadwal') }"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="item-icon">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>Jadwal Wilayah</span>
                    </button>
                  </div>

                  <div class="dropdown-divider"></div>

                  <button
                    type="button"
                    class="dropdown-item dropdown-item-danger"
                    role="menuitem"
                    @click="handleLogout"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="item-icon">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <button type="button" class="login-btn" @click="openLoginModal">
                Masuk
              </button>
            </template>
          </div>
        </nav>

        <!-- Tombol Menu Mobile -->
        <button
          type="button"
          class="mobile-menu-toggle"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Buka menu navigasi"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg v-if="!isMobileMenuOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Menu Dropdown Mobile -->
      <div v-show="isMobileMenuOpen" class="mobile-nav-menu">
        <a
          v-for="item in features"
          :key="'m-' + item.id"
          :href="item.path"
          class="mobile-nav-item"
          @click.prevent="handleFeatureClick(item)"
        >
          {{ item.title }}
        </a>
        <button type="button" class="mobile-ai-btn" @click="handleOpenAI">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Tanya PilahAI
        </button>

        <!-- Mobile Auth State -->
        <div class="mobile-auth-section">
          <template v-if="isAuthenticated">
            <div class="mobile-user-profile-header">
              <div class="dropdown-avatar-large">
                {{ userEmail ? userEmail.charAt(0).toUpperCase() : 'U' }}
              </div>
              <div class="dropdown-user-details">
                <span class="dropdown-user-name">
                  {{ userEmail ? userEmail.split('@')[0] : 'Warga' }}
                </span>
                <span class="dropdown-user-email">
                  {{ userEmail }}
                </span>
              </div>
            </div>
            <button type="button" class="mobile-menu-link" @click="handleProfileClick">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="item-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profil Saya</span>
            </button>
            <button type="button" class="mobile-logout-btn" @click="handleLogout">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="item-icon">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Keluar</span>
            </button>
          </template>
          <template v-else>
            <button type="button" class="mobile-login-btn" @click="openLoginModal">
              Masuk / Daftar
            </button>
          </template>
        </div>
      </div>
    </header>

    <!-- 2. Hero Section -->
    <main class="main-content">
      <section class="hero-section">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          Solusi Praktis Sampah Rumah Tangga
        </div>

        <h1 class="hero-title">
          Bingung Sampah Ini Masuk Kategori Apa & Dibuang ke Mana?
        </h1>

        <p class="hero-desc">
          Ketik nama barang yang sedang Anda pegang. Dapatkan kategori pemilahan, cara penanganan praktis, serta lokasi Bank Sampah atau TPS terdekat tanpa ragu.
        </p>

        <!-- Search Bar Interaktif -->
        <form class="search-box-form" @submit.prevent="handleSearch()">
          <div class="search-input-wrapper">
            <span class="search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Ketik nama sampah (misal: botol plastik, baterai, styrofoam...)"
              aria-label="Cari jenis sampah"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="clear-search-btn"
              aria-label="Hapus teks"
              @click="searchQuery = ''"
            >
              ×
            </button>
          </div>
          <button type="submit" class="search-submit-btn">
            Pilah Sekarang
          </button>
        </form>

        <!-- Guest Notice Banner Ringkas -->
        <div v-if="!isAuthenticated" class="guest-auth-hint">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="hint-svg" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span><strong>Akses Tamu:</strong> Masuk atau buat akun untuk mengakses rincian pemilahan, navigasi TPS, dan jadwal wilayah Anda.</span>
        </div>

        <!-- Contoh Pencarian Cepat -->
        <div class="quick-examples">
          <span class="quick-label">Sering dicari:</span>
          <div class="chips-group">
            <button
              v-for="chip in quickExamples"
              :key="chip"
              type="button"
              class="chip-btn"
              @click="handleSearch(chip)"
            >
              {{ chip }}
            </button>
          </div>
        </div>

        <!-- Pautan Alternatif ke PilahAI -->
        <div class="ai-alternative-prompt">
          <span>Masih ragu atau barangnya berlapis?</span>
          <button type="button" class="ai-text-link" @click="handleOpenAI">
            Tanya PilahAI langsung
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-arrow">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </section>

      <!-- 3. Grid 4 Fitur Utama -->
      <section class="features-section" aria-labelledby="features-heading">
        <div class="section-header">
          <h2 id="features-heading" class="section-title">
            Layanan Terpadu Pilahki
          </h2>
          <p class="section-subtitle">
            Akses langsung ke setiap kebutuhan pengelolaan sampah di lingkungan Anda
          </p>
        </div>

        <div class="features-grid">
          <!-- Kad 1: Pilah Sampah -->
          <article class="feature-card" @click="handleFeatureClick(features[0])">
            <div class="card-header">
              <span class="card-icon card-icon-green" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </span>
              <span class="card-badge">Kategori & Cara</span>
            </div>
            <h3 class="card-title">Pilah Sampah</h3>
            <p class="card-desc">
              Ketahui kategori sampah (Organik, Anorganik, B3, Residu) dan instruksi penanganan aman sebelum dibuang.
            </p>
            <div class="card-footer">
              <span class="card-action">
                Buka Pemilahan
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-arrow">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </article>

          <!-- Kad 2: Cari Lokasi -->
          <article class="feature-card" @click="handleFeatureClick(features[1])">
            <div class="card-header">
              <span class="card-icon card-icon-blue" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span class="card-badge">Bank Sampah & TPS</span>
            </div>
            <h3 class="card-title">Cari Lokasi</h3>
            <p class="card-desc">
              Cari Bank Sampah dan TPS terdekat via GPS atau pilihan wilayah, lengkap dengan jam buka dan jenis sampah yang diterima.
            </p>
            <div class="card-footer">
              <span class="card-action">
                Cari Lokasi Terdekat
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-arrow">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </article>

          <!-- Kad 3: Jadwal Angkut -->
          <article class="feature-card" @click="handleFeatureClick(features[2])">
            <div class="card-header">
              <span class="card-icon card-icon-amber" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <span class="card-badge">Jadwal Wilayah</span>
            </div>
            <h3 class="card-title">Jadwal Angkut</h3>
            <p class="card-desc">
              Pantau hari dan jam pengangkutan sampah rutin di wilayah tempat tinggal Anda agar sampah tidak menumpuk di jalan.
            </p>
            <div class="card-footer">
              <span class="card-action">
                Lihat Jadwal
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-arrow">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </article>

          <!-- Kad 4: Panduan -->
          <article class="feature-card" @click="handleFeatureClick(features[3])">
            <div class="card-header">
              <span class="card-icon card-icon-emerald" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </span>
              <span class="card-badge">Edukasi Praktis</span>
            </div>
            <h3 class="card-title">Panduan</h3>
            <p class="card-desc">
              Baca panduan pemilahan praktis dengan bahasa santun dan mudah dipahami oleh seluruh anggota keluarga.
            </p>
            <div class="card-footer">
              <span class="card-action">
                Baca Panduan
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-arrow">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </article>
        </div>
      </section>
    </main>

    <!-- 4. Floating Action Button PilahAI -->
    <aside class="floating-ai-wrapper">
      <button
        type="button"
        class="floating-ai-btn"
        aria-label="Tanya PilahAI sekarang"
        @click="handleOpenAI"
      >
        <span class="floating-ai-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
          </svg>
        </span>
        <span class="floating-ai-label">Tanya PilahAI</span>
      </button>
    </aside>

    <!-- 5. Footer -->
    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="footer-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="footer-svg">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v10" />
                <path d="m8 11 4-4 4 4" />
              </svg>
            </span>
            <strong>Pilahki</strong>
          </div>
          <p class="footer-tagline">
            Platform terpadu untuk membantu warga memilah, menemukan lokasi, dan memantau jadwal sampah rumah tangga.
          </p>
        </div>

        <nav class="footer-nav" aria-label="Navigasi Footer">
          <a href="/pilah" @click.prevent="handleFeatureClick(features[0])">Pilah Sampah</a>
          <a href="/lokasi" @click.prevent="handleFeatureClick(features[1])">Cari Lokasi</a>
          <a href="/jadwal" @click.prevent="handleFeatureClick(features[2])">Jadwal Angkut</a>
          <a href="/panduan" @click.prevent="handleFeatureClick(features[3])">Panduan</a>
          <a href="/pilah-ai" @click.prevent="handleOpenAI">PilahAI</a>
        </nav>
      </div>

      <div class="footer-bottom">
        <p>© 2024 Pilahki. Menuju permukiman bersih dan berkelanjutan (SDG 11 & SDG 13).</p>
      </div>
    </footer>

    <!-- 6. Modal Log Masuk / Daftar Supabase -->
    <AuthModal
      :is-open="isAuthModalOpen"
      :title="modalTitle"
      :subtitle="modalSubtitle"
      @close="isAuthModalOpen = false"
      @auth-success="handleAuthSuccess"
    />
  </div>
</template>

<style scoped>
/* ==========================================================================
   Design Tokens & CSS Variables Terancang
   ========================================================================== */
.pilahki-container {
  --pk-primary: #15803d;
  --pk-primary-hover: #166534;
  --pk-primary-light: #f0fdf4;
  --pk-primary-border: #bbf7d0;
  --pk-text-main: #0f172a;
  --pk-text-muted: #475569;
  --pk-text-subtle: #64748b;
  --pk-bg: #fafaf9;
  --pk-surface: #ffffff;
  --pk-border: #e2e8f0;
  --pk-border-subtle: #f1f5f9;
  --pk-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --pk-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
  --pk-radius-sm: 6px;
  --pk-radius-md: 10px;
  --pk-radius-lg: 14px;
  --pk-radius-full: 9999px;

  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--pk-text-main);
  background-color: var(--pk-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  text-align: left;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.pilahki-container *,
.pilahki-container *::before,
.pilahki-container *::after {
  box-sizing: inherit;
}

/* ==========================================================================
   1. Navbar
   ========================================================================== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--pk-border);
}

.nav-content {
  max-width: 1140px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  width: 38px;
  height: 38px;
  border-radius: var(--pk-radius-md);
  background-color: var(--pk-primary-light);
  color: var(--pk-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--pk-primary-border);
}

.logo-icon svg {
  width: 22px;
  height: 22px;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--pk-primary);
  line-height: 1.15;
}

.brand-tagline {
  font-size: 0.72rem;
  color: var(--pk-text-subtle);
  font-weight: 500;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-item {
  color: var(--pk-text-muted);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: var(--pk-radius-sm);
  transition: color 0.15s, background-color 0.15s;
}

.nav-item:hover {
  color: var(--pk-primary);
  background-color: var(--pk-primary-light);
}

.nav-ai-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--pk-primary-light);
  color: var(--pk-primary);
  border: 1px solid var(--pk-primary-border);
  font-size: 0.88rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: var(--pk-radius-full);
  cursor: pointer;
  transition: all 0.15s;
}

.nav-ai-btn:hover {
  background-color: var(--pk-primary);
  color: #ffffff;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Auth Desktop Section */
.auth-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 8px;
  padding-left: 12px;
  border-left: 1px solid var(--pk-border);
}

.login-btn {
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  font-size: 0.88rem;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: var(--pk-radius-sm);
  cursor: pointer;
  transition: background-color 0.15s;
}

.login-btn:hover {
  background-color: var(--pk-primary-hover);
}

/* User Account Button & Dropdown */
.user-menu-wrapper {
  position: relative;
  display: inline-block;
}

.user-account-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-full);
  padding: 4px 10px 4px 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.user-account-btn:hover,
.user-account-active {
  border-color: var(--pk-primary);
  background-color: var(--pk-primary-light);
}

.user-avatar-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--pk-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.user-display-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--pk-text-main);
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-chevron {
  width: 16px;
  height: 16px;
  color: var(--pk-text-subtle);
  transition: transform 0.2s ease;
}

.chevron-rotate {
  transform: rotate(180deg);
}

.user-dropdown-card {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background-color: #ffffff;
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-md);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
  padding: 8px 0;
  z-index: 60;
}

.dropdown-user-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px 10px;
}

.dropdown-avatar-large {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: var(--pk-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  flex-shrink: 0;
}

.dropdown-user-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-align: left;
}

.dropdown-user-name {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--pk-text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-user-email {
  font-size: 0.74rem;
  color: var(--pk-text-subtle);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--pk-border-subtle);
  margin: 6px 0;
}

.dropdown-menu-list {
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border: none;
  background: none;
  font-size: 0.86rem;
  color: var(--pk-text-main);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s, color 0.15s;
}

.dropdown-item:hover {
  background-color: var(--pk-border-subtle);
  color: var(--pk-primary);
}

.dropdown-item-danger {
  color: #dc2626;
}

.dropdown-item-danger:hover {
  background-color: #fef2f2;
  color: #b91c1c;
}

.item-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--pk-text-main);
  border-radius: var(--pk-radius-sm);
}

.mobile-menu-toggle svg {
  width: 24px;
  height: 24px;
}

.mobile-nav-menu {
  display: none;
  flex-direction: column;
  background-color: var(--pk-surface);
  border-bottom: 1px solid var(--pk-border);
  padding: 12px 20px 18px;
  gap: 8px;
}

.mobile-nav-item {
  text-decoration: none;
  color: var(--pk-text-main);
  font-size: 0.95rem;
  font-weight: 500;
  padding: 10px 12px;
  border-radius: var(--pk-radius-sm);
}

.mobile-nav-item:hover {
  background-color: var(--pk-primary-light);
  color: var(--pk-primary);
}

.mobile-ai-btn {
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--pk-primary-light);
  color: var(--pk-primary);
  border: 1px solid var(--pk-primary-border);
  font-size: 0.95rem;
  font-weight: 600;
  padding: 10px;
  border-radius: var(--pk-radius-md);
  cursor: pointer;
}

.mobile-auth-section {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--pk-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-login-btn {
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 10px;
  border-radius: var(--pk-radius-md);
  cursor: pointer;
}

.mobile-user-profile-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 4px 10px;
}

.mobile-menu-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--pk-text-main);
  border-radius: var(--pk-radius-sm);
  cursor: pointer;
  text-align: left;
}

.mobile-menu-link:hover {
  background-color: var(--pk-primary-light);
  color: var(--pk-primary);
}

.mobile-logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: none;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.92rem;
  font-weight: 600;
  padding: 10px;
  border-radius: var(--pk-radius-md);
  cursor: pointer;
  transition: background-color 0.15s;
}

.mobile-logout-btn:hover {
  background-color: #fef2f2;
}

/* ==========================================================================
   2. Main Layout & Hero Section
   ========================================================================== */
.main-content {
  flex: 1;
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px 60px;
}

.hero-section {
  text-align: center;
  max-width: 780px;
  margin: 0 auto 56px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--pk-primary);
  background-color: var(--pk-primary-light);
  border: 1px solid var(--pk-primary-border);
  padding: 4px 12px;
  border-radius: var(--pk-radius-full);
  margin-bottom: 18px;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--pk-primary);
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.03em;
  color: var(--pk-text-main);
  margin: 0 0 16px;
}

.hero-desc {
  font-size: 1.05rem;
  color: var(--pk-text-muted);
  line-height: 1.6;
  margin: 0 auto 28px;
  max-width: 660px;
}

/* Search Box Form */
.search-box-form {
  display: flex;
  align-items: stretch;
  gap: 8px;
  max-width: 620px;
  margin: 0 auto 14px;
  background-color: var(--pk-surface);
  border: 2px solid var(--pk-border);
  padding: 4px;
  border-radius: var(--pk-radius-lg);
  box-shadow: var(--pk-shadow-sm);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box-form:focus-within {
  border-color: var(--pk-primary);
  box-shadow: 0 0 0 3px var(--pk-primary-border);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  padding-left: 12px;
  gap: 10px;
}

.search-icon {
  color: var(--pk-text-subtle);
  display: flex;
  align-items: center;
}

.search-icon svg {
  width: 19px;
  height: 19px;
}

.search-input {
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: var(--pk-text-main);
  width: 100%;
  background: transparent;
  padding: 10px 0;
}

.search-input::placeholder {
  color: #94a3b8;
  font-size: 0.9rem;
}

.clear-search-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--pk-text-subtle);
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
}

.search-submit-btn {
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  font-size: 0.92rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: var(--pk-radius-md);
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s;
}

.search-submit-btn:hover {
  background-color: var(--pk-primary-hover);
}

/* Guest Hint */
.guest-auth-hint {
  max-width: 620px;
  margin: 0 auto 16px;
  padding: 8px 14px;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  font-size: 0.82rem;
  color: #475569;
  text-align: center;
}

/* Quick Examples */
.quick-examples {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
}

.quick-label {
  font-size: 0.82rem;
  color: var(--pk-text-subtle);
  font-weight: 500;
}

.chips-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.chip-btn {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  color: var(--pk-text-muted);
  font-size: 0.8rem;
  padding: 3px 10px;
  border-radius: var(--pk-radius-full);
  cursor: pointer;
  transition: all 0.15s;
}

.chip-btn:hover {
  border-color: var(--pk-primary);
  color: var(--pk-primary);
  background-color: var(--pk-primary-light);
}

/* Prompt Alternatif AI */
.ai-alternative-prompt {
  font-size: 0.88rem;
  color: var(--pk-text-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
}

.ai-text-link {
  background: none;
  border: none;
  color: var(--pk-primary);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
}

.ai-text-link:hover {
  text-decoration: underline;
}

.inline-arrow {
  width: 14px;
  height: 14px;
}

/* ==========================================================================
   3. Grid 4 Fitur
   ========================================================================== */
.features-section {
  margin-top: 10px;
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 6px;
}

.section-subtitle {
  font-size: 0.95rem;
  color: var(--pk-text-muted);
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feature-card {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  box-shadow: var(--pk-shadow-sm);
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  border-color: var(--pk-primary);
  box-shadow: var(--pk-shadow-md);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--pk-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon svg {
  width: 22px;
  height: 22px;
}

.card-icon-green {
  background-color: #f0fdf4;
  color: #16a34a;
}

.card-icon-blue {
  background-color: #eff6ff;
  color: #2563eb;
}

.card-icon-amber {
  background-color: #fffbeb;
  color: #d97706;
}

.card-icon-emerald {
  background-color: #ecfdf5;
  color: #059669;
}

.card-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--pk-text-subtle);
  background-color: var(--pk-border-subtle);
  padding: 3px 8px;
  border-radius: var(--pk-radius-full);
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 8px;
}

.card-desc {
  font-size: 0.9rem;
  color: var(--pk-text-muted);
  line-height: 1.5;
  margin: 0 0 18px;
  flex: 1;
}

.card-footer {
  border-top: 1px solid var(--pk-border-subtle);
  padding-top: 12px;
}

.card-action {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--pk-primary);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.15s;
}

.feature-card:hover .card-action {
  gap: 10px;
}

.action-arrow {
  width: 15px;
  height: 15px;
}

/* ==========================================================================
   4. Floating PilahAI Button
   ========================================================================== */
.floating-ai-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
}

.floating-ai-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  border-radius: var(--pk-radius-full);
  padding: 12px 18px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(21, 128, 61, 0.35);
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.floating-ai-btn:hover {
  background-color: var(--pk-primary-hover);
  transform: translateY(-2px);
}

.floating-ai-btn:active {
  transform: translateY(0);
}

.floating-ai-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-ai-icon svg {
  width: 20px;
  height: 20px;
}

/* ==========================================================================
   5. Footer
   ========================================================================== */
.site-footer {
  background-color: #ffffff;
  border-top: 1px solid var(--pk-border);
  padding: 40px 20px 24px;
  margin-top: auto;
}

.footer-content {
  max-width: 1140px;
  margin: 0 auto 28px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.footer-brand {
  max-width: 440px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.15rem;
  color: var(--pk-primary);
  margin-bottom: 8px;
}

.footer-tagline {
  font-size: 0.88rem;
  color: var(--pk-text-muted);
  line-height: 1.5;
  margin: 0;
}

.footer-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.footer-nav a {
  text-decoration: none;
  color: var(--pk-text-muted);
  font-size: 0.88rem;
  font-weight: 500;
  transition: color 0.15s;
}

.footer-nav a:hover {
  color: var(--pk-primary);
}

.footer-bottom {
  max-width: 1140px;
  margin: 0 auto;
  padding-top: 20px;
  border-top: 1px solid var(--pk-border-subtle);
  font-size: 0.8rem;
  color: var(--pk-text-subtle);
  text-align: center;
}

/* ==========================================================================
   Responsivitas Mobile (Android / Smartphone)
   ========================================================================== */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .mobile-nav-menu {
    display: flex;
  }

  .main-content {
    padding: 24px 16px 40px;
  }

  .hero-section {
    margin-bottom: 40px;
  }

  .hero-title {
    font-size: 1.65rem;
  }

  .hero-desc {
    font-size: 0.95rem;
    margin-bottom: 20px;
  }

  .search-box-form {
    flex-direction: column;
    padding: 6px;
    gap: 8px;
  }

  .search-input-wrapper {
    padding-left: 8px;
  }

  .search-submit-btn {
    width: 100%;
    padding: 12px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .feature-card {
    padding: 18px;
  }

  .footer-content {
    flex-direction: column;
    gap: 20px;
  }

  .footer-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .floating-ai-wrapper {
    bottom: 18px;
    right: 18px;
  }

  .floating-ai-btn {
    padding: 10px 14px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.45rem;
  }

  .floating-ai-label {
    display: none;
  }

  .floating-ai-btn {
    padding: 14px;
    border-radius: 50%;
  }
}
</style>
