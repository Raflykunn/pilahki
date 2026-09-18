<script setup>
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { kategoriEdukasiList, artikelPanduan, faqPanduan } from '../data/panduanData'
import { useAuth } from '../composables/useAuth'
import AuthModal from '../components/AuthModal.vue'

const emit = defineEmits(['navigate', 'open-ai'])

// Router helper
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

const navigateTo = (path) => {
  emit('navigate', { path })
  if (router) {
    router.push(path).catch(() => {})
  }
}

// Auth state
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

onMounted(() => {
  initAuth()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Search & Filter
const searchQuery = ref('')
const selectedKategoriTab = ref('semua') // 'semua' | 'organik' | 'anorganik' | 'b3' | 'residu'

// State Kategori Aktif untuk Paparan Rinci
const activeKategoriDetail = ref(kategoriEdukasiList[0])

// Penapisan Kategori
const filteredKategoriList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return kategoriEdukasiList.filter(item => {
    const matchesTab = selectedKategoriTab.value === 'semua' || item.id === selectedKategoriTab.value
    if (!matchesTab) return false

    if (!query) return true
    const inName = item.nama.toLowerCase().includes(query)
    const inExamples = item.contoh.some(c => c.toLowerCase().includes(query))
    const inDesc = item.ringkasan.toLowerCase().includes(query)
    return inName || inExamples || inDesc
  })
})

// Penapisan Artikel
const filteredArtikelList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return artikelPanduan
  return artikelPanduan.filter(art => {
    return art.judul.toLowerCase().includes(query) ||
      art.ringkasan.toLowerCase().includes(query) ||
      art.isi.some(line => line.toLowerCase().includes(query))
  })
})

// State Artikel Modal
const selectedArtikel = ref(null)
const openArtikelModal = (artikel) => {
  selectedArtikel.value = artikel
}
const closeArtikelModal = () => {
  selectedArtikel.value = null
}

// State FAQ Accordion
const openFaqIndex = ref(0)
const toggleFaq = (index) => {
  openFaqIndex.value = openFaqIndex.value === index ? -1 : index
}

// Navigasi ke PilahAI
const handleOpenAI = (context = '') => {
  emit('open-ai', { query: context })
  navigateTo('/pilah-ai')
}
</script>

<template>
  <div class="panduan-page">
    <!-- Navbar Ringkas -->
    <header class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <a href="/" class="brand-logo" @click.prevent="navigateTo('/')">
            <span class="logo-icon" aria-hidden="true">🌱</span>
            <span class="brand-text">
              <span class="brand-name">Pilahki</span>
              <span class="brand-tagline">Panduan Pemilahan</span>
            </span>
          </a>
        </div>

        <div class="nav-right">
          <button type="button" class="nav-link-btn" @click="navigateTo('/jadwal')">
            <span>Jadwal Angkut</span>
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
      <!-- Header Tajuk & Carian Panduan -->
      <section class="panduan-hero">
        <div class="breadcrumb-nav">
          <a href="/" @click.prevent="navigateTo('/')">Beranda</a>
          <span class="sep">/</span>
          <span class="current">Panduan</span>
        </div>
        <h1 class="page-title">Panduan Pemilahan Sampah Rumah Tangga</h1>
        <p class="page-subtitle">
          Tips praktis dan bahasa awam agar Anda sekeluarga bisa memilah sampah dengan benar tanpa merasa repot atau bingung.
        </p>

        <!-- Search Bar Panduan -->
        <div class="panduan-search-box">
          <span class="search-icon" aria-hidden="true">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Cari panduan (misal: botol plastik, baterai, minyak jelantah, bau sampah...)"
            aria-label="Cari isi panduan"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="clear-btn"
            aria-label="Kosongkan carian"
            @click="searchQuery = ''"
          >
            ×
          </button>
        </div>

        <!-- Tab Kategori -->
        <div class="kategori-filter-tabs" role="tablist">
          <button
            type="button"
            class="tab-btn"
            :class="{ active: selectedKategoriTab === 'semua' }"
            @click="selectedKategoriTab = 'semua'"
          >
            Semua Panduan
          </button>
          <button
            v-for="kat in kategoriEdukasiList"
            :key="kat.id"
            type="button"
            class="tab-btn"
            :class="['tab-' + kat.warna, { active: selectedKategoriTab === kat.id }]"
            @click="selectedKategoriTab = kat.id"
          >
            {{ kat.icon }} {{ kat.nama }}
          </button>
        </div>
      </section>

      <!-- Seksyen 1: 4 Kad Kategori Utama -->
      <section class="kategori-cards-section" aria-labelledby="kategori-heading">
        <h2 id="kategori-heading" class="section-title">
          4 Kategori Sampah yang Wajib Diketahui
        </h2>
        <p class="section-desc">
          Pahami perbedaan mendasar agar Anda tidak salah menaruh barang ke tempat sampah.
        </p>

        <div v-if="filteredKategoriList.length === 0" class="empty-search">
          <p>Tidak ada panduan kategori yang cocok dengan pencarian "{{ searchQuery }}".</p>
          <button type="button" class="reset-btn" @click="searchQuery = ''">
            Tampilkan Semua
          </button>
        </div>

        <div v-else class="kategori-grid">
          <article
            v-for="k in filteredKategoriList"
            :key="k.id"
            class="kategori-card"
            :class="'card-theme-' + k.warna"
          >
            <div class="card-header">
              <div class="icon-wrap">
                <span class="icon-emoji">{{ k.icon }}</span>
              </div>
              <div class="header-titles">
                <h3 class="kategori-name">{{ k.nama }}</h3>
                <span class="kategori-tagline">{{ k.tagline }}</span>
              </div>
            </div>

            <p class="kategori-summary">
              {{ k.ringkasan }}
            </p>

            <!-- Contoh Diterima -->
            <div class="info-group">
              <strong class="group-label group-accepted">
                <span class="dot-icon">✓</span> Contoh barang:
              </strong>
              <div class="chips-wrap">
                <span v-for="c in k.contoh" :key="c" class="item-chip chip-accepted">
                  {{ c }}
                </span>
              </div>
            </div>

            <!-- Jangan Dicampur -->
            <div class="info-group">
              <strong class="group-label group-rejected">
                <span class="dot-icon">✕</span> Jangan dicampur:
              </strong>
              <div class="chips-wrap">
                <span v-for="j in k.janganCampur" :key="j" class="item-chip chip-rejected">
                  {{ j }}
                </span>
              </div>
            </div>

            <!-- 3 Langkah Praktis -->
            <div class="steps-group">
              <strong class="steps-title">Langkah Penanganan Praktis:</strong>
              <ol class="steps-list">
                <li v-for="(step, idx) in k.langkahPraktis" :key="idx">
                  {{ step }}
                </li>
              </ol>
            </div>

            <!-- Tips Khas Bu Rina -->
            <div class="tips-box">
              <span class="tips-icon">💡</span>
              <div class="tips-text">
                <strong>Tips Warga:</strong> {{ k.tipsRina }}
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Seksyen 2: Artikel Tips & Trik Pemilahan Rumah Tangga -->
      <section class="artikel-section" aria-labelledby="artikel-heading">
        <div class="section-header-flex">
          <div>
            <h2 id="artikel-heading" class="section-title">
              Tips & Cara Praktis di Dapur
            </h2>
            <p class="section-desc">
              Solusi nyata untuk masalah sehari-hari seperti bau sampah, botol berminyak, dan pekarangan sempit.
            </p>
          </div>
        </div>

        <div class="artikel-grid">
          <article
            v-for="art in filteredArtikelList"
            :key="art.id"
            class="artikel-card"
            @click="openArtikelModal(art)"
          >
            <div class="artikel-badge">
              <span>{{ art.waktuBaca }}</span>
            </div>
            <h3 class="artikel-title">
              {{ art.judul }}
            </h3>
            <p class="artikel-desc">
              {{ art.ringkasan }}
            </p>
            <div class="artikel-action">
              <span>Baca langkah lengkap →</span>
            </div>
          </article>
        </div>
      </section>

      <!-- Seksyen 3: Tanya Jawab (FAQ) Warga -->
      <section class="faq-section" aria-labelledby="faq-heading">
        <h2 id="faq-heading" class="section-title">
          Tanya Jawab Seputar Pemilahan
        </h2>
        <p class="section-desc">
          Hal-hal yang paling sering membuat warga ragu saat memilah di rumah.
        </p>

        <div class="faq-accordion">
          <div
            v-for="(faq, fIndex) in faqPanduan"
            :key="fIndex"
            class="faq-item"
            :class="{ 'faq-open': openFaqIndex === fIndex }"
          >
            <button
              type="button"
              class="faq-question-btn"
              :aria-expanded="openFaqIndex === fIndex"
              @click="toggleFaq(fIndex)"
            >
              <span class="faq-q-text">{{ faq.q }}</span>
              <span class="faq-toggle-icon">
                {{ openFaqIndex === fIndex ? '−' : '+' }}
              </span>
            </button>
            <div v-show="openFaqIndex === fIndex" class="faq-answer">
              <p>{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Banner PilahAI Shortcut -->
      <section class="pilahai-helper-banner">
        <div class="helper-icon">🤖</div>
        <div class="helper-content">
          <h3 class="helper-title">Punya Sampah yang Tidak Ada di Panduan?</h3>
          <p class="helper-desc">
            Kemasannya berlapis atau Anda bingung jenis bahannya? Tanyakan langsung ke PilahAI tanpa perlu menebak-nebak.
          </p>
        </div>
        <button
          type="button"
          class="helper-action-btn"
          @click="handleOpenAI('Saya punya sampah khusus, bagaimana cara memilahnya?')"
        >
          Tanya PilahAI Sekarang
        </button>
      </section>
    </main>

    <!-- Footer Ringkas -->
    <footer class="page-footer">
      <div class="footer-container">
        <p>© 2024 Pilahki — Edukasi Lingkungan Rumah Tangga Berkelanjutan (SDG 4 & SDG 13).</p>
      </div>
    </footer>

    <!-- Modal Baca Artikel Panduan -->
    <div v-if="selectedArtikel" class="modal-overlay" @click.self="closeArtikelModal">
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-art-title">
        <button type="button" class="close-modal-btn" aria-label="Tutup" @click="closeArtikelModal">
          ×
        </button>
        <span class="modal-read-time">{{ selectedArtikel.waktuBaca }}</span>
        <h2 id="modal-art-title" class="modal-title">
          {{ selectedArtikel.judul }}
        </h2>
        <div class="modal-body-content">
          <p v-for="(paragraph, pIdx) in selectedArtikel.isi" :key="pIdx" class="content-paragraph">
            {{ paragraph }}
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="modal-done-btn" @click="closeArtikelModal">
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>

    <!-- Auth Modal jika Tetamu ingin log masuk -->
    <AuthModal
      :is-open="isAuthModalOpen"
      title="Masuk ke Pilahki"
      subtitle="Masuk untuk menyimpan panduan favorit dan mengakses layanan lengkap."
      @close="isAuthModalOpen = false"
    />
  </div>
</template>

<style scoped>
/* ==========================================================================
   Design Tokens & CSS PanduanView
   ========================================================================== */
.panduan-page {
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

.panduan-page *,
.panduan-page *::before,
.panduan-page *::after {
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

.panduan-hero {
  margin-bottom: 40px;
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
  margin: 0 0 24px;
  max-width: 720px;
}

/* Search Box */
.panduan-search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: var(--pk-surface);
  border: 1px solid #cbd5e1;
  border-radius: var(--pk-radius-lg);
  padding: 6px 14px;
  max-width: 600px;
  margin-bottom: 18px;
  box-shadow: var(--pk-shadow-sm);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.panduan-search-box:focus-within {
  border-color: var(--pk-primary);
  box-shadow: 0 0 0 3px var(--pk-primary-border);
}

.search-icon {
  font-size: 1rem;
}

.search-input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 0.92rem;
  color: var(--pk-text-main);
  padding: 6px 0;
}

.clear-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #94a3b8;
  cursor: pointer;
  line-height: 1;
  padding: 2px 6px;
}

/* Tabs */
.kategori-filter-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  color: var(--pk-text-muted);
  font-size: 0.84rem;
  font-weight: 500;
  padding: 6px 14px;
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

/* ==========================================================================
   Section 1: 4 Kategori Cards
   ========================================================================== */
.kategori-cards-section {
  margin-bottom: 50px;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 4px;
}

.section-desc {
  font-size: 0.9rem;
  color: var(--pk-text-muted);
  margin: 0 0 22px;
}

.kategori-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.kategori-card {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--pk-shadow-sm);
  transition: border-color 0.15s;
}

.kategori-card:hover {
  border-color: #cbd5e1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--pk-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--pk-border-subtle);
  font-size: 1.4rem;
  flex-shrink: 0;
}

.card-theme-green .icon-wrap { background-color: #f0fdf4; }
.card-theme-blue .icon-wrap { background-color: #eff6ff; }
.card-theme-amber .icon-wrap { background-color: #fffbeb; }
.card-theme-slate .icon-wrap { background-color: #f1f5f9; }

.kategori-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0;
}

.kategori-tagline {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--pk-text-subtle);
}

.kategori-summary {
  font-size: 0.9rem;
  color: var(--pk-text-muted);
  line-height: 1.5;
  margin: 0 0 16px;
}

.info-group {
  margin-bottom: 12px;
}

.group-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  margin-bottom: 6px;
}

.group-accepted { color: #166534; }
.group-rejected { color: #991b1b; }

.dot-icon {
  font-weight: 800;
}

.chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.item-chip {
  font-size: 0.74rem;
  padding: 2px 7px;
  border-radius: 4px;
}

.chip-accepted {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.chip-rejected {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.steps-group {
  background-color: var(--pk-border-subtle);
  padding: 12px 14px;
  border-radius: var(--pk-radius-sm);
  margin-top: 14px;
  margin-bottom: 14px;
}

.steps-title {
  display: block;
  font-size: 0.8rem;
  color: var(--pk-text-main);
  margin-bottom: 6px;
}

.steps-list {
  margin: 0;
  padding-left: 18px;
  font-size: 0.82rem;
  color: var(--pk-text-muted);
  line-height: 1.45;
}

.steps-list li {
  margin-bottom: 4px;
}

.steps-list li:last-child {
  margin-bottom: 0;
}

.tips-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background-color: #fffbeb;
  border: 1px solid #fef3c7;
  padding: 10px 12px;
  border-radius: var(--pk-radius-sm);
  font-size: 0.8rem;
  color: #92400e;
  line-height: 1.4;
}

.tips-icon {
  font-size: 0.95rem;
  flex-shrink: 0;
}

/* ==========================================================================
   Section 2: Artikel Tips Dapur
   ========================================================================== */
.artikel-section {
  margin-bottom: 50px;
}

.artikel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.artikel-card {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  box-shadow: var(--pk-shadow-sm);
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.artikel-card:hover {
  transform: translateY(-2px);
  border-color: var(--pk-primary);
}

.artikel-badge {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--pk-primary);
  background-color: var(--pk-primary-light);
  padding: 2px 8px;
  border-radius: var(--pk-radius-full);
  display: inline-block;
  margin-bottom: 10px;
  width: fit-content;
}

.artikel-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 8px;
  line-height: 1.35;
}

.artikel-desc {
  font-size: 0.85rem;
  color: var(--pk-text-muted);
  line-height: 1.45;
  margin: 0 0 16px;
  flex: 1;
}

.artikel-action {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--pk-primary);
}

/* ==========================================================================
   Section 3: FAQ
   ========================================================================== */
.faq-section {
  margin-bottom: 50px;
}

.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-md);
  overflow: hidden;
}

.faq-question-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--pk-text-main);
  cursor: pointer;
  transition: background-color 0.15s;
}

.faq-question-btn:hover {
  background-color: var(--pk-border-subtle);
}

.faq-toggle-icon {
  font-size: 1.2rem;
  color: var(--pk-text-subtle);
  font-weight: 400;
}

.faq-answer {
  padding: 0 20px 16px;
  font-size: 0.9rem;
  color: var(--pk-text-muted);
  line-height: 1.55;
  border-top: 1px solid var(--pk-border-subtle);
  padding-top: 12px;
}

.faq-answer p {
  margin: 0;
}

/* ==========================================================================
   PilahAI Helper Banner
   ========================================================================== */
.pilahai-helper-banner {
  background-color: #ffffff;
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: var(--pk-shadow-sm);
}

.helper-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.helper-content {
  flex: 1;
}

.helper-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 4px;
}

.helper-desc {
  font-size: 0.88rem;
  color: var(--pk-text-muted);
  margin: 0;
}

.helper-action-btn {
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: var(--pk-radius-md);
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s;
}

.helper-action-btn:hover {
  background-color: var(--pk-primary-hover);
}

/* Empty search */
.empty-search {
  text-align: center;
  padding: 40px 20px;
  background-color: var(--pk-surface);
  border: 1px dashed var(--pk-border);
  border-radius: var(--pk-radius-lg);
  color: var(--pk-text-muted);
}

.reset-btn {
  margin-top: 8px;
  background: none;
  border: 1px solid var(--pk-border);
  padding: 6px 14px;
  border-radius: var(--pk-radius-sm);
  color: var(--pk-primary);
  font-weight: 600;
  cursor: pointer;
}

/* ==========================================================================
   Modal Baca Artikel
   ========================================================================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-card {
  position: relative;
  background-color: #ffffff;
  border-radius: var(--pk-radius-lg);
  width: 100%;
  max-width: 540px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 30px 26px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--pk-border);
}

.close-modal-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  line-height: 1;
}

.modal-read-time {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--pk-primary);
}

.modal-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 4px 0 16px;
  line-height: 1.3;
}

.modal-body-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 0.92rem;
  color: #334155;
  line-height: 1.6;
  margin-bottom: 24px;
}

.content-paragraph {
  margin: 0;
}

.modal-footer {
  text-align: right;
}

.modal-done-btn {
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  font-size: 0.88rem;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: var(--pk-radius-md);
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
}

/* ==========================================================================
   Responsif Mudah Alih
   ========================================================================== */
@media (max-width: 860px) {
  .kategori-grid {
    grid-template-columns: 1fr;
  }

  .artikel-grid {
    grid-template-columns: 1fr;
  }

  .pilahai-helper-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .helper-action-btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.45rem;
  }
}
</style>
