<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  MAKASSAR_DISTRICTS,
  getDistrictSchedule
} from '@/data/jadwalData'
import { findNearestMakassarDistrict } from '@/data/lokasiData'
import {
  Calendar,
  Crosshair,
  Clock,
  Truck,
  Leaf,
  Recycle,
  Trash2,
  CalendarOff,
  Award,
  CheckCircle2,
  Info,
  Loader2
} from 'lucide-vue-next'

const selectedDistrict = ref('Panakkukang')
const isGpsActive = ref(false)
const isGpsLoading = ref(false)
const gpsStatusText = ref('Makassar')

onMounted(() => {
  try {
    const raw = localStorage.getItem('pilahki_domicile')
    if (raw) {
      const d = JSON.parse(raw)
      if (d.district && MAKASSAR_DISTRICTS.includes(d.district)) {
        selectedDistrict.value = d.district
        gpsStatusText.value = `Kec. ${d.district}`
      }
    }
  } catch (e) {}

  // Dengarkan event pembaruan domisili global
  window.addEventListener('pilahki-domicile-changed', (ev) => {
    if (ev.detail && ev.detail.district && MAKASSAR_DISTRICTS.includes(ev.detail.district)) {
      selectedDistrict.value = ev.detail.district
      gpsStatusText.value = `Kec. ${ev.detail.district}`
    }
  })
})

const daysOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]

const dayNamesIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
const todayName = computed(() => {
  return dayNamesIndo[new Date().getDay()]
})

const weeklySchedule = computed(() => {
  return getDistrictSchedule(selectedDistrict.value)
})

const todaySchedule = computed(() => {
  return (
    weeklySchedule.value.find(
      (item) => item.day.toLowerCase() === todayName.value.toLowerCase()
    ) || weeklySchedule.value[0]
  )
})

const isPickupToday = computed(() => {
  return (
    todaySchedule.value.status.includes('Ada Penjemputan') ||
    todaySchedule.value.status.includes('Penyetoran')
  )
})

const getScheduleIcon = (iconName) => {
  switch (iconName) {
    case 'leaf':
      return Leaf
    case 'recycle':
      return Recycle
    case 'trash-2':
      return Trash2
    case 'award':
      return Award
    case 'calendar-off':
      return CalendarOff
    default:
      return Truck
  }
}

const handleLiveGps = () => {
  if (!navigator.geolocation) {
    alert('Browser Anda tidak mendukung deteksi lokasi Geolocation.')
    return
  }

  isGpsLoading.value = true
  gpsStatusText.value = 'Mendeteksi...'

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      isGpsActive.value = true

      let detectedDistrict = null

      // Coba reverse geocode untuk mendeteksi kecamatan di Makassar
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2500)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
          {
            headers: { 'User-Agent': 'PilahKiApp/1.0' },
            signal: controller.signal
          }
        )
        clearTimeout(timeoutId)
        if (res.ok) {
          const data = await res.json()
          const addr = data.address || {}
          const sub = (addr.suburb || addr.city_district || addr.neighbourhood || addr.village || '').toLowerCase()
          const matched = MAKASSAR_DISTRICTS.find(d => sub.includes(d.toLowerCase()) || d.toLowerCase().includes(sub))
          if (matched) {
            detectedDistrict = matched
          }
        }
      } catch (e) {}

      // Jika reverse geocoding offline atau posisi berada di sekitar titik Makassar
      if (!detectedDistrict) {
        detectedDistrict = findNearestMakassarDistrict(lat, lng)
      }

      selectedDistrict.value = detectedDistrict
      gpsStatusText.value = `Kec. ${detectedDistrict}`
      isGpsLoading.value = false
    },
    (err) => {
      isGpsLoading.value = false
      gpsStatusText.value = 'GPS Gagal'
      alert('Tidak dapat mendeteksi lokasi GPS Anda.')
    },
    { enableHighAccuracy: true, timeout: 8000 }
  )
}
</script>

<template>
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
    <div class="space-y-6">
      
      <!-- Top Title & Live GPS + District Selector -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Pantau Jadwal Angkut Armada</h1>
          <p class="text-xs sm:text-sm text-slate-600">
            Jadwal operasional penjemputan sampah terpilah dan residu DLH Kota Makassar di wilayah Anda.
          </p>
        </div>

        <!-- Live Location & District Selector Controls -->
        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
            <span
              class="w-2 h-2 rounded-full"
              :class="isGpsActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"
            ></span>
            <span>{{ gpsStatusText }}</span>
          </span>

          <button 
            type="button" 
            @click="handleLiveGps"
            :disabled="isGpsLoading"
            :class="[
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer group disabled:opacity-60',
              isGpsActive ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-brand-800 hover:bg-brand-700'
            ]"
            title="Deteksi kecamatan otomatis sesuai titik GPS Anda"
          >
            <Loader2 v-if="isGpsLoading" class="w-4 h-4 animate-spin text-white" />
            <CheckCircle2 v-else-if="isGpsActive" class="w-4 h-4 text-emerald-200" />
            <Crosshair v-else class="w-4 h-4 text-accent-light group-hover:rotate-45 transition-transform" />
            <span>{{ isGpsLoading ? 'Mendeteksi...' : (isGpsActive ? 'Perbarui GPS' : 'Live GPS Saya') }}</span>
          </button>

          <div class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <label for="district-select" class="text-xs font-bold text-slate-500 whitespace-nowrap">Wilayah:</label>
            <select 
              id="district-select"
              v-model="selectedDistrict"
              class="text-xs sm:text-sm font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              <option v-for="d in MAKASSAR_DISTRICTS" :key="d" :value="d">
                Kecamatan {{ d }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Upcoming Pickup Highlight Banner -->
      <div class="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div
              :class="[
                'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border',
                isPickupToday
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/10 text-slate-200 border-white/15'
              ]"
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="isPickupToday ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'"
              ></span>
              <span>Jadwal Terdekat: Hari {{ todaySchedule.day }} (Hari Ini)</span>
            </div>
            
            <h3 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {{ todaySchedule.category }}
            </h3>

            <p class="text-xs sm:text-sm text-brand-100 leading-relaxed max-w-xl">
              <span v-if="isPickupToday">
                Waktu operasional penjemputan: <strong class="text-white">{{ todaySchedule.time }}</strong> menggunakan armada <em class="text-white font-medium">{{ todaySchedule.vehicle }}</em>.
              </span>
              <span v-else>
                {{ todaySchedule.notes }}
              </span>
            </p>
          </div>

          <!-- Quick Tip Box inside Banner -->
          <div class="bg-white/10 border border-white/15 rounded-2xl p-4 sm:p-5 max-w-sm shrink-0 space-y-1">
            <span class="text-[11px] uppercase font-bold text-accent-light tracking-wider flex items-center gap-1.5">
              <Info class="w-3.5 h-3.5" />
              <span>Petunjuk Warga</span>
            </span>
            <p class="text-xs text-brand-100 leading-relaxed">
              {{ todaySchedule.notes }}
            </p>
          </div>
        </div>
      </div>

      <!-- Subheading & Agenda Table -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <Calendar class="w-5 h-5 text-brand-700" />
            <h2 class="text-base sm:text-lg font-bold text-slate-900">
              Kecamatan {{ selectedDistrict }}, Kota Makassar
            </h2>
          </div>
          <span class="text-xs font-semibold text-slate-400 hidden sm:inline">Agenda Mingguan (Senin s/d Minggu)</span>
        </div>

        <!-- Tabel Agenda Mingguan Minimalis Container -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div class="divide-y divide-slate-100">
            
            <div
              v-for="item in weeklySchedule"
              :key="item.day"
              :class="[
                'p-4 sm:p-5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4',
                item.day.toLowerCase() === todayName.toLowerCase()
                  ? 'bg-brand-50/70 border-l-4 border-brand-600'
                  : 'hover:bg-slate-50/70'
              ]"
            >
              <!-- Left: Day & Status -->
              <div class="flex items-center gap-4 min-w-[180px]">
                <div
                  :class="[
                    'w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-2xs',
                    item.day.toLowerCase() === todayName.toLowerCase()
                      ? 'bg-brand-800 text-white'
                      : item.iconBg
                  ]"
                >
                  <component :is="getScheduleIcon(item.icon)" class="w-4 h-4" />
                </div>

                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-extrabold text-sm sm:text-base text-slate-900">{{ item.day }}</span>
                    <span
                      v-if="item.day.toLowerCase() === todayName.toLowerCase()"
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-800 text-white uppercase tracking-wider"
                    >
                      Hari Ini
                    </span>
                  </div>
                  <div class="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <span :class="['w-2 h-2 rounded-full', item.statusDot]"></span>
                    <span>{{ item.status }}</span>
                  </div>
                </div>
              </div>

              <!-- Middle: Category & Vehicle -->
              <div class="flex-1 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border', item.badge]">
                    {{ item.category }}
                  </span>
                  <span class="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock class="w-3.5 h-3.5 text-slate-400" />
                    <span>{{ item.time }}</span>
                  </span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">
                  Armada: <strong class="text-slate-800">{{ item.vehicle }}</strong>
                </p>
              </div>

              <!-- Right: Operational Notes -->
              <div class="md:max-w-xs text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                {{ item.notes }}
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  </main>
</template>
