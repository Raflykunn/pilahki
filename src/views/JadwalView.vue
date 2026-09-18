<script setup>
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { wilayahList, jadwalMaster } from '../data/jadwalData'
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

  // Muat wilayah tersimpan daripada localStorage jika ada
  const savedWilayah = localStorage.getItem('pilahki_wilayah_id')
  if (savedWilayah && wilayahList.some(w => w.id === savedWilayah)) {
    selectedWilayahId.value = savedWilayah
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// State Pengurusan Wilayah
const selectedWilayahId = ref(wilayahList[0].id)
const isSavedNoticeVisible = ref(false)

const currentWilayah = computed(() => {
  return wilayahList.find(w => w.id === selectedWilayahId.value) || wilayahList[0]
})

// Simpan pilihan wilayah ke localStorage
const handleWilayahChange = () => {
  localStorage.setItem('pilahki_wilayah_id', selectedWilayahId.value)
  isSavedNoticeVisible.value = true
  setTimeout(() => {
    isSavedNoticeVisible.value = false
  }, 2500)
}

// State Tampilan & Penapis
const activeFilter = ref('semua') // 'semua' | 'organik' | 'anorganik' | 'residu'
const viewMode = ref('list') // 'list' | 'calendar'

// Hari Semasa (0: Ahad, 1: Isnin, 2: Selasa, 3: Rabu, 4: Khamis, 5: Jumaat, 6: Sabtu)
const todayDayIndex = new Date().getDay()
const hariNamaList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

// Senarai jadual untuk wilayah terpilih
const currentJadwalList = computed(() => {
  const list = jadwalMaster[selectedWilayahId.value] || []
  if (activeFilter.value === 'semua') {
    return list
  }
  return list.filter(item => item.kategori === activeFilter.value)
})

// Pengiraan Jadual Terdekat
const nextUpcomingPickup = computed(() => {
  const allList = jadwalMaster[selectedWilayahId.value] || []
  if (!allList.length) return null

  // Cari yang terdekat bermula dari hari ini ke depan
  let candidate = null
  let minDaysDiff = 99

  for (const item of allList) {
    let diff = item.hariIndex - todayDayIndex
    if (diff < 0) diff += 7 // pusingan minggu hadapan

    if (diff < minDaysDiff) {
      minDaysDiff = diff
      candidate = {
        ...item,
        isToday: diff === 0,
        isTomorrow: diff === 1,
        daysAway: diff
      }
    }
  }

  return candidate
})

// Kalendar 7 hari
const daysOfWeek = computed(() => {
  // Susun Isnin (1) hingga Ahad (0)
  const daysOrder = [1, 2, 3, 4, 5, 6, 0]
  const allList = jadwalMaster[selectedWilayahId.value] || []

  return daysOrder.map(dayIdx => {
    const pickups = allList.filter(item => item.hariIndex === dayIdx)
    return {
      index: dayIdx,
      nama: hariNamaList[dayIdx],
      isToday: dayIdx === todayDayIndex,
      pickups
    }
  })
})

// Navigasi ke PilahAI
const handleOpenAI = (customContext = '') => {
  emit('open-ai', { query: customContext })
  navigateTo('/pilah-ai')
}
</script>

<template>
  <div class="jadwal-page">
    <!-- Navbar Ringkas -->
    <header class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <a href="/" class="brand-logo" @click.prevent="navigateTo('/')">
            <span class="logo-icon" aria-hidden="true">🌱</span>
            <span class="brand-text">
              <span class="brand-name">Pilahki</span>
              <span class="brand-tagline">Jadwal Angkut</span>
            </span>
          </a>
        </div>

        <div class="nav-right">
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
      <!-- Header Jadwal & Pemilihan Wilayah -->
      <section class="wilayah-selector-section">
        <div class="header-titles">
          <div class="breadcrumb-nav">
            <a href="/" @click.prevent="navigateTo('/')">Beranda</a>
            <span class="sep">/</span>
            <span class="current">Jadwal Angkut</span>
          </div>
          <h1 class="page-title">Jadwal Pengangkutan Sampah Wilayah</h1>
          <p class="page-subtitle">
            Ketahui hari dan jam pengutipan sampah di lingkungan rumah Anda agar tidak terlewat dan menumpuk di jalan.
          </p>
        </div>

        <!-- Kad Pemilih Wilayah -->
        <div class="wilayah-card">
          <div class="wilayah-field-group">
            <label for="select-wilayah" class="field-label">
              <span class="label-icon">📍</span>
              Pilih Wilayah Tempat Tinggal Anda:
            </label>
            <div class="select-wrapper">
              <select
                id="select-wilayah"
                v-model="selectedWilayahId"
                class="wilayah-select"
                @change="handleWilayahChange"
              >
                <option v-for="w in wilayahList" :key="w.id" :value="w.id">
                  {{ w.kecamatan }} — {{ w.kelurahan }} ({{ w.rw }})
                </option>
              </select>
            </div>
          </div>

          <div class="wilayah-meta-info">
            <div class="meta-item">
              <span class="meta-label">TPS Terdekat:</span>
              <span class="meta-value">{{ currentWilayah.tpsTerdekat }}</span>
            </div>
            <span v-if="isSavedNoticeVisible" class="saved-badge">
              ✓ Wilayah disimpan
            </span>
          </div>
        </div>
      </section>

      <!-- Banner Status Pengangkutan Terdekat -->
      <section v-if="nextUpcomingPickup" class="upcoming-alert-banner">
        <div class="alert-icon-box" :class="'icon-bg-' + nextUpcomingPickup.kategori">
          <span v-if="nextUpcomingPickup.kategori === 'organik'">🍃</span>
          <span v-else-if="nextUpcomingPickup.kategori === 'anorganik'">📦</span>
          <span v-else>🗑️</span>
        </div>
        <div class="alert-text-content">
          <div class="alert-tagline">
            <span class="time-status-pill" :class="{ 'pill-urgent': nextUpcomingPickup.isToday || nextUpcomingPickup.isTomorrow }">
              {{ nextUpcomingPickup.isToday ? 'HARI INI' : nextUpcomingPickup.isTomorrow ? 'BESOK' : nextUpcomingPickup.hari }}
            </span>
            <span class="pickup-time-badge">{{ nextUpcomingPickup.waktu }}</span>
          </div>
          <h2 class="alert-title">
            Pengangkutan Terdekat: {{ nextUpcomingPickup.jenisSampah }}
          </h2>
          <p class="alert-instruction">
            {{ nextUpcomingPickup.catatan }}
          </p>
        </div>
      </section>

      <!-- Bar Kawalan: Mod Paparan & Penapis Kategori -->
      <section class="controls-bar">
        <!-- Penapis Kategori -->
        <div class="filter-pills" role="tablist" aria-label="Filter kategori sampah">
          <button
            type="button"
            class="pill-btn"
            :class="{ active: activeFilter === 'semua' }"
            @click="activeFilter = 'semua'"
          >
            Semua Jadwal
          </button>
          <button
            type="button"
            class="pill-btn pill-green"
            :class="{ active: activeFilter === 'organik' }"
            @click="activeFilter = 'organik'"
          >
            Organik
          </button>
          <button
            type="button"
            class="pill-btn pill-blue"
            :class="{ active: activeFilter === 'anorganik' }"
            @click="activeFilter = 'anorganik'"
          >
            Anorganik
          </button>
          <button
            type="button"
            class="pill-btn pill-slate"
            :class="{ active: activeFilter === 'residu' }"
            @click="activeFilter = 'residu'"
          >
            Residu
          </button>
        </div>

        <!-- Togol Mod Tampilan (List / Kalendar) -->
        <div class="view-toggle-group">
          <button
            type="button"
            class="toggle-view-btn"
            :class="{ active: viewMode === 'list' }"
            title="Tampilan Daftar Rinci"
            @click="viewMode = 'list'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="view-icon">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span>Daftar</span>
          </button>
          <button
            type="button"
            class="toggle-view-btn"
            :class="{ active: viewMode === 'calendar' }"
            title="Tampilan Kalender Mingguan"
            @click="viewMode = 'calendar'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="view-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Kalender</span>
          </button>
        </div>
      </section>

      <!-- Paparan 1: Senarai Jadual Rinci (List Mode) -->
      <section v-if="viewMode === 'list'" class="schedule-list-section">
        <div v-if="currentJadwalList.length === 0" class="empty-state-card">
          <p>Tidak ada jadwal pengangkutan untuk kategori ini di wilayah terpilih.</p>
          <button type="button" class="reset-filter-btn" @click="activeFilter = 'semua'">
            Tampilkan Semua Kategori
          </button>
        </div>

        <div v-else class="schedule-cards-grid">
          <article
            v-for="item in currentJadwalList"
            :key="item.id"
            class="schedule-card"
            :class="[
              'card-border-' + item.kategori,
              { 'schedule-card-today': item.hariIndex === todayDayIndex }
            ]"
          >
            <div class="card-top-bar">
              <div class="day-badge-wrap">
                <span class="day-name">{{ item.hari }}</span>
                <span v-if="item.hariIndex === todayDayIndex" class="today-indicator">
                  Hari Ini
                </span>
                <span v-else-if="item.hariIndex === (todayDayIndex + 1) % 7" class="tomorrow-indicator">
                  Besok
                </span>
              </div>
              <span class="kategori-badge" :class="'badge-' + item.kategori">
                {{ item.kategori.toUpperCase() }}
              </span>
            </div>

            <h3 class="schedule-title">
              {{ item.jenisSampah }}
            </h3>

            <div class="schedule-meta">
              <div class="meta-row">
                <span class="meta-icon">⏰</span>
                <strong>Jam Angkut:</strong>
                <span>{{ item.waktu }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-icon">🚛</span>
                <strong>Armada:</strong>
                <span>{{ item.petugas }}</span>
              </div>
            </div>

            <!-- Petunjuk Persiapan Praktis untuk Warga -->
            <div class="prep-instructions">
              <p class="prep-note">
                💡 <strong>Catatan:</strong> {{ item.catatan }}
              </p>
              <div class="acceptable-tags">
                <span class="tags-label">Diterima:</span>
                <span v-for="d in item.diterima" :key="d" class="item-chip chip-accepted">
                  {{ d }}
                </span>
              </div>
              <div class="non-acceptable-tags">
                <span class="tags-label">Jangan dicampur:</span>
                <span v-for="td in item.tidakDiterima" :key="td" class="item-chip chip-rejected">
                  {{ td }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Paparan 2: Kalendar Mingguan Padat (Calendar Mode) -->
      <section v-else class="calendar-view-section">
        <div class="calendar-grid">
          <div
            v-for="day in daysOfWeek"
            :key="day.index"
            class="calendar-day-col"
            :class="{ 'calendar-day-today': day.isToday }"
          >
            <div class="day-col-header">
              <span class="day-col-title">{{ day.nama }}</span>
              <span v-if="day.isToday" class="col-today-pill">Hari Ini</span>
            </div>

            <div class="day-col-body">
              <div v-if="day.pickups.length === 0" class="col-empty">
                <span>Tidak ada jadwal</span>
              </div>
              <div
                v-for="p in day.pickups"
                :key="p.id"
                class="col-pickup-item"
                :class="'col-item-' + p.kategori"
              >
                <div class="col-item-badge">
                  {{ p.kategori }}
                </div>
                <strong class="col-item-time">{{ p.waktu }}</strong>
                <p class="col-item-name">{{ p.jenisSampah }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bahagian Sokongan PilahAI untuk Jadual Khas -->
      <section class="special-pickup-help">
        <div class="help-box">
          <div class="help-icon" aria-hidden="true">🤖</div>
          <div class="help-content">
            <h3 class="help-title">Punya Sampah Besar atau Berbahaya?</h3>
            <p class="help-desc">
              Kasur bekas, puing bangunan, atau limbah baterai dan elektronik (B3) tidak diangkut lewat jadwal reguler di atas. Tanya ke PilahAI untuk panduan penyaluran khusus di wilayah Anda.
            </p>
          </div>
          <button type="button" class="help-btn" @click="handleOpenAI('Cara buang kasur atau limbah B3 di jadwal khusus')">
            Tanya PilahAI
          </button>
        </div>
      </section>
    </main>

    <!-- Footer Ringkas -->
    <footer class="page-footer">
      <div class="footer-container">
        <p>© 2024 Pilahki — Jadwal Pengangkutan Sampah Berkelanjutan (SDG 11).</p>
      </div>
    </footer>

    <!-- Auth Modal jika Tetamu ingin log masuk -->
    <AuthModal
      :is-open="isAuthModalOpen"
      title="Masuk ke Pilahki"
      subtitle="Masuk untuk menyimpan wilayah favorit dan riwayat jadwal Anda."
      @close="isAuthModalOpen = false"
    />
  </div>
</template>

<style scoped>
/* ==========================================================================
   Design Tokens & CSS JadwalView
   ========================================================================== */
.jadwal-page {
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

.jadwal-page *,
.jadwal-page *::before,
.jadwal-page *::after {
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

/* User Menu */
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
   Main Layout
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
}

/* Wilayah Card */
.wilayah-card {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: var(--pk-shadow-sm);
}

.wilayah-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--pk-text-main);
  display: flex;
  align-items: center;
  gap: 6px;
}

.wilayah-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: var(--pk-radius-md);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--pk-text-main);
  background-color: #f8fafc;
  outline: none;
  cursor: pointer;
  transition: border-color 0.15s;
}

.wilayah-select:focus {
  border-color: var(--pk-primary);
  background-color: #ffffff;
}

.wilayah-meta-info {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--pk-text-muted);
}

.meta-label {
  font-weight: 600;
  margin-right: 4px;
}

.saved-badge {
  color: var(--pk-primary);
  font-weight: 600;
}

/* Upcoming Alert Banner */
.upcoming-alert-banner {
  background-color: #ffffff;
  border: 1px solid #bbf7d0;
  border-left: 4px solid var(--pk-primary);
  border-radius: var(--pk-radius-md);
  padding: 18px 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
  box-shadow: var(--pk-shadow-sm);
}

.alert-icon-box {
  width: 44px;
  height: 44px;
  border-radius: var(--pk-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.icon-bg-organik { background-color: #f0fdf4; }
.icon-bg-anorganik { background-color: #eff6ff; }
.icon-bg-residu { background-color: #f1f5f9; }

.alert-text-content {
  flex: 1;
}

.alert-tagline {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.time-status-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--pk-radius-full);
  background-color: var(--pk-border-subtle);
  color: var(--pk-text-muted);
}

.pill-urgent {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.pickup-time-badge {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--pk-text-subtle);
}

.alert-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 4px;
}

.alert-instruction {
  font-size: 0.88rem;
  color: var(--pk-text-muted);
  margin: 0;
}

/* Controls Bar */
.controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.filter-pills {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.pill-btn {
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

.pill-btn:hover {
  border-color: #cbd5e1;
}

.pill-btn.active {
  background-color: var(--pk-text-main);
  color: #ffffff;
  border-color: var(--pk-text-main);
}

.pill-green.active {
  background-color: #16a34a;
  border-color: #16a34a;
}

.pill-blue.active {
  background-color: #2563eb;
  border-color: #2563eb;
}

.pill-slate.active {
  background-color: #475569;
  border-color: #475569;
}

.view-toggle-group {
  display: flex;
  align-items: center;
  background-color: #e2e8f0;
  padding: 3px;
  border-radius: var(--pk-radius-md);
  gap: 2px;
}

.toggle-view-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: none;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--pk-text-subtle);
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.toggle-view-btn.active {
  background-color: #ffffff;
  color: var(--pk-text-main);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.view-icon {
  width: 15px;
  height: 15px;
}

/* Schedule Cards Grid (List Mode) */
.schedule-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.schedule-card {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--pk-shadow-sm);
  transition: transform 0.15s ease;
}

.schedule-card-today {
  border-color: var(--pk-primary);
  box-shadow: 0 0 0 2px var(--pk-primary-border);
}

.card-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.day-badge-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.day-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--pk-text-main);
}

.today-indicator {
  font-size: 0.7rem;
  font-weight: 700;
  background-color: #dcfce7;
  color: #15803d;
  padding: 2px 6px;
  border-radius: 4px;
}

.tomorrow-indicator {
  font-size: 0.7rem;
  font-weight: 700;
  background-color: #fef3c7;
  color: #b45309;
  padding: 2px 6px;
  border-radius: 4px;
}

.kategori-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--pk-radius-full);
}

.badge-organik { background-color: #dcfce7; color: #166534; }
.badge-anorganik { background-color: #dbeafe; color: #1e40af; }
.badge-residu { background-color: #f1f5f9; color: #475569; }

.schedule-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 12px;
}

.schedule-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: var(--pk-border-subtle);
  padding: 10px 12px;
  border-radius: var(--pk-radius-sm);
  margin-bottom: 14px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.84rem;
  color: var(--pk-text-muted);
}

.meta-icon {
  font-size: 0.95rem;
}

.prep-instructions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.82rem;
}

.prep-note {
  margin: 0;
  color: var(--pk-text-muted);
  line-height: 1.4;
}

.acceptable-tags,
.non-acceptable-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.tags-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--pk-text-subtle);
}

.item-chip {
  font-size: 0.72rem;
  padding: 2px 6px;
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

/* Calendar Grid View */
.calendar-view-section {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 16px;
  box-shadow: var(--pk-shadow-sm);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day-col {
  border: 1px solid var(--pk-border-subtle);
  border-radius: var(--pk-radius-md);
  padding: 8px;
  background-color: #fafaf9;
  min-height: 220px;
  display: flex;
  flex-direction: column;
}

.calendar-day-today {
  border-color: var(--pk-primary);
  background-color: #ffffff;
  box-shadow: 0 0 0 1px var(--pk-primary);
}

.day-col-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--pk-border-subtle);
  margin-bottom: 8px;
}

.day-col-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--pk-text-main);
}

.col-today-pill {
  font-size: 0.65rem;
  font-weight: 700;
  background-color: #16a34a;
  color: #ffffff;
  padding: 1px 6px;
  border-radius: 4px;
  margin-top: 2px;
}

.day-col-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.col-empty {
  font-size: 0.72rem;
  color: #94a3b8;
  text-align: center;
  margin-top: 30px;
}

.col-pickup-item {
  padding: 6px;
  border-radius: 6px;
  font-size: 0.72rem;
}

.col-item-organik {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.col-item-anorganik {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
}

.col-item-residu {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
}

.col-item-badge {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.65rem;
  margin-bottom: 2px;
}

.col-item-organik .col-item-badge { color: #166534; }
.col-item-anorganik .col-item-badge { color: #1e40af; }
.col-item-residu .col-item-badge { color: #475569; }

.col-item-time {
  display: block;
  font-size: 0.72rem;
  color: var(--pk-text-main);
}

.col-item-name {
  margin: 2px 0 0;
  color: var(--pk-text-muted);
  line-height: 1.2;
}

/* Special Pickup Help (PilahAI Shortcut) */
.special-pickup-help {
  margin-top: 36px;
}

.help-box {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: var(--pk-shadow-sm);
}

.help-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.help-content {
  flex: 1;
}

.help-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 4px;
}

.help-desc {
  font-size: 0.88rem;
  color: var(--pk-text-muted);
  margin: 0;
  line-height: 1.45;
}

.help-btn {
  background-color: var(--pk-primary-light);
  color: var(--pk-primary);
  border: 1px solid var(--pk-primary-border);
  font-size: 0.88rem;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: var(--pk-radius-md);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.help-btn:hover {
  background-color: var(--pk-primary);
  color: #ffffff;
}

/* Empty State */
.empty-state-card {
  text-align: center;
  padding: 40px 20px;
  background-color: var(--pk-surface);
  border: 1px dashed var(--pk-border);
  border-radius: var(--pk-radius-lg);
  color: var(--pk-text-muted);
}

.reset-filter-btn {
  margin-top: 10px;
  background: none;
  border: 1px solid var(--pk-border);
  padding: 6px 14px;
  border-radius: var(--pk-radius-sm);
  color: var(--pk-primary);
  font-weight: 600;
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
  .schedule-cards-grid {
    grid-template-columns: 1fr;
  }

  .calendar-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .calendar-day-col {
    min-height: auto;
  }

  .help-box {
    flex-direction: column;
    align-items: flex-start;
  }

  .help-btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.45rem;
  }

  .upcoming-alert-banner {
    flex-direction: column;
  }
}
</style>
