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
  CheckCircle2,
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

      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Pantau Jadwal Angkut Armada</h1>
          <p class="text-xs sm:text-sm text-slate-600">
            Jadwal operasional penjemputan sampah terpilah dan residu DLH Kota Makassar di wilayah Anda.
          </p>
        </div>

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
        </div>
      </div>

      <div class="bg-gradient-to-r from-brand-950 via-brand-900 to-[#0e2a1d] text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-200 border border-white/15">
                <Clock class="w-3.5 h-3.5 text-emerald-300" />
                <span>Jadwal Hari Ini: {{ todaySchedule.day }}</span>
              </span>
              <span
                v-if="isPickupToday"
                class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              >
                Ada Penjemputan
              </span>
              <span
                v-else
                class="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-300 border border-white/10"
              >
                Tidak Ada Penjemputan
              </span>
            </div>

            <div class="space-y-1">
              <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {{ todaySchedule.category }}
              </h2>
              <p class="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                <span v-if="isPickupToday">
                  Operasional penjemputan armada <strong class="text-white font-bold">{{ todaySchedule.vehicle }}</strong>. {{ todaySchedule.notes }}
                </span>
                <span v-else>
                  {{ todaySchedule.notes }}
                </span>
              </p>
            </div>
          </div>

          <div
            v-if="isPickupToday"
            class="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-center gap-1 shrink-0 p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/15"
          >
            <span class="text-[11px] font-semibold text-emerald-200/80 uppercase tracking-wider">Jam Operasional</span>
            <span class="text-lg sm:text-xl font-extrabold text-white">{{ todaySchedule.time }}</span>
          </div>
        </div>
      </div>

      <div class="space-y-3 pt-2">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <Calendar class="w-5 h-5 text-brand-700" />
            <h2 class="text-base sm:text-lg font-bold text-slate-900">
              Kecamatan {{ selectedDistrict }}, Kota Makassar
            </h2>
          </div>
          <span class="text-xs font-semibold text-slate-400 hidden sm:inline">Agenda Mingguan (Senin s/d Minggu)</span>
        </div>

        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div class="divide-y divide-slate-100">
            
            <div
              v-for="item in weeklySchedule"
              :key="item.day"
              :class="[
                'p-5 sm:py-6 sm:px-8 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 text-left',
                item.category.toLowerCase().includes('tabungan')
                  ? 'bg-emerald-50/60 border-l-4 border-l-emerald-600 hover:bg-emerald-50/80'
                  : 'hover:bg-slate-50/60'
              ]"
            >
              
              <div class="md:w-36 shrink-0 space-y-0.5">
                <span
                  :class="[
                    'font-bold text-base block',
                    item.category.toLowerCase().includes('tabungan') ? 'text-emerald-950' : 'text-slate-900'
                  ]"
                >
                  {{ item.day }}
                </span>
                <span
                  :class="[
                    'text-xs block',
                    item.category.toLowerCase().includes('tabungan') ? 'text-emerald-700 font-medium' : 'text-slate-500'
                  ]"
                >
                  {{ item.status }}
                </span>
              </div>

              <div class="flex-1 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3
                    :class="[
                      'text-sm sm:text-base font-bold',
                      item.category.toLowerCase().includes('tabungan')
                        ? 'text-emerald-950'
                        : 'text-slate-800'
                    ]"
                  >
                    {{ item.category }}
                  </h3>
                  <span
                    v-if="item.category.toLowerCase().includes('tabungan')"
                    class="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"
                  >
                    Setor Tabungan
                  </span>
                </div>
                <p
                  :class="[
                    'text-xs leading-relaxed max-w-xl',
                    item.category.toLowerCase().includes('tabungan') ? 'text-emerald-800/90' : 'text-slate-500'
                  ]"
                >
                  {{ item.notes }}
                </p>
              </div>

              <div
                :class="[
                  'md:w-56 md:text-right shrink-0 space-y-1 pt-2 md:pt-0 border-t md:border-t-0',
                  item.category.toLowerCase().includes('tabungan') ? 'border-emerald-100' : 'border-slate-100'
                ]"
              >
                <div
                  :class="[
                    'inline-flex md:flex md:justify-end items-center gap-1.5 text-xs sm:text-sm font-bold',
                    item.category.toLowerCase().includes('tabungan') ? 'text-emerald-900' : 'text-slate-900'
                  ]"
                >
                  <Clock
                    class="w-3.5 h-3.5 shrink-0"
                    :class="item.category.toLowerCase().includes('tabungan') ? 'text-emerald-600' : 'text-slate-400'"
                  />
                  <span>{{ item.time }}</span>
                </div>
                <p
                  :class="[
                    'text-xs',
                    item.category.toLowerCase().includes('tabungan') ? 'text-emerald-700 font-medium' : 'text-slate-500'
                  ]"
                >
                  {{ item.vehicle }}
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  </main>
</template>
