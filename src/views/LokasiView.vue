<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import {
  makassarFacilities,
  MAKASSAR_CENTER,
  getNearbyFacilitiesForCoords,
  calculateDistance
} from '@/data/lokasiData'
import {
  Crosshair,
  Locate,
  Search,
  Clock,
  Navigation,
  MapPin,
  CheckCircle2,
  Loader2,
  MapPinOff
} from 'lucide-vue-next'

const mapContainer = ref(null)
let leafletMap = null
let markersGroup = null
let userMarker = null
const markersById = {}

const searchQuery = ref('')
const selectedType = ref('semua')
const isGpsActive = ref(false)
const isGpsLoading = ref(false)
const gpsStatusText = ref('Makassar')
const locationLabel = ref('Kota Makassar (Pusat Kota)')
const userLocation = ref({ lat: MAKASSAR_CENTER.lat, lng: MAKASSAR_CENTER.lng })
const activeFacilityId = ref(null)

// Dataset fasilitas yang sedang aktif (dimulai dari Makassar, lalu adaptif via GPS)
const currentFacilities = ref(makassarFacilities.map(f => ({ ...f })))

const facilityTypes = [
  { id: 'semua', label: 'Semua' },
  { id: 'bank_sampah', label: 'Bank Sampah' },
  { id: 'tps_3r', label: 'TPS 3R' },
  { id: 'tpa', label: 'TPA' }
]

const facilitiesWithDistance = computed(() => {
  return currentFacilities.value.map((fac) => {
    const dist = calculateDistance(
      userLocation.value.lat,
      userLocation.value.lng,
      fac.lat,
      fac.lng
    )
    return {
      ...fac,
      distanceKm: dist
    }
  })
})

const filteredFacilities = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const type = selectedType.value

  let list = facilitiesWithDistance.value.filter((fac) => {
    // Dukung alias bila ada data lama
    const facType = (fac.type === 'drop_box_b3' ? 'tpa' : fac.type)
    const matchType = type === 'semua' || facType === type
    if (!matchType) return false

    if (!q) return true

    const matchName = fac.name.toLowerCase().includes(q)
    const matchAddress = fac.address.toLowerCase().includes(q)
    const matchDistrict = fac.district.toLowerCase().includes(q)
    const matchAccepted = fac.accepted?.some((a) => a.toLowerCase().includes(q))

    return matchName || matchAddress || matchDistrict || matchAccepted
  })

  // Urutkan selalu dari yang terdekat jika GPS aktif
  if (isGpsActive.value) {
    list.sort((a, b) => a.distanceKm - b.distanceKm)
  }

  return list
})

const formatDistance = (dist) => {
  if (dist < 1) {
    return `${Math.round(dist * 1000)} m`
  }
  return `${dist.toFixed(1)} km`
}

const createPinIcon = (type, typeName) => {
  let bgColor = '#133826' // Bank Sampah
  let labelLetter = 'B'

  if (type === 'tps_3r') {
    bgColor = '#0f766e'
    labelLetter = 'T'
  } else if (type === 'tpa' || type === 'drop_box_b3') {
    bgColor = '#d97706'
    labelLetter = 'A'
  }

  return L.divIcon({
    className: 'custom-facility-pin',
    html: `
      <div style="
        background-color: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 800;
        font-size: 12px;
        font-family: 'Plus Jakarta Sans', sans-serif;
      ">
        ${labelLetter}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  })
}

const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-pin',
    html: `
      <div style="
        background-color: #2563eb;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 3px solid #ffffff;
        box-shadow: 0 0 0 5px rgba(37,99,235,0.28);
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14]
  })
}

const initMap = () => {
  if (!mapContainer.value) return

  leafletMap = L.map(mapContainer.value, {
    center: [MAKASSAR_CENTER.lat, MAKASSAR_CENTER.lng],
    zoom: 13,
    zoomControl: true,
    scrollWheelZoom: false
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(leafletMap)

  markersGroup = L.layerGroup().addTo(leafletMap)

  // Pasang user marker default
  userMarker = L.marker([userLocation.value.lat, userLocation.value.lng], {
    icon: createUserIcon()
  }).addTo(leafletMap)

  updateMapMarkers()
}

const updateMapMarkers = () => {
  if (!markersGroup || !leafletMap) return
  markersGroup.clearLayers()
  Object.keys(markersById).forEach((key) => delete markersById[key])

  const bounds = L.latLngBounds([[userLocation.value.lat, userLocation.value.lng]])

  filteredFacilities.value.forEach((fac) => {
    const pin = createPinIcon(fac.type, fac.typeName)
    const formattedDist = formatDistance(fac.distanceKm)

    const marker = L.marker([fac.lat, fac.lng], { icon: pin })
      .bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 800; background: #f1f5f9; color: #334155; padding: 2px 8px; border-radius: 9999px;">
              ${fac.typeName}
            </span>
            <span style="font-size: 11px; font-weight: 800; color: #133826; background: #e1f0e7; padding: 2px 8px; border-radius: 6px;">
              ${formattedDist}
            </span>
          </div>
          <h4 style="font-weight: 800; font-size: 13px; color: #0d261a; margin: 4px 0 2px 0;">${fac.name}</h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0; line-height: 1.4;">${fac.address}</p>
          <div style="padding-top: 6px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 10px; color: #64748b;">${fac.operatingHours}</span>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}" target="_blank" rel="noopener noreferrer" style="color: #133826; font-size: 11px; font-weight: 800; text-decoration: none;">
              Rute &rarr;
            </a>
          </div>
        </div>
      `)
      .addTo(markersGroup)

    marker.on('click', () => {
      activeFacilityId.value = fac.id
      scrollToCard(fac.id)
    })

    markersById[fac.id] = marker
    bounds.extend([fac.lat, fac.lng])
  })

  // Sesuaikan batas peta
  if (filteredFacilities.value.length > 0 && isGpsActive.value) {
    leafletMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
  }
}

const scrollToCard = (id) => {
  const el = document.getElementById(`facility-card-${id}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const focusFacility = (fac) => {
  activeFacilityId.value = fac.id
  if (leafletMap) {
    leafletMap.flyTo([fac.lat, fac.lng], 16, { duration: 1 })
    setTimeout(() => {
      if (markersById[fac.id]) {
        markersById[fac.id].openPopup()
      }
    }, 1050)
  }
}

const centerMap = () => {
  if (leafletMap) {
    leafletMap.flyTo([userLocation.value.lat, userLocation.value.lng], 14, { duration: 1 })
  }
}

// Live GPS Handler dengan Reverse Geocoding OSM Nominatim
const handleLiveGps = async () => {
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

      userLocation.value = { lat, lng }
      isGpsActive.value = true

      // 1. Reverse-geocode via OpenStreetMap Nominatim (dengan batas timeout 2.5s)
      let addressInfo = null
      let districtName = ''
      let cityName = ''

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
          addressInfo = data.address || null
        }
      } catch (e) {
        console.warn('[LokasiView] Reverse geocode timeout/offline, gunakan fallback posisi.')
      }

      if (addressInfo) {
        districtName =
          addressInfo.suburb ||
          addressInfo.city_district ||
          addressInfo.village ||
          addressInfo.neighbourhood ||
          addressInfo.town ||
          ''
        cityName =
          addressInfo.city ||
          addressInfo.town ||
          addressInfo.county ||
          addressInfo.municipality ||
          ''
      }

      if (districtName && cityName) {
        locationLabel.value = `${districtName}, ${cityName}`
        gpsStatusText.value = districtName
      } else if (cityName) {
        locationLabel.value = cityName
        gpsStatusText.value = cityName
      } else {
        locationLabel.value = 'Titik Presisi GPS Anda'
        gpsStatusText.value = 'GPS Terkunci'
      }

      // 2. Perbarui dataset fasilitas (Makassar atau localized sekitar koordinat)
      currentFacilities.value = getNearbyFacilitiesForCoords(lat, lng, addressInfo, districtName, cityName)

      // 3. Perbarui posisi pin user di Leaflet
      if (leafletMap) {
        if (userMarker) {
          userMarker.setLatLng([lat, lng])
        } else {
          userMarker = L.marker([lat, lng], { icon: createUserIcon() }).addTo(leafletMap)
        }
        leafletMap.flyTo([lat, lng], 14, { duration: 1.2 })
      }

      isGpsLoading.value = false
      updateMapMarkers()
    },
    (err) => {
      isGpsLoading.value = false
      gpsStatusText.value = 'GPS Gagal'
      let msg = 'Tidak dapat mendeteksi lokasi GPS Anda.'
      if (err.code === 1) {
        msg = 'Izin akses lokasi GPS ditolak oleh browser. Silakan izinkan akses lokasi pada peramban Anda.'
      }
      alert(msg)
    },
    { enableHighAccuracy: true, timeout: 8000 }
  )
}

onMounted(() => {
  nextTick(() => {
    initMap()
  })
})

onUnmounted(() => {
  if (leafletMap) {
    leafletMap.remove()
  }
})
</script>

<template>
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-left">
    
    <!-- Top Header Bar: Title, Live GPS Status & Action -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Fasilitas Pengelolaan Sampah</h1>
        <p class="text-xs sm:text-sm text-slate-600">
          Menampilkan titik Bank Sampah, TPS 3R, dan TPA terdekat dari lokasi Anda ({{ locationLabel }}).
        </p>
      </div>

      <!-- Live GPS Trigger Button -->
      <div class="flex items-center gap-3 shrink-0">
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
            isGpsActive
              ? 'bg-emerald-700 hover:bg-emerald-800'
              : 'bg-brand-800 hover:bg-brand-700'
          ]"
          title="Kunci posisi presisi Anda via Live GPS browser"
        >
          <Loader2 v-if="isGpsLoading" class="w-4 h-4 animate-spin text-white" />
          <CheckCircle2 v-else-if="isGpsActive" class="w-4 h-4 text-emerald-200" />
          <Crosshair v-else class="w-4 h-4 text-accent-light group-hover:rotate-45 transition-transform" />
          <span>{{ isGpsLoading ? 'Mendeteksi...' : (isGpsActive ? 'Perbarui GPS' : 'Live GPS Saya') }}</span>
        </button>
      </div>
    </div>

    <!-- Split-Screen Grid: MAP DI KIRI (lg:col-span-7), FILTER & CARDS DI KANAN (lg:col-span-5) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      
      <!-- ================= KIRI: PETA INTERAKTIF (STICKY ON DESKTOP) ================= -->
      <div class="lg:col-span-7 space-y-3 lg:sticky lg:top-28">
        
        <div class="flex items-center justify-between px-1">
          <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Peta Interaktif Titik Sampah</span>

          <button 
            type="button" 
            @click="centerMap"
            class="text-xs font-bold text-brand-800 hover:text-brand-900 inline-flex items-center gap-1.5 cursor-pointer hover:underline"
            title="Pusatkan kamera peta ke titik lokasi saya"
          >
            <Locate class="w-3.5 h-3.5" />
            <span>Pusatkan</span>
          </button>
        </div>

        <!-- Leaflet Map Container -->
        <div 
          ref="mapContainer"
          class="h-[380px] sm:h-[460px] lg:h-[calc(100vh-14rem)] w-full rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden relative z-10 bg-slate-100"
          style="isolation: isolate;"
        >
        </div>

        <!-- Map Legend -->
        <div class="flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-600 px-4 py-2.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div class="flex flex-wrap items-center gap-4 text-[11px] font-medium">
            <div class="flex items-center gap-1.5 font-bold text-blue-700">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-200"></span>
              <span>Posisi Anda</span>
            </div>
            <div class="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
              <span>Bank Sampah</span>
            </div>
            <div class="flex items-center gap-1.5 text-teal-800 font-semibold">
              <span class="w-2.5 h-2.5 rounded-full bg-teal-700"></span>
              <span>TPS 3R</span>
            </div>
            <div class="flex items-center gap-1.5 text-amber-800 font-semibold">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <span>TPA</span>
            </div>
          </div>
          <span class="text-[11px] text-slate-400 hidden xl:inline">Klik pin peta untuk rute & detail</span>
        </div>

      </div>

      <!-- ================= KANAN: PENCARIAN, FILTER & DAFTAR KARTU ================= -->
      <div class="lg:col-span-5 space-y-4">
        
        <!-- Search Input -->
        <div class="relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery"
            @input="updateMapMarkers"
            type="text" 
            placeholder="Cari nama fasilitas, jalan, atau sampah..." 
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 bg-white"
          />
        </div>

        <!-- Filter Category Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            v-for="ft in facilityTypes"
            :key="ft.id"
            type="button"
            @click="selectedType = ft.id; updateMapMarkers()"
            :class="[
              'px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer',
              selectedType === ft.id
                ? 'bg-brand-800 text-white font-bold shadow-xs'
                : 'bg-white text-slate-700 font-semibold border border-slate-200 hover:border-brand-300 hover:text-brand-800'
            ]"
          >
            {{ ft.label }}
          </button>
        </div>

        <!-- Count Indicator -->
        <div class="flex items-center justify-between text-xs text-slate-500 px-1">
          <span class="font-bold text-slate-700">Ditemukan {{ filteredFacilities.length }} Fasilitas</span>
          <span v-if="isGpsActive" class="text-brand-700 font-medium">Diurutkan terdekat dari titik GPS</span>
        </div>

        <!-- Facility Cards List -->
        <div v-if="filteredFacilities.length > 0" class="space-y-4">
          <div
            v-for="fac in filteredFacilities"
            :key="fac.id"
            :id="`facility-card-${fac.id}`"
            @click="focusFacility(fac)"
            :class="[
              'group bg-white border rounded-2xl p-6 transition-all duration-200 cursor-pointer text-left space-y-4',
              activeFacilityId === fac.id
                ? 'border-brand-700 ring-2 ring-brand-600/20 shadow-md bg-brand-50/10'
                : 'border-slate-200/80 hover:border-brand-300 hover:shadow-md'
            ]"
          >
            <!-- Header: Kategori & Jarak -->
            <div class="flex items-center justify-between gap-2">
              <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border', fac.typeBadge]">
                {{ fac.typeName }}
              </span>

              <div class="flex items-center gap-1.5 text-xs">
                <span v-if="isGpsActive && fac.distanceKm < 2" class="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Terdekat
                </span>
                <span class="px-2.5 py-1 rounded-xl bg-slate-100/80 text-slate-700 text-xs font-bold">
                  {{ formatDistance(fac.distanceKm) }}
                </span>
              </div>
            </div>

            <!-- Konten Utama: Nama Fasilitas & Alamat -->
            <div class="space-y-2">
              <h3 class="text-base font-bold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug">
                {{ fac.name }}
              </h3>

              <div class="space-y-1.5 text-xs text-slate-500">
                <div class="flex items-start gap-2">
                  <MapPin class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span class="leading-relaxed">{{ fac.address }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Clock class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{{ fac.operatingHours }}</span>
                </div>
              </div>
            </div>

            <!-- Footer: Petunjuk Rute Google Maps -->
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-400 text-[11px] group-hover:text-brand-700 transition-colors">
                Klik kartu untuk fokus peta
              </span>

              <a
                :href="`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`"
                target="_blank"
                rel="noopener noreferrer"
                @click.stop
                class="inline-flex items-center gap-1.5 font-bold text-brand-800 hover:text-brand-600 transition-colors group/link cursor-pointer"
                title="Buka petunjuk arah di Google Maps"
              >
                <Navigation class="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                <span class="hover:underline">Petunjuk Rute</span>
              </a>
            </div>

          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-2">
          <MapPinOff class="w-10 h-10 text-slate-400 mx-auto" />
          <p class="text-sm font-bold text-slate-700">Tidak ada fasilitas yang cocok.</p>
          <p class="text-xs text-slate-400">Coba pilih filter "Semua" atau periksa kata kunci pencarian Anda.</p>
        </div>

      </div>

    </div>

  </main>
</template>
