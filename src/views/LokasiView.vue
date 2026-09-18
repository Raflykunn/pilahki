<script setup>
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { daftarFasilitas, jenisFasilitasConfig } from '../data/lokasiData'
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

const navigateTo = (path, query = {}) => {
  emit('navigate', { path, query })
  if (router) {
    router.push({ path, query }).catch(() => {})
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

// State Penapis & Carian
const searchQuery = ref('')
const selectedWilayah = ref('semua') // 'semua' | 'Sukajadi' | 'Coblong' | 'Lengkong' | 'Cicendo'
const selectedJenis = ref('semua') // 'semua' | 'bank-sampah' | 'tps-3r' | 'dropbox-b3' | 'tps'
const viewMode = ref('list') // 'list' | 'map'

// State GPS & Lokasi
const isGpsActive = ref(false)
const gpsMessage = ref('')
const isLocating = ref(false)

// Fungsi Aktifkan Lokasi / GPS
const handleActivateGps = () => {
  isLocating.value = true
  gpsMessage.value = 'Mendeteksi posisi perangkat Anda...'

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        isLocating.value = false
        isGpsActive.value = true
        gpsMessage.value = 'Lokasi GPS aktif! Menampilkan fasilitas terurut dari jarak terdekat.'
        setTimeout(() => {
          gpsMessage.value = ''
        }, 4000)
      },
      (err) => {
        isLocating.value = false
        isGpsActive.value = true // Fallback simulasi lokasi terdekat demo
        gpsMessage.value = 'Mode demo: Menggunakan titik koordinat permukiman Sukajadi/Coblong.'
        setTimeout(() => {
          gpsMessage.value = ''
        }, 4000)
      },
      { timeout: 6000 }
    )
  } else {
    isLocating.value = false
    isGpsActive.value = true
    gpsMessage.value = 'Perangkat tidak mendukung GPS, beralih ke lokasi percontohan.'
  }
}

// Senarai Fasiliti yang Ditapis
const filteredFasilitas = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  let list = daftarFasilitas.filter(item => {
    // Penapis wilayah manual
    const matchWilayah = selectedWilayah.value === 'semua' || item.wilayah.toLowerCase() === selectedWilayah.value.toLowerCase()
    if (!matchWilayah) return false

    // Penapis jenis kemudahan
    const matchJenis = selectedJenis.value === 'semua' || item.jenis === selectedJenis.value
    if (!matchJenis) return false

    // Carian teks bebas
    if (!query) return true
    const inName = item.nama.toLowerCase().includes(query)
    const inAddress = item.alamat.toLowerCase().includes(query)
    const inAccepted = item.sampahDiterima.some(s => s.toLowerCase().includes(query))
    const inWilayah = item.kecamatan.toLowerCase().includes(query) || item.kelurahan.toLowerCase().includes(query)
    return inName || inAddress || inAccepted || inWilayah
  })

  // Urutkan mengikut jarak jika GPS aktif atau secara lalai
  return list.sort((a, b) => a.jarakMeter - b.jarakMeter)
})

// Buka Google Maps terus ke alamat fasiliti
const openMaps = (fasilitas) => {
  const query = encodeURIComponent(`${fasilitas.nama}, ${fasilitas.alamat}`)
  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
}

// Hubungi pengurus via WhatsApp
const contactManager = (fasilitas) => {
  const text = encodeURIComponent(`Halo ${fasilitas.namaKontak}, saya ingin bertanya perihal penyetoran sampah di ${fasilitas.nama}.`)
  window.open(`https://wa.me/${fasilitas.kontakWa}?text=${text}`, '_blank')
}

// Pintasan ke PilahAI
const handleOpenAI = (context = '') => {
  emit('open-ai', { query: context })
  navigateTo('/pilah-ai', context ? { q: context } : {})
}
</script>

<template>
  <div class="lokasi-page">
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
              <span class="brand-tagline">Cari Lokasi</span>
            </span>
          </a>
        </div>

        <div class="nav-right">
          <button type="button" class="nav-link-btn" @click="navigateTo('/pilah')">
            <span>Pilah Sampah</span>
          </button>

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
      <!-- Header Tajuk & Kawalan Lokasi -->
      <section class="lokasi-header-section">
        <div class="breadcrumb-nav">
          <a href="/" @click.prevent="navigateTo('/')">Beranda</a>
          <span class="sep">/</span>
          <span class="current">Cari Lokasi</span>
        </div>
        <h1 class="page-title">Lokasi Bank Sampah & TPS Terdekat</h1>
        <p class="page-subtitle">
          Temukan titik penyaluran sampah terpilah resmi di sekitar Anda, jam operasional, dan kontak pengelola.
        </p>

        <!-- Kawalan Lokasi & GPS Bar -->
        <div class="location-toolbar-card">
          <div class="gps-and-search-row">
            <!-- Butang GPS / Lokasi Saya -->
            <button
              type="button"
              class="gps-btn"
              :class="{ 'gps-btn-active': isGpsActive }"
              :disabled="isLocating"
              @click="handleActivateGps"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="gps-svg" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="22" y1="12" x2="18" y2="12" />
                <line x1="6" y1="12" x2="2" y2="12" />
                <line x1="12" y1="6" x2="12" y2="2" />
                <line x1="12" y1="22" x2="12" y2="18" />
              </svg>
              <span>{{ isLocating ? 'Mencari...' : isGpsActive ? 'Lokasi Terdeteksi' : 'Gunakan Lokasi GPS Saya' }}</span>
            </button>

            <!-- Kotak Carian Input -->
            <div class="search-input-group">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="search-svg" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                class="search-input"
                placeholder="Cari nama fasilitas atau jenis sampah (misal: jelantah, baterai, kardus)..."
                aria-label="Cari fasilitas"
              />
              <button
                v-if="searchQuery"
                type="button"
                class="clear-btn"
                aria-label="Hapus teks"
                @click="searchQuery = ''"
              >
                ×
              </button>
            </div>
          </div>

          <!-- Mesej Maklum Balas GPS -->
          <div v-if="gpsMessage" class="gps-status-notice">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="info-notice-svg" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>{{ gpsMessage }}</span>
          </div>

          <!-- Pemilih Wilayah Manual & Mod Tampilan -->
          <div class="toolbar-sub-row">
            <div class="wilayah-select-wrap">
              <label for="wilayah-filter-select" class="select-label">Wilayah:</label>
              <select
                id="wilayah-filter-select"
                v-model="selectedWilayah"
                class="filter-dropdown"
              >
                <option value="semua">Semua Wilayah</option>
                <option value="Sukajadi">Kecamatan Sukajadi</option>
                <option value="Coblong">Kecamatan Coblong</option>
                <option value="Lengkong">Kecamatan Lengkong</option>
                <option value="Cicendo">Kecamatan Cicendo</option>
              </select>
            </div>

            <!-- Togol Tampilan (Daftar / Peta Visual) -->
            <div class="view-mode-toggle">
              <button
                type="button"
                class="toggle-btn"
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                <span>Daftar</span>
              </button>
              <button
                type="button"
                class="toggle-btn"
                :class="{ active: viewMode === 'map' }"
                @click="viewMode = 'map'"
              >
                <span>Peta Wilayah</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Penapis Kategori Jenis Fasiliti -->
        <div class="facility-type-tabs" role="tablist">
          <button
            type="button"
            class="tab-btn"
            :class="{ active: selectedJenis === 'semua' }"
            @click="selectedJenis = 'semua'"
          >
            Semua ({{ daftarFasilitas.length }})
          </button>
          <button
            type="button"
            class="tab-btn tab-blue"
            :class="{ active: selectedJenis === 'bank-sampah' }"
            @click="selectedJenis = 'bank-sampah'"
          >
            <span class="tab-dot dot-blue" aria-hidden="true"></span>
            Bank Sampah
          </button>
          <button
            type="button"
            class="tab-btn tab-green"
            :class="{ active: selectedJenis === 'tps-3r' }"
            @click="selectedJenis = 'tps-3r'"
          >
            <span class="tab-dot dot-green" aria-hidden="true"></span>
            TPS 3R (Kompos)
          </button>
          <button
            type="button"
            class="tab-btn tab-amber"
            :class="{ active: selectedJenis === 'dropbox-b3' }"
            @click="selectedJenis = 'dropbox-b3'"
          >
            <span class="tab-dot dot-amber" aria-hidden="true"></span>
            Drop Box B3 / E-Waste
          </button>
          <button
            type="button"
            class="tab-btn tab-slate"
            :class="{ active: selectedJenis === 'tps' }"
            @click="selectedJenis = 'tps'"
          >
            <span class="tab-dot dot-slate" aria-hidden="true"></span>
            TPS Reguler
          </button>
        </div>
      </section>

      <!-- Paparan 1: Senarai Kad Fasiliti (List Mode) -->
      <section v-if="viewMode === 'list'" class="facility-list-section">
        <div class="section-meta-bar">
          <span class="found-text">Menemukan <strong>{{ filteredFasilitas.length }} fasilitas</strong> di sekitar Anda</span>
          <span class="sort-text">Diurutkan berdasarkan jarak terdekat</span>
        </div>

        <div v-if="filteredFasilitas.length === 0" class="no-facility-box">
          <p>Tidak ada fasilitas yang sesuai dengan filter atau kata kunci "{{ searchQuery }}".</p>
          <button type="button" class="reset-filter-btn" @click="selectedJenis = 'semua'; selectedWilayah = 'semua'; searchQuery = ''">
            Reset Semua Filter
          </button>
        </div>

        <div v-else class="facility-grid">
          <article
            v-for="item in filteredFasilitas"
            :key="item.id"
            class="facility-card"
            :class="'card-border-' + item.jenis"
          >
            <!-- Badge Jenis & Jarak -->
            <div class="card-top-row">
              <div class="badge-group">
                <span class="facility-type-badge" :class="jenisFasilitasConfig[item.jenis].badgeClass">
                  {{ jenisFasilitasConfig[item.jenis].label }}
                </span>
                <span v-if="item.bisaTukarUang" class="reward-badge">
                  Bernilai Rupiah
                </span>
              </div>
              <span class="distance-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="pin-svg" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{{ item.jarakMeter < 1000 ? `${item.jarakMeter} m` : `${(item.jarakMeter / 1000).toFixed(1)} km` }}</span>
              </span>
            </div>

            <!-- Nama & Alamat -->
            <h2 class="facility-name">{{ item.nama }}</h2>
            <p class="facility-address">
              {{ item.alamat }} ({{ item.kelurahan }}, {{ item.kecamatan }})
            </p>

            <!-- Jam Operasional -->
            <div class="info-row operational-hours-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="clock-svg" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div class="info-text">
                <strong>Jam Operasional:</strong>
                <p>{{ item.jamOperasional }}</p>
              </div>
            </div>

            <!-- Jenis Sampah Diterima -->
            <div class="waste-types-group">
              <strong class="waste-label accepted-label">
                <span class="icon-check">✓</span> Sampah yang Diterima:
              </strong>
              <div class="chips-container">
                <span v-for="s in item.sampahDiterima" :key="s" class="waste-chip chip-accepted">
                  {{ s }}
                </span>
              </div>
            </div>

            <!-- Jenis Sampah Ditolak -->
            <div v-if="item.sampahDitolak.length" class="waste-types-group">
              <strong class="waste-label rejected-label">
                <span class="icon-cross">✕</span> Jangan Dibawa ke Sini:
              </strong>
              <div class="chips-container">
                <span v-for="td in item.sampahDitolak" :key="td" class="waste-chip chip-rejected">
                  {{ td }}
                </span>
              </div>
            </div>

            <!-- Catatan Warga -->
            <div class="facility-note">
              <span><strong>Catatan:</strong> {{ item.catatan }}</span>
            </div>

            <!-- Tindakan Kad: Buka Peta & Hubungi WA -->
            <div class="card-actions-row">
              <button
                type="button"
                class="action-map-btn"
                @click="openMaps(item)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-svg" aria-hidden="true">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                <span>Petunjuk Arah</span>
              </button>
              <button
                type="button"
                class="action-wa-btn"
                @click="contactManager(item)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-svg" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>WhatsApp Pengurus</span>
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- Paparan 2: Peta Wilayah Interaktif (Visual Map Mode) -->
      <section v-else class="map-visual-section">
        <div class="map-container-card">
          <div class="map-header">
            <div class="map-title-info">
              <h3 class="map-heading">Peta Persebaran Fasilitas Demo Wilayah</h3>
              <p class="map-sub">Klik salah satu titik pin di peta untuk melihat alamat dan jam buka langsung.</p>
            </div>
            <span class="map-pin-legend">
              <span class="legend-item"><span class="legend-dot dot-blue"></span> Bank Sampah</span>
              <span class="legend-item"><span class="legend-dot dot-green"></span> TPS 3R</span>
              <span class="legend-item"><span class="legend-dot dot-amber"></span> Drop Box B3</span>
            </span>
          </div>

          <!-- Visual Map Canvas / Pins Grid -->
          <div class="interactive-map-area">
            <div class="map-grid-overlay">
              <div
                v-for="item in filteredFasilitas"
                :key="'pin-' + item.id"
                class="map-pin-marker"
                :class="'pin-' + jenisFasilitasConfig[item.jenis].warna"
                :title="item.nama"
                @click="openMaps(item)"
              >
                <span class="pin-popup-label">{{ item.nama }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bantuan PilahAI untuk Penyaluran Khas -->
      <section class="facility-ai-helper">
        <div class="helper-box">
          <div class="helper-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="helper-svg">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div class="helper-content">
            <h3 class="helper-title">Ragu Apakah Sampah Anda Diterima di Fasilitas Ini?</h3>
            <p class="helper-desc">
              Punya barang yang tidak tercantum di daftar di atas? Tanyakan ke PilahAI untuk mencocokkan jenis sampah Anda dengan fasilitas penerima yang tepat.
            </p>
          </div>
          <button
            type="button"
            class="helper-btn"
            @click="handleOpenAI('Apakah sampah saya bisa disetor ke bank sampah atau TPS terdekat?')"
          >
            Tanya PilahAI Langsung
          </button>
        </div>
      </section>
    </main>

    <!-- Footer Ringkas -->
    <footer class="page-footer">
      <div class="footer-container">
        <p>© 2024 Pilahki — Akses Titik Pengelolaan Sampah Kota Berkelanjutan (SDG 11).</p>
      </div>
    </footer>

    <!-- Auth Modal jika Tetamu ingin log masuk -->
    <AuthModal
      :is-open="isAuthModalOpen"
      title="Masuk ke Pilahki"
      subtitle="Masuk untuk mencatat saldo bank sampah dan menyimpan fasilitas favorit."
      @close="isAuthModalOpen = false"
    />
  </div>
</template>

<style scoped>
/* ==========================================================================
   Design Tokens & CSS LokasiView
   ========================================================================== */
.lokasi-page {
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

.lokasi-page *,
.lokasi-page *::before,
.lokasi-page *::after {
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

.lokasi-hero {
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

/* Location Toolbar Card */
.location-toolbar-card {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 18px;
  box-shadow: var(--pk-shadow-sm);
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gps-and-search-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.gps-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--pk-primary-light);
  color: var(--pk-primary);
  border: 1px solid var(--pk-primary-border);
  font-size: 0.88rem;
  font-weight: 600;
  padding: 9px 16px;
  border-radius: var(--pk-radius-md);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.gps-btn:hover:not(:disabled) {
  background-color: var(--pk-primary);
  color: #ffffff;
}

.gps-btn-active {
  background-color: var(--pk-primary);
  color: #ffffff;
}

.search-input-group {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: var(--pk-radius-md);
  padding: 0 12px;
  gap: 8px;
  min-width: 260px;
}

.search-icon {
  font-size: 0.95rem;
}

.search-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.9rem;
  padding: 9px 0;
  color: var(--pk-text-main);
}

.clear-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--pk-text-subtle);
  cursor: pointer;
  line-height: 1;
}

.gps-status-notice {
  font-size: 0.82rem;
  color: var(--pk-primary);
  background-color: var(--pk-primary-light);
  padding: 6px 12px;
  border-radius: var(--pk-radius-sm);
}

.toolbar-sub-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  border-top: 1px solid var(--pk-border-subtle);
  padding-top: 12px;
}

.wilayah-select-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.select-label {
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--pk-text-main);
}

.filter-dropdown {
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: var(--pk-radius-sm);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--pk-text-main);
  background-color: #ffffff;
  outline: none;
  cursor: pointer;
}

.view-mode-toggle {
  display: flex;
  align-items: center;
  background-color: #e2e8f0;
  padding: 2px;
  border-radius: var(--pk-radius-sm);
  gap: 2px;
}

.toggle-btn {
  border: none;
  background: none;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--pk-text-subtle);
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.toggle-btn.active {
  background-color: #ffffff;
  color: var(--pk-text-main);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

/* Facility Type Tabs */
.facility-type-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.tab-btn {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  color: var(--pk-text-muted);
  font-size: 0.82rem;
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

.tab-blue.active { background-color: #2563eb; border-color: #2563eb; }
.tab-green.active { background-color: #16a34a; border-color: #16a34a; }
.tab-amber.active { background-color: #d97706; border-color: #d97706; }
.tab-slate.active { background-color: #475569; border-color: #475569; }

/* ==========================================================================
   Section: Facility List (Cards)
   ========================================================================== */
.facility-list-section {
  margin-bottom: 40px;
}

.section-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 0.85rem;
  color: var(--pk-text-muted);
}

.sorted-hint {
  color: var(--pk-primary);
  font-weight: 600;
  font-size: 0.8rem;
}

.facility-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.facility-card {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 22px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--pk-shadow-sm);
  transition: border-color 0.15s;
}

.facility-card:hover {
  border-color: #cbd5e1;
}

.card-border-blue { border-top: 4px solid #2563eb; }
.card-border-green { border-top: 4px solid #16a34a; }
.card-border-amber { border-top: 4px solid #d97706; }
.card-border-slate { border-top: 4px solid #475569; }

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 6px;
}

.badge-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.facility-type-badge {
  font-size: 0.74rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--pk-radius-full);
}

.badge-blue { background-color: #dbeafe; color: #1e40af; }
.badge-green { background-color: #dcfce7; color: #166534; }
.badge-amber { background-color: #fef3c7; color: #b45309; }
.badge-slate { background-color: #f1f5f9; color: #475569; }

.reward-badge {
  font-size: 0.7rem;
  font-weight: 700;
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  padding: 2px 6px;
  border-radius: 4px;
}

.distance-pill {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--pk-primary);
  background-color: var(--pk-primary-light);
  padding: 2px 8px;
  border-radius: var(--pk-radius-sm);
}

.facility-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 4px;
  line-height: 1.3;
}

.facility-address {
  font-size: 0.85rem;
  color: var(--pk-text-muted);
  margin: 0 0 14px;
}

.operational-hours-box {
  background-color: var(--pk-border-subtle);
  border-radius: var(--pk-radius-sm);
  padding: 8px 12px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 14px;
}

.info-icon {
  font-size: 1rem;
}

.info-text strong {
  display: block;
  font-size: 0.78rem;
  color: var(--pk-text-main);
}

.info-text p {
  margin: 0;
  font-size: 0.82rem;
  color: var(--pk-text-muted);
}

.waste-types-group {
  margin-bottom: 10px;
}

.waste-label {
  display: block;
  font-size: 0.76rem;
  margin-bottom: 4px;
}

.accepted-label { color: #166534; }
.rejected-label { color: #991b1b; }

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.waste-chip {
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

.facility-note {
  font-size: 0.78rem;
  color: #92400e;
  background-color: #fffbeb;
  border: 1px solid #fef3c7;
  padding: 8px 10px;
  border-radius: var(--pk-radius-sm);
  margin-top: 10px;
  margin-bottom: 16px;
  line-height: 1.35;
}

/* Card Actions */
.card-actions-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  border-top: 1px solid var(--pk-border-subtle);
  padding-top: 14px;
}

.action-map-btn {
  flex: 1;
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  font-size: 0.84rem;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: var(--pk-radius-sm);
  cursor: pointer;
  text-align: center;
  transition: background-color 0.15s;
}

.action-map-btn:hover {
  background-color: var(--pk-primary-hover);
}

.action-wa-btn {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  color: var(--pk-text-main);
  font-size: 0.84rem;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: var(--pk-radius-sm);
  cursor: pointer;
  text-align: center;
  transition: background-color 0.15s;
}

.action-wa-btn:hover {
  background-color: var(--pk-border-subtle);
}

/* ==========================================================================
   Section: Map Visual Mode
   ========================================================================== */
.map-visual-section {
  margin-bottom: 40px;
}

.map-container-card {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 20px;
  box-shadow: var(--pk-shadow-sm);
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}

.map-heading {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 2px;
}

.map-sub {
  font-size: 0.82rem;
  color: var(--pk-text-muted);
  margin: 0;
}

.map-pin-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.78rem;
  color: var(--pk-text-subtle);
}

.interactive-map-area {
  height: 380px;
  background-color: #f1f5f9;
  border-radius: var(--pk-radius-md);
  border: 1px solid var(--pk-border);
  position: relative;
  overflow: hidden;
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-grid-overlay {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  padding: 24px;
  max-width: 800px;
}

.map-pin-marker {
  background-color: #ffffff;
  border: 1px solid var(--pk-border);
  padding: 8px 12px;
  border-radius: var(--pk-radius-md);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.map-pin-marker:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -2px rgba(0,0,0,0.15);
}

.pin-icon {
  font-size: 1.2rem;
}

.pin-popup-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--pk-text-main);
}

/* AI Helper */
.facility-ai-helper {
  margin-top: 20px;
}

.helper-box {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  padding: 22px 24px;
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
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--pk-text-main);
  margin: 0 0 4px;
}

.helper-desc {
  font-size: 0.86rem;
  color: var(--pk-text-muted);
  margin: 0;
  line-height: 1.45;
}

.helper-btn {
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

.helper-btn:hover {
  background-color: var(--pk-primary);
  color: #ffffff;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  background-color: var(--pk-surface);
  border: 1px dashed var(--pk-border);
  border-radius: var(--pk-radius-lg);
  color: var(--pk-text-muted);
}

.reset-search-btn {
  margin-top: 8px;
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
  .facility-grid {
    grid-template-columns: 1fr;
  }

  .gps-and-search-row {
    flex-direction: column;
    align-items: stretch;
  }

  .gps-btn {
    justify-content: center;
  }

  .toolbar-sub-row {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .view-mode-toggle {
    justify-content: center;
  }

  .helper-box {
    flex-direction: column;
    align-items: flex-start;
  }

  .helper-btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.45rem;
  }

  .card-actions-row {
    flex-direction: column;
  }

  .action-map-btn,
  .action-wa-btn {
    width: 100%;
  }
}
</style>
