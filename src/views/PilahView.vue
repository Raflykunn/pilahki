<script setup>
import { ref, computed, onMounted, onUnmounted, watch, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { daftarSampah, kategoriConfig } from '../data/sampahData'
import { useAuth } from '../composables/useAuth'
import AuthModal from '../components/AuthModal.vue'

const emit = defineEmits(['navigate', 'open-ai'])

// Router & Route
const instance = getCurrentInstance()
let router = null
let route = null
if (instance?.appContext?.config?.globalProperties?.$router) {
  router = instance.appContext.config.globalProperties.$router
  route = instance.appContext.config.globalProperties.$route
} else {
  try {
    router = useRouter()
    route = useRoute()
  } catch {
    router = null
    route = null
  }
}

const navigateTo = (path, query = {}) => {
  emit('navigate', { path, query })
  if (router) {
    router.push({ path, query }).catch(() => {})
  }
}

// Auth State
const { isAuthenticated, userEmail, initAuth, signOut } = useAuth()
const userMenuRef = ref(null)
const isProfileDropdownOpen = ref(false)
const isAuthModalOpen = ref(false)

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

const handleClickOutside = (e) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    isProfileDropdownOpen.value = false
  }
}

// State Carian & Penapis
const searchQuery = ref('')
const activeCategoryFilter = ref('semua')
const selectedItemDetail = ref(null)
const recentSearches = ref([])

// Muat rute query atau carian awal
onMounted(() => {
  initAuth()
  document.addEventListener('click', handleClickOutside)

  // Ambil riwayat carian dari localStorage
  try {
    const saved = localStorage.getItem('pilahki_recent_searches')
    if (saved) {
      recentSearches.value = JSON.parse(saved).slice(0, 5)
    }
  } catch {}

  // Semak parameter URL ?q=... dari Landing Page
  const queryParam = route?.query?.q
  if (queryParam && typeof queryParam === 'string') {
    searchQuery.value = queryParam
    executeSearch(queryParam)
  } else {
    // Paparkan item pertama sebagai contoh awal
    selectedItemDetail.value = daftarSampah[0]
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Simpan carian terkini
const saveRecentSearch = (term) => {
  const clean = term.trim()
  if (!clean) return
  const filtered = recentSearches.value.filter(s => s.toLowerCase() !== clean.toLowerCase())
  recentSearches.value = [clean, ...filtered].slice(0, 5)
  try {
    localStorage.setItem('pilahki_recent_searches', JSON.stringify(recentSearches.value))
  } catch {}
}

// Laksanakan carian
const executeSearch = (queryText = null) => {
  const text = (queryText !== null ? queryText : searchQuery.value).trim()
  if (!text) return

  searchQuery.value = text
  saveRecentSearch(text)

  // Cari padanan terbaik untuk kad perincian utama
  const lower = text.toLowerCase()
  const exactMatch = daftarSampah.find(item => {
    return item.nama.toLowerCase().includes(lower) ||
      item.alias.some(a => a.toLowerCase().includes(lower))
  })

  if (exactMatch) {
    selectedItemDetail.value = exactMatch
    // Selaraskan juga tab jika perlu
    activeCategoryFilter.value = 'semua'
  }
}

// Penapisan senarai sampah mengikut carian teks dan tab kategori
const filteredList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return daftarSampah.filter(item => {
    const matchesCategory = activeCategoryFilter.value === 'semua' || item.kategori === activeCategoryFilter.value
    if (!matchesCategory) return false

    if (!query) return true
    const inName = item.nama.toLowerCase().includes(query)
    const inAlias = item.alias.some(a => a.toLowerCase().includes(query))
    const inCategory = item.kategori.toLowerCase().includes(query)
    const inTips = item.tipsPraktis.toLowerCase().includes(query)
    return inName || inAlias || inCategory || inTips
  })
})

// Pilih item untuk dipaparkan secara rinci
const selectItem = (item) => {
  selectedItemDetail.value = item
  // Scroll ke kad rinci jika di peranti mudah alih
  if (window.innerWidth < 860) {
    window.scrollTo({ top: 280, behavior: 'smooth' })
  }
}

// Buka PilahAI dengan konteks sampah (PRD Seksyen 7.6 & 8)
const handleAskAIWithContext = (item) => {
  const queryPrompt = `Saya punya sampah ${item.nama} (${item.kategori.toUpperCase()}). Mau tahu ke mana buangnya atau apakah ada bank sampah/TPS terdekat yang menerima?`
  emit('open-ai', { query: queryPrompt, item })
  navigateTo('/pilah-ai', { q: item.nama, kategori: item.kategori })
}

// Pintasan cip contoh
const quickChips = [
  'Baterai Bekas',
  'Botol Plastik',
  'Kemasan Sachet',
  'Minyak Jelantah',
  'Kulit Telur',
  'Popok Bayi',
  'Styrofoam',
  'Lampu Neon'
]

const handleQuickChip = (chip) => {
  searchQuery.value = chip
  executeSearch(chip)
}
</script>

<template>
  <div class="pilah-page">
    <!-- Navbar Ringkas -->
    <header class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <a href="/" class="brand-logo" @click.prevent="navigateTo('/')">
            <span class="logo-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="brand-svg">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v10" />
                <path d="m8 11 4-4 4 4" />
              </svg>
            </span>
            <span class="brand-text">
              <span class="brand-name">Pilahki</span>
              <span class="brand-tagline">Pilah Sampah</span>
            </span>
          </a>
        </div>

        <div class="nav-right">
          <button type="button" class="nav-link-btn" @click="navigateTo('/jadwal')">
            <span>Jadwal Angkut</span>
          </button>

          <button type="button" class="nav-link-btn" @click="navigateTo('/panduan')">
            <span>Panduan</span>
          </button>

          <button type="button" class="back-home-btn" @click="navigateTo('/')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-svg">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Beranda</span>
          </button>

          <!-- Dropdown Akaun Jika Log Masuk -->
          <div v-if="isAuthenticated" ref="userMenuRef" class="user-menu-wrapper">
            <button
              type="button"
              class="user-account-btn"
              :class="{ 'user-account-active': isProfileDropdownOpen }"
              aria-label="Menu akun pengguna"
              @click="toggleProfileDropdown"
            >
              <span class="user-avatar-circle">
                {{ userEmail ? userEmail.charAt(0).toUpperCase() : 'U' }}
              </span>
              <span class="user-display-name">
                {{ userEmail ? userEmail.split('@')[0] : 'Akun' }}
              </span>
            </button>

            <div v-show="isProfileDropdownOpen" class="user-dropdown-card">
              <div class="dropdown-user-header">
                <strong>{{ userEmail }}</strong>
              </div>
              <div class="dropdown-divider"></div>
              <button type="button" class="dropdown-item dropdown-item-danger" @click="signOut">
                Keluar
              </button>
            </div>
          </div>
          <button v-else type="button" class="login-nav-btn" @click="isAuthModalOpen = true">
            Masuk
          </button>
        </div>
      </div>
    </header>

    <main class="main-container">
      <!-- Header Tajuk & Hero Search Bar -->
      <section class="pilah-hero">
        <div class="breadcrumb-nav">
          <a href="/" @click.prevent="navigateTo('/')">Beranda</a>
          <span class="sep">/</span>
          <span class="current">Pilah Sampah</span>
        </div>
        <h1 class="page-title">Ketahui Kategori & Cara Penanganan Sampah</h1>
        <p class="page-subtitle">
          Pegang satu barang dan tidak yakin harus diapakan? Ketik nama sampah di bawah untuk melihat kategori resmi dan langkah penanganannya.
        </p>

        <!-- Search Bar Interaktif -->
        <form class="search-form-wrap" @submit.prevent="executeSearch()">
          <div class="input-with-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="input-search-svg" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="pilah-search-input"
              placeholder="Ketik nama sampah (misal: botol plastik, baterai, sachet kopi, styrofoam...)"
              aria-label="Cari jenis sampah"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="clear-input-btn"
              aria-label="Hapus teks"
              @click="searchQuery = ''"
            >
              ×
            </button>
          </div>
          <button type="submit" class="search-action-btn">
            Cari Kategori
          </button>
        </form>

        <!-- Contoh Pencarian Pantas -->
        <div class="quick-chips-bar">
          <span class="chips-label">Sering dicari:</span>
          <div class="chips-list">
            <button
              v-for="chip in quickChips"
              :key="chip"
              type="button"
              class="quick-chip-btn"
              @click="handleQuickChip(chip)"
            >
              {{ chip }}
            </button>
          </div>
        </div>

        <!-- Riwayat Carian Terkini -->
        <div v-if="recentSearches.length > 0" class="recent-searches-bar">
          <span class="recent-label">Riwayat Anda:</span>
          <div class="recent-list">
            <button
              v-for="item in recentSearches"
              :key="item"
              type="button"
              class="recent-item-btn"
              @click="handleQuickChip(item)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="recent-svg" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{{ item }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Layout Utama: Kad Perincian Hasil & Katalog Penapisan -->
      <div class="pilah-content-layout">
        <!-- BAHAGIAN KIRI: Kad Hasil Perincian Sampah Terpilih (PRD Seksyen 7.1 & 7.6) -->
        <section class="detail-panel-section">
          <div v-if="selectedItemDetail" class="detail-card" :class="'detail-theme-' + selectedItemDetail.kategori">
            <div class="detail-top-bar">
              <div class="item-title-wrap">
                <div class="category-icon-box" :class="'cat-box-' + selectedItemDetail.kategori" aria-hidden="true">
                  <svg v-if="selectedItemDetail.kategori === 'organik'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cat-svg">
                    <path d="M12 22v-9" />
                    <path d="M12 13a7 7 0 0 0 7-7c0-2-2-3-4-3-4 0-7 4-7 8" />
                    <path d="M12 13a7 7 0 0 1-7-7c0-2 2-3 4-3 4 0 7 4 7 8" />
                  </svg>
                  <svg v-else-if="selectedItemDetail.kategori === 'anorganik'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cat-svg">
                    <polyline points="21 8 21 21 3 21 3 8" />
                    <rect x="1" y="3" width="22" height="5" />
                    <line x1="10" y1="12" x2="14" y2="12" />
                  </svg>
                  <svg v-else-if="selectedItemDetail.kategori === 'b3'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cat-svg">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cat-svg">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </div>
                <div>
                  <h2 class="item-main-name">{{ selectedItemDetail.nama }}</h2>
                  <span class="category-badge-pill" :class="'pill-' + selectedItemDetail.kategori">
                    {{ kategoriConfig[selectedItemDetail.kategori].label.toUpperCase() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Keterangan Umum Kategori -->
            <p class="category-overview">
              {{ kategoriConfig[selectedItemDetail.kategori].deskripsiUmum }}
            </p>

            <div class="detail-divider"></div>

            <!-- Langkah Penanganan Aman -->
            <div class="handling-steps-box">
              <h3 class="steps-heading">
                Langkah Penanganan Aman:
              </h3>
              <ol class="handling-list">
                <li v-for="(step, sIdx) in selectedItemDetail.penanganan" :key="sIdx">
                  {{ step }}
                </li>
              </ol>
            </div>

            <!-- Tujuan Penyaluran -->
            <div class="destination-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="destination-svg" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div class="destination-content">
                <strong>Tujuan Penyaluran:</strong>
                <p>{{ selectedItemDetail.tujuanPenyaluran }}</p>
              </div>
            </div>

            <!-- Tips Tambahan -->
            <div class="practical-tips-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tips-svg" aria-hidden="true">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
              </svg>
              <div class="tips-content">
                <strong>Tips Warga:</strong> {{ selectedItemDetail.tipsPraktis }}
              </div>
            </div>

            <div class="detail-divider"></div>

            <!-- Alur Utama PRD 7.6 & 8: "Mau tahu ke mana buangnya?" -->
            <div class="action-next-prompt">
              <div class="prompt-text">
                <strong>Mau tahu ke mana buangnya?</strong>
                <p>Tanyakan langsung lokasi bank sampah atau TPS terdekat yang menerima jenis sampah ini.</p>
              </div>
              <div class="prompt-btn-group">
                <button
                  type="button"
                  class="ask-ai-context-btn"
                  @click="handleAskAIWithContext(selectedItemDetail)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Tanya PilahAI Langsung
                </button>
                <button
                  type="button"
                  class="check-schedule-btn"
                  @click="navigateTo('/jadwal')"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Cek Jadwal Angkut
                </button>
              </div>
            </div>
          </div>

          <!-- Empty Selection State -->
          <div v-else class="empty-detail-state">
            <p>Pilih salah satu jenis sampah di samping untuk melihat cara penanganannya.</p>
          </div>
        </section>

        <!-- BAHAGIAN KANAN: Penapis & Senarai Katalog Sampah -->
        <section class="catalog-panel-section">
          <!-- Filter Kategori Tabs -->
          <div class="catalog-filter-bar">
            <div class="filter-header">
              <h3 class="catalog-title">Daftar Sampah Rumah Tangga</h3>
              <span class="catalog-count">{{ filteredList.length }} jenis sampah</span>
            </div>

            <div class="kategori-tabs-group" role="tablist">
              <button
                type="button"
                class="tab-btn"
                :class="{ active: activeCategoryFilter === 'semua' }"
                @click="activeCategoryFilter = 'semua'"
              >
                Semua
              </button>
              <button
                type="button"
                class="tab-btn tab-green"
                :class="{ active: activeCategoryFilter === 'organik' }"
                @click="activeCategoryFilter = 'organik'"
              >
                <span class="tab-dot dot-green" aria-hidden="true"></span>
                Organik
              </button>
              <button
                type="button"
                class="tab-btn tab-blue"
                :class="{ active: activeCategoryFilter === 'anorganik' }"
                @click="activeCategoryFilter = 'anorganik'"
              >
                <span class="tab-dot dot-blue" aria-hidden="true"></span>
                Anorganik
              </button>
              <button
                type="button"
                class="tab-btn tab-amber"
                :class="{ active: activeCategoryFilter === 'b3' }"
                @click="activeCategoryFilter = 'b3'"
              >
                <span class="tab-dot dot-amber" aria-hidden="true"></span>
                Limbah B3
              </button>
              <button
                type="button"
                class="tab-btn tab-slate"
                :class="{ active: activeCategoryFilter === 'residu' }"
                @click="activeCategoryFilter = 'residu'"
              >
                <span class="tab-dot dot-slate" aria-hidden="true"></span>
                Residu
              </button>
            </div>
          </div>

          <!-- Senarai Sampah (List of Items) -->
          <div v-if="filteredList.length === 0" class="no-results-box">
            <p>Tidak ditemukan sampah dengan kata kunci "{{ searchQuery }}".</p>
            <p class="no-results-sub">
              Bingung barang ini masuk jenis apa? Anda bisa tanyakan langsung ke PilahAI.
            </p>
            <button
              type="button"
              class="ask-ai-fallback-btn"
              @click="handleAskAIWithContext({ nama: searchQuery, kategori: 'tidak diketahui' })"
            >
              Tanya PilahAI Soal "{{ searchQuery }}"
            </button>
          </div>

          <div v-else class="catalog-items-grid">
            <article
              v-for="item in filteredList"
              :key="item.id"
              class="catalog-item-card"
              :class="[
                'border-' + item.kategori,
                { 'item-card-selected': selectedItemDetail && selectedItemDetail.id === item.id }
              ]"
              @click="selectItem(item)"
            >
              <div class="card-item-left">
                <span class="item-cat-dot" :class="'dot-' + item.kategori" aria-hidden="true"></span>
                <div class="item-text-info">
                  <h4 class="item-card-name">{{ item.nama }}</h4>
                  <span class="item-badge-mini" :class="'badge-' + item.kategori">
                    {{ kategoriConfig[item.kategori].label }}
                  </span>
                </div>
              </div>
              <span class="view-detail-hint">
                Lihat &rarr;
              </span>
            </article>
          </div>
        </section>
      </div>
    </main>

    <!-- Footer Ringkas -->
    <footer class="page-footer">
      <div class="footer-container">
        <p>© 2024 Pilahki — Solusi Terpadu Pemilahan Sampah Rumah Tangga (SDG 11 & SDG 13).</p>
      </div>
    </footer>

    <!-- Auth Modal jika Tetamu ingin log masuk -->
    <AuthModal
      :is-open="isAuthModalOpen"
      title="Masuk ke Pilahki"
      subtitle="Masuk untuk mencatat riwayat pemilahan dan mengakses fasilitas terdekat."
      @close="isAuthModalOpen = false"
    />
  </div>
</template>

<style scoped>
/* ==========================================================================
   Design Tokens & CSS PilahView
   ========================================================================== */
.pilah-page {
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
  line-height: 1.5;
  text-align: left;
}

.pilah-page *,
.pilah-page *::before,
.pilah-page *::after {
  box-sizing: inherit;
}

/* ==========================================================================
   Navbar
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
  font-size: 1.4rem;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--pk-primary);
  line-height: 1.1;
}

.brand-tagline {
  font-size: 0.72rem;
  color: var(--pk-text-subtle);
  font-weight: 500;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-link-btn {
  background: none;
  border: none;
  color: var(--pk-text-muted);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: var(--pk-radius-sm);
  transition: color 0.15s;
}

.nav-link-btn:hover {
  color: var(--pk-primary);
}

.back-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid var(--pk-border);
  color: var(--pk-text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: var(--pk-radius-sm);
  cursor: pointer;
  transition: all 0.15s;
}

.back-home-btn:hover {
  background-color: var(--pk-border-subtle);
  color: var(--pk-text-main);
}

.btn-svg {
  width: 16px;
  height: 16px;
}

.login-nav-btn {
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: var(--pk-radius-sm);
  cursor: pointer;
}

/* User Account */
.user-menu-wrapper {
  position: relative;
}

.user-account-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-full);
  padding: 4px 10px 4px 4px;
  cursor: pointer;
}

.user-avatar-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: var(--pk-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.user-display-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--pk-text-main);
}

.user-dropdown-card {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 180px;
  background-color: #ffffff;
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-md);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  padding: 8px;
  z-index: 50;
}

.dropdown-user-header {
  padding: 4px 8px;
  font-size: 0.8rem;
  color: var(--pk-text-muted);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--pk-border);
  margin: 6px 0;
}

.dropdown-item {
  width: 100%;
  padding: 6px 8px;
  border: none;
  background: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 4px;
  text-align: left;
}

.dropdown-item-danger {
  color: #dc2626;
}

.dropdown-item-danger:hover {
  background-color: #fef2f2;
}

/* ==========================================================================
   Main Content Layout
   ========================================================================== */
.main-container {
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 20px 60px;
  flex: 1;
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--pk-text-subtle);
  margin-bottom: 8px;
}

.breadcrumb-nav a {
  color: var(--pk-primary);
  text-decoration: none;
}

.pilah-hero {
  margin-bottom: 32px;
}

.page-title {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--pk-text-main);
  margin: 0 0 6px;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.95rem;
  color: var(--pk-text-muted);
  margin: 0 0 20px;
  max-width: 720px;
}

/* Search Form */
.search-form-wrap {
  display: flex;
  align-items: stretch;
  gap: 10px;
  max-width: 680px;
  margin-bottom: 16px;
}

.input-with-icon {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: var(--pk-surface);
  border: 2px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 4px 14px;
  gap: 10px;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: var(--pk-shadow-sm);
}

.input-with-icon:focus-within {
  border-color: var(--pk-primary);
  box-shadow: 0 0 0 3px var(--pk-primary-border);
}

.input-search-icon {
  font-size: 1rem;
}

.pilah-search-input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 0.95rem;
  color: var(--pk-text-main);
  padding: 8px 0;
}

.clear-input-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--pk-text-subtle);
  cursor: pointer;
  line-height: 1;
  padding: 2px 6px;
}

.search-action-btn {
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  border-radius: var(--pk-radius-md);
  font-size: 0.92rem;
  font-weight: 600;
  padding: 0 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s;
}

.search-action-btn:hover {
  background-color: var(--pk-primary-hover);
}

/* Chips Bar */
.quick-chips-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.chips-label {
  font-size: 0.8rem;
  color: var(--pk-text-subtle);
  font-weight: 500;
}

.chips-list {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.quick-chip-btn {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  color: var(--pk-text-muted);
  font-size: 0.78rem;
  padding: 3px 10px;
  border-radius: var(--pk-radius-full);
  cursor: pointer;
  transition: all 0.15s;
}

.quick-chip-btn:hover {
  border-color: var(--pk-primary);
  color: var(--pk-primary);
  background-color: var(--pk-primary-light);
}

/* Recent Searches */
.recent-searches-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.recent-label {
  font-size: 0.78rem;
  color: var(--pk-text-subtle);
}

.recent-list {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.recent-item-btn {
  background: none;
  border: none;
  font-size: 0.78rem;
  color: var(--pk-text-muted);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

.recent-item-btn:hover {
  text-decoration: underline;
  color: var(--pk-primary);
}

/* ==========================================================================
   2-Column Layout: Detail & Catalog
   ========================================================================== */
.pilah-content-layout {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 28px;
  align-items: start;
}

/* Detail Card */
.detail-card {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 26px;
  box-shadow: var(--pk-shadow-sm);
  position: sticky;
  top: 80px;
}

.detail-theme-organik { border-top: 5px solid #16a34a; }
.detail-theme-anorganik { border-top: 5px solid #2563eb; }
.detail-theme-b3 { border-top: 5px solid #d97706; }
.detail-theme-residu { border-top: 5px solid #475569; }

.detail-top-bar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.brand-svg {
  width: 24px;
  height: 24px;
  color: var(--pk-primary);
}

.input-search-svg {
  width: 18px;
  height: 18px;
  color: var(--pk-text-subtle);
  flex-shrink: 0;
}

.recent-svg {
  width: 13px;
  height: 13px;
  color: var(--pk-text-subtle);
  display: inline-block;
  vertical-align: middle;
  margin-right: 3px;
}

.category-icon-box {
  width: 48px;
  height: 48px;
  border-radius: var(--pk-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cat-box-organik { background-color: #dcfce7; color: #166534; }
.cat-box-anorganik { background-color: #dbeafe; color: #1e40af; }
.cat-box-b3 { background-color: #fef3c7; color: #b45309; }
.cat-box-residu { background-color: #f1f5f9; color: #475569; }

.cat-svg {
  width: 24px;
  height: 24px;
}

.destination-svg {
  width: 18px;
  height: 18px;
  color: #2563eb;
  flex-shrink: 0;
  margin-top: 2px;
}

.tips-svg {
  width: 18px;
  height: 18px;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 2px;
}

.tab-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.dot-green { background-color: #16a34a; }
.dot-blue { background-color: #2563eb; }
.dot-amber { background-color: #d97706; }
.dot-slate { background-color: #64748b; }

.item-cat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.item-main-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--pk-text-main);
  margin: 0 0 6px;
  letter-spacing: -0.02em;
}

.category-badge-pill {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--pk-radius-full);
}

.pill-organik { background-color: #dcfce7; color: #166534; }
.pill-anorganik { background-color: #dbeafe; color: #1e40af; }
.pill-b3 { background-color: #fef3c7; color: #b45309; }
.pill-residu { background-color: #f1f5f9; color: #475569; }

.category-overview {
  font-size: 0.88rem;
  color: var(--pk-text-muted);
  line-height: 1.45;
  margin: 0 0 16px;
}

.detail-divider {
  height: 1px;
  background-color: var(--pk-border-subtle);
  margin: 16px 0;
}

/* Steps Box */
.handling-steps-box {
  background-color: var(--pk-border-subtle);
  border-radius: var(--pk-radius-md);
  padding: 16px;
  margin-bottom: 14px;
}

.steps-heading {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 10px;
}

.handling-list {
  margin: 0;
  padding-left: 20px;
  font-size: 0.88rem;
  color: var(--pk-text-main);
  line-height: 1.5;
}

.handling-list li {
  margin-bottom: 6px;
}

.handling-list li:last-child {
  margin-bottom: 0;
}

/* Destination */
.destination-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 10px 14px;
  border-radius: var(--pk-radius-md);
  font-size: 0.84rem;
  color: #1e40af;
  margin-bottom: 12px;
}

.destination-icon {
  font-size: 1.1rem;
}

.destination-content p {
  margin: 2px 0 0;
  color: #1e3a8a;
  font-weight: 500;
}

/* Practical Tips */
.practical-tips-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background-color: #fffbeb;
  border: 1px solid #fef3c7;
  padding: 10px 14px;
  border-radius: var(--pk-radius-md);
  font-size: 0.84rem;
  color: #92400e;
  line-height: 1.4;
}

.tips-emoji {
  font-size: 1.1rem;
}

/* Action Prompt (PRD 7.6 & 8) */
.action-next-prompt {
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: var(--pk-radius-md);
  padding: 16px;
}

.prompt-text strong {
  font-size: 0.92rem;
  color: var(--pk-text-main);
  display: block;
  margin-bottom: 2px;
}

.prompt-text p {
  font-size: 0.82rem;
  color: var(--pk-text-muted);
  margin: 0 0 12px;
}

.prompt-btn-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.ask-ai-context-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  font-size: 0.86rem;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: var(--pk-radius-sm);
  cursor: pointer;
  transition: background-color 0.15s;
}

.ask-ai-context-btn:hover {
  background-color: var(--pk-primary-hover);
}

.check-schedule-btn {
  background-color: #ffffff;
  border: 1px solid var(--pk-border);
  color: var(--pk-text-main);
  font-size: 0.86rem;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: var(--pk-radius-sm);
  cursor: pointer;
  transition: background-color 0.15s;
}

.check-schedule-btn:hover {
  background-color: var(--pk-border-subtle);
}

/* ==========================================================================
   Catalog Panel (Right Column)
   ========================================================================== */
.catalog-panel-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.catalog-filter-bar {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 16px;
  box-shadow: var(--pk-shadow-sm);
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.catalog-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0;
}

.catalog-count {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--pk-text-subtle);
}

.kategori-tabs-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.tab-btn {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  color: var(--pk-text-muted);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: var(--pk-radius-full);
  cursor: pointer;
  transition: all 0.15s;
}

.tab-btn:hover {
  border-color: #cbd5e1;
}

.tab-btn.active {
  background-color: var(--pk-text-main);
  color: #ffffff;
  border-color: var(--pk-text-main);
}

.tab-green.active { background-color: #16a34a; border-color: #16a34a; }
.tab-blue.active { background-color: #2563eb; border-color: #2563eb; }
.tab-amber.active { background-color: #d97706; border-color: #d97706; }
.tab-slate.active { background-color: #475569; border-color: #475569; }

/* Catalog Items Grid */
.catalog-items-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.catalog-item-card {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-md);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: var(--pk-shadow-sm);
  transition: transform 0.1s, border-color 0.15s, background-color 0.15s;
}

.catalog-item-card:hover {
  transform: translateX(2px);
  border-color: #cbd5e1;
}

.item-card-selected {
  border-color: var(--pk-primary);
  background-color: var(--pk-primary-light);
  box-shadow: 0 0 0 2px var(--pk-primary-border);
}

.card-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
}

.item-thumb-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
}

.item-text-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.item-card-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-badge-mini {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  width: fit-content;
}

.badge-organik { background-color: #dcfce7; color: #166534; }
.badge-anorganik { background-color: #dbeafe; color: #1e40af; }
.badge-b3 { background-color: #fef3c7; color: #b45309; }
.badge-residu { background-color: #f1f5f9; color: #475569; }

.view-detail-hint {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--pk-primary);
  flex-shrink: 0;
  padding-left: 8px;
}

/* No Results */
.no-results-box {
  background-color: var(--pk-surface);
  border: 1px dashed var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 30px 20px;
  text-align: center;
}

.no-results-box p {
  margin: 0 0 6px;
  font-size: 0.92rem;
  color: var(--pk-text-main);
}

.no-results-sub {
  font-size: 0.82rem;
  color: var(--pk-text-muted);
  margin-bottom: 14px !important;
}

.ask-ai-fallback-btn {
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  font-size: 0.86rem;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: var(--pk-radius-sm);
  cursor: pointer;
}

/* Footer */
.page-footer {
  background-color: #ffffff;
  border-top: 1px solid var(--pk-border);
  padding: 24px 20px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--pk-text-subtle);
  margin-top: auto;
}

/* ==========================================================================
   Responsif Mudah Alih
   ========================================================================== */
@media (max-width: 860px) {
  .pilah-content-layout {
    grid-template-columns: 1fr;
  }

  .detail-card {
    position: static;
  }

  .search-form-wrap {
    flex-direction: column;
  }

  .search-action-btn {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.45rem;
  }
}
</style>
