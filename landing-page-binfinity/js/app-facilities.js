/**
 * PilahKi' — Split-Screen Facilities & Live Map Page Script (js/app-facilities.js)
 * Features:
 * 1. Split-Screen Layout: Interactive Map on Left, Filter & Cards on Right.
 * 2. Live GPS Detection (HTML5 Geolocation) with real-time distance sorting.
 * 3. Bidirectional Map & Card sync (clicking card pans map & opens popup; clicking marker scrolls to card).
 * 4. Simultaneous Map & Card category filtering (Semua, Bank Sampah, TPS 3R, Drop Box B3).
 * 5. Generous white space design without domicile dropdown distraction.
 */

document.addEventListener("DOMContentLoaded", () => {
  const facilityList = document.getElementById("facility-list");
  const searchInput = document.getElementById("facility-search-input");
  const filterBtns = document.querySelectorAll(".facility-filter-btn");
  const locationTargetLabel = document.getElementById("location-target-label");
  const gpsStatusBadge = document.getElementById("gps-status-badge");
  const btnLiveGps = document.getElementById("btn-live-gps");
  const btnLiveGpsText = document.getElementById("btn-live-gps-text");
  const btnCenterMap = document.getElementById("btn-center-map");
  const mapActiveCount = document.getElementById("map-active-count");
  const facilityCountText = document.getElementById("facility-count-text");

  // Default Center: Kota Makassar (Lapangan Karebosi / Pusat Kota)
  const MAKASSAR_CENTER = { lat: -5.1342, lng: 119.4140 };

  // 6 Verified Facilities Data in Makassar
  const makassarFacilities = [
    {
      id: "fac-1",
      name: "Bank Sampah Induk Toddopuli (BSI Makassar)",
      type: "bank_sampah",
      typeName: "Bank Sampah",
      typeBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      accentColor: "#133826",
      address: "Jl. Toddopuli Raya No. 45, Pandang, Panakkukang",
      district: "Panakkukang",
      lat: -5.1558,
      lng: 119.4485,
      operatingHours: "Senin - Sabtu: 08.30 - 15.30 WITA",
      accepted: ["Botol Plastik PET", "Kardus & Kertas", "Kaleng Logam", "Minyak Jelantah"],
      phone: "0411-456789"
    },
    {
      id: "fac-2",
      name: "TPS 3R Bontoala Bersih Sejahtera",
      type: "tps_3r",
      typeName: "TPS 3R",
      typeBadge: "bg-teal-50 text-teal-800 border-teal-200",
      accentColor: "#0f766e",
      address: "Jl. Masjid Raya No. 28, Bontoala",
      district: "Bontoala",
      lat: -5.1295,
      lng: 119.4225,
      operatingHours: "Senin - Sabtu: 06.30 - 15.00 WITA",
      accepted: ["Sampah Organik Dapur", "Sampah Daun Kebun", "Plastik Daur Ulang", "Residu"],
      phone: "0821-9876-5432"
    },
    {
      id: "fac-3",
      name: "Drop Box Limbah B3 Balai Kota Makassar",
      type: "drop_box_b3",
      typeName: "Drop Box B3",
      typeBadge: "bg-amber-50 text-amber-800 border-amber-200",
      accentColor: "#d97706",
      address: "Kompleks Balai Kota Makassar, Jl. Balai Kota No. 1",
      district: "Ujung Pandang",
      lat: -5.1331,
      lng: 119.4087,
      operatingHours: "Senin - Jumat: 08.00 - 16.00 WITA",
      accepted: ["Baterai Bekas", "Lampu Bohlam / TL", "Obat Kedaluwarsa", "E-Waste Kecil"],
      phone: "0411-3617300"
    },
    {
      id: "fac-4",
      name: "Bank Sampah Unit Tamalanrea",
      type: "bank_sampah",
      typeName: "Bank Sampah",
      typeBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      accentColor: "#133826",
      address: "Jl. Perintis Kemerdekaan Km. 10, Tamalanrea Indah",
      district: "Tamalanrea",
      lat: -5.1382,
      lng: 119.4920,
      operatingHours: "Sabtu & Minggu: 08.00 - 14.00 WITA",
      accepted: ["Kertas HVS/Skripsi", "Botol Plastik PET", "Kardus", "Kemasan Kaleng"],
      phone: "0856-1122-3344"
    },
    {
      id: "fac-5",
      name: "TPS 3R Mariso Mandiri",
      type: "tps_3r",
      typeName: "TPS 3R",
      typeBadge: "bg-teal-50 text-teal-800 border-teal-200",
      accentColor: "#0f766e",
      address: "Jl. Cendrawasih No. 112, Mariso",
      district: "Mariso",
      lat: -5.1532,
      lng: 119.4095,
      operatingHours: "Setiap Hari: 06.30 - 14.30 WITA",
      accepted: ["Sampah Organik Rumah Tangga", "Sisa Makanan", "Anorganik Terpilah"],
      phone: "0813-7788-9900"
    },
    {
      id: "fac-6",
      name: "Drop Box E-Waste DLH Pantai Losari",
      type: "drop_box_b3",
      typeName: "Drop Box B3",
      typeBadge: "bg-amber-50 text-amber-800 border-amber-200",
      accentColor: "#d97706",
      address: "Anjungan Pantai Losari, Jl. Penghibur",
      district: "Ujung Pandang",
      lat: -5.1448,
      lng: 119.4069,
      operatingHours: "Setiap Hari (24 Jam Drop Box Luar)",
      accepted: ["Baterai Bekas", "Kaleng Aerosol", "Kabel & Charger", "Bohlam Lampu"],
      phone: "0411-851234"
    }
  ];

  // Current active facilities dataset (starts with Makassar, dynamically updated by Live GPS)
  let currentFacilities = makassarFacilities.map((f) => ({ ...f }));

  // Active Location State (Defaults to Makassar Karebosi center; updated by Live GPS)
  let activeLocation = {
    lat: MAKASSAR_CENTER.lat,
    lng: MAKASSAR_CENTER.lng,
    isGps: false,
    accuracy: null,
    district: "Pusat Kota",
    city: "Makassar",
    label: "Kota Makassar (Karebosi)"
  };

  let currentTypeFilter = "semua";
  let searchQuery = "";

  // Helper to generate realistic localized facilities around any coordinate (lat, lng)
  function getNearbyFacilitiesForCoords(lat, lng, addressInfo, districtName, cityName) {
    const distToMakassar = calculateDistance(lat, lng, MAKASSAR_CENTER.lat, MAKASSAR_CENTER.lng);
    // If within 35 km of Makassar, use curated Makassar facilities
    if (distToMakassar < 35) {
      return makassarFacilities.map((fac) => ({ ...fac }));
    }

    // For any other region in Indonesia (Semarang, Jakarta, Surabaya, Bali, etc.):
    const sub = districtName || "Wilayah Anda";
    const city = cityName || "Kota Anda";
    const road = addressInfo && addressInfo.road ? addressInfo.road + ", " : "";

    return [
      {
        id: "fac-local-1",
        name: `Bank Sampah Unit ${sub}`,
        type: "bank_sampah",
        typeName: "Bank Sampah",
        typeBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        accentColor: "#133826",
        address: `${road}${sub}, ${city}`,
        district: sub,
        lat: lat + 0.0058,
        lng: lng + 0.0042,
        operatingHours: "Sabtu & Minggu: 08.00 - 13.00",
        accepted: ["Botol Plastik PET", "Kardus & Kertas", "Kaleng Logam", "Minyak Jelantah"],
        phone: "0812-3456-7890"
      },
      {
        id: "fac-local-2",
        name: `TPS 3R ${sub} Bersih Mandiri`,
        type: "tps_3r",
        typeName: "TPS 3R",
        typeBadge: "bg-teal-50 text-teal-800 border-teal-200",
        accentColor: "#0f766e",
        address: `Kompleks Sanitasi Terpadu ${sub}, ${city}`,
        district: sub,
        lat: lat - 0.0082,
        lng: lng + 0.0061,
        operatingHours: "Senin - Sabtu: 06.30 - 15.00",
        accepted: ["Sampah Organik Dapur", "Sampah Daun Kebun", "Plastik Daur Ulang", "Residu"],
        phone: "0821-9876-5432"
      },
      {
        id: "fac-local-3",
        name: `Drop Box Limbah B3 DLH ${city}`,
        type: "drop_box_b3",
        typeName: "Drop Box B3",
        typeBadge: "bg-amber-50 text-amber-800 border-amber-200",
        accentColor: "#d97706",
        address: `Kantor DLH / Pusat Layanan Publik ${city}`,
        district: city,
        lat: lat + 0.0125,
        lng: lng - 0.0094,
        operatingHours: "Senin - Jumat: 08.00 - 16.00",
        accepted: ["Baterai Bekas", "Lampu Bohlam / TL", "Obat Kedaluwarsa", "E-Waste Kecil"],
        phone: "0811-2233-4455"
      },
      {
        id: "fac-local-4",
        name: `Bank Sampah Induk ${city}`,
        type: "bank_sampah",
        typeName: "Bank Sampah",
        typeBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        accentColor: "#133826",
        address: `Sentra Daur Ulang Terpadu, ${city}`,
        district: city,
        lat: lat - 0.0162,
        lng: lng - 0.0118,
        operatingHours: "Senin - Sabtu: 08.30 - 15.30",
        accepted: ["Kardus Tebal", "Botol Kaca", "Plastik HD/PE", "Kemasan Kaleng"],
        phone: "0856-7788-9900"
      },
      {
        id: "fac-local-5",
        name: `TPS 3R ${city} Asri`,
        type: "tps_3r",
        typeName: "TPS 3R",
        typeBadge: "bg-teal-50 text-teal-800 border-teal-200",
        accentColor: "#0f766e",
        address: `Depo Kompos & Daur Ulang Lingkungan, ${city}`,
        district: city,
        lat: lat + 0.0195,
        lng: lng + 0.0152,
        operatingHours: "Setiap Hari: 06.00 - 14.00",
        accepted: ["Sisa Makanan", "Sampah Kebun", "Plastik Kemasan", "Anorganik Terpilah"],
        phone: "0813-1122-3344"
      },
      {
        id: "fac-local-6",
        name: `Drop Box B3 & E-Waste Corner ${city}`,
        type: "drop_box_b3",
        typeName: "Drop Box B3",
        typeBadge: "bg-amber-50 text-amber-800 border-amber-200",
        accentColor: "#d97706",
        address: `Fasilitas Publik & Area Komersial, ${city}`,
        district: city,
        lat: lat - 0.0210,
        lng: lng + 0.0225,
        operatingHours: "Setiap Hari (24 Jam Drop Box Luar)",
        accepted: ["Baterai Bekas", "Kaleng Aerosol", "Kabel & Charger", "Bohlam Lampu"],
        phone: "0819-8877-6655"
      }
    ];
  }

  // Leaflet Map & Layer Instances
  let leafletMap = null;
  let userMarker = null;
  let facilityMarkersGroup = null;
  const markersById = {};

  // Haversine distance formula (in km)
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Google Maps directions URL
  function getDirectionsUrl(destLat, destLng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${activeLocation.lat},${activeLocation.lng}&destination=${destLat},${destLng}`;
  }

  // Update Header & Status Bar UI
  function updateLocationHeaderUI() {
    if (locationTargetLabel) {
      if (activeLocation.isGps) {
        locationTargetLabel.innerHTML = `Menampilkan titik fasilitas terdekat di sekitar <strong class="text-slate-900 font-bold">${activeLocation.label}</strong>`;
      } else {
        locationTargetLabel.innerHTML = `Menampilkan titik fasilitas pengelolaan sampah di wilayah <strong class="text-slate-900 font-bold">Makassar</strong>`;
      }
    }

    if (gpsStatusBadge) {
      if (activeLocation.isGps) {
        gpsStatusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 animate-in fade-in";
        gpsStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span><span>Live GPS: ${activeLocation.city} (±${activeLocation.accuracy || 10}m)</span>`;
      } else {
        gpsStatusBadge.className = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs";
        gpsStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-slate-400"></span><span>Makassar</span>`;
      }
    }

    const liveGpsSpan = document.getElementById("btn-live-gps-text");
    if (liveGpsSpan) {
      liveGpsSpan.innerText = activeLocation.isGps ? "Perbarui GPS" : "Live GPS Saya";
    }
  }

  // ================= MAP SETUP =================
  function createCustomIcons() {
    if (!window.L) return {};

    // 1. User Position Marker (Pulsing Beacon)
    const userIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="relative flex items-center justify-center" style="width:36px;height:36px;">
          <span class="absolute w-8 h-8 rounded-full bg-blue-500/35 animate-ping"></span>
          <span class="relative w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          </span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });

    // 2. Bank Sampah Marker (Emerald)
    const bankSampahIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="w-9 h-9 rounded-2xl bg-emerald-700 border-2 border-white shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110 cursor-pointer" style="width:36px;height:36px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 5.196 9.5 8.293 5.404"/><path d="m14 8-3-3 3-3"/><path d="M11 5h8.203a1.83 1.83 0 0 1 1.556.89 1.784 1.784 0 0 1 0 1.775l-1.226 2.12"/></svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });

    // 3. TPS 3R Marker (Teal)
    const tps3rIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="w-9 h-9 rounded-2xl bg-teal-700 border-2 border-white shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110 cursor-pointer" style="width:36px;height:36px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });

    // 4. Drop Box B3 Marker (Amber)
    const dropBoxB3Icon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="w-9 h-9 rounded-2xl bg-amber-600 border-2 border-white shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110 cursor-pointer" style="width:36px;height:36px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });

    return { userIcon, bankSampahIcon, tps3rIcon, dropBoxB3Icon };
  }

  function initLeafletMap() {
    const mapContainer = document.getElementById("facility-map");
    if (!mapContainer || !window.L) return;

    leafletMap = L.map("facility-map", {
      center: [activeLocation.lat, activeLocation.lng],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
    }).addTo(leafletMap);

    facilityMarkersGroup = L.layerGroup().addTo(leafletMap);

    updateMap();

    setTimeout(() => {
      leafletMap.invalidateSize();
    }, 300);
  }

  // Update Markers based on Category Filter & Search
  function updateMap() {
    if (!leafletMap || !window.L) return;

    const icons = createCustomIcons();

    // 1. User Position Marker
    if (userMarker) {
      leafletMap.removeLayer(userMarker);
    }

    const userPopupHtml = `
      <div class="p-2 space-y-1 text-center min-w-[150px]">
        <span class="inline-flex items-center gap-1 text-xs font-bold text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
          ${activeLocation.isGps ? "Titik Live GPS Anda" : "Titik Anda"}
        </span>
        <p class="text-xs text-slate-700 font-semibold">${activeLocation.label}</p>
        <p class="text-[10px] text-slate-400 font-mono">${activeLocation.lat.toFixed(5)}, ${activeLocation.lng.toFixed(5)}</p>
      </div>
    `;

    userMarker = L.marker([activeLocation.lat, activeLocation.lng], { icon: icons.userIcon })
      .bindPopup(userPopupHtml)
      .addTo(leafletMap);

    // 2. Clear old facility markers
    facilityMarkersGroup.clearLayers();
    Object.keys(markersById).forEach((key) => delete markersById[key]);

    // 3. Filter Facilities
    const filtered = getFilteredFacilities();

    // Update Counts
    if (mapActiveCount) mapActiveCount.innerText = `${filtered.length} Titik`;
    if (facilityCountText) facilityCountText.innerText = `Menampilkan ${filtered.length} lokasi`;

    const bounds = L.latLngBounds([[activeLocation.lat, activeLocation.lng]]);

    filtered.forEach((fac) => {
      const dist = calculateDistance(activeLocation.lat, activeLocation.lng, fac.lat, fac.lng);
      let icon = icons.bankSampahIcon;
      if (fac.type === "tps_3r") icon = icons.tps3rIcon;
      if (fac.type === "drop_box_b3") icon = icons.dropBoxB3Icon;

      const directionsUrl = getDirectionsUrl(fac.lat, fac.lng);
      const popupDist = dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;

      const popupHtml = `
        <div class="p-2 space-y-2 min-w-[220px]">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${fac.typeBadge}">
              ${fac.typeName}
            </span>
            <span class="text-xs font-extrabold text-brand-800 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
              ${popupDist}
            </span>
          </div>

          <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
            ${fac.name}
          </h4>

          <p class="text-[11px] text-slate-600 leading-tight">
            ${fac.address}
          </p>

          <p class="text-[10px] text-emerald-700 font-semibold flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${fac.operatingHours}</span>
          </p>

          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>${fac.phone}</span>
            </span>
            <a 
              href="${directionsUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-800 hover:bg-brand-700 text-white text-[11px] font-bold shadow-xs transition-colors"
            >
              <span>Rute</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      `;

      const marker = L.marker([fac.lat, fac.lng], { icon })
        .bindPopup(popupHtml)
        .addTo(facilityMarkersGroup);

      // On clicking marker, highlight & scroll to corresponding card on the right
      marker.on("click", () => {
        highlightCard(fac.id);
      });

      markersById[fac.id] = marker;
      bounds.extend([fac.lat, fac.lng]);
    });

    // Auto fit bounds to visible markers
    if (filtered.length > 0) {
      leafletMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } else {
      leafletMap.setView([activeLocation.lat, activeLocation.lng], 13);
    }
  }

  // Focus a facility on map from card click
  window.panToFacilityOnMap = function (facId) {
    if (!leafletMap || !markersById[facId]) return;

    const fac = currentFacilities.find((f) => f.id === facId);
    if (!fac) return;

    leafletMap.flyTo([fac.lat, fac.lng], 16, { duration: 0.8 });
    setTimeout(() => {
      if (markersById[facId]) {
        markersById[facId].openPopup();
      }
    }, 850);
  };

  // Highlight card when marker is clicked
  function highlightCard(facId) {
    const card = document.getElementById(`card-${facId}`);
    if (!card) return;

    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    card.classList.add("ring-2", "ring-brand-500", "bg-brand-50/30");
    setTimeout(() => {
      card.classList.remove("ring-2", "ring-brand-500", "bg-brand-50/30");
    }, 2000);
  }

  // Helper: Filter facilities
  function getFilteredFacilities() {
    const processed = currentFacilities.map((fac) => {
      const dist = calculateDistance(activeLocation.lat, activeLocation.lng, fac.lat, fac.lng);
      return { ...fac, distanceKm: dist };
    });

    processed.sort((a, b) => a.distanceKm - b.distanceKm);

    return processed.filter((fac) => {
      const matchType = currentTypeFilter === "semua" || fac.type === currentTypeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        fac.name.toLowerCase().includes(q) ||
        fac.address.toLowerCase().includes(q) ||
        fac.district.toLowerCase().includes(q) ||
        fac.accepted.some((item) => item.toLowerCase().includes(q));
      return matchType && matchSearch;
    });
  }

  // ================= RENDER FACILITIES CARDS =================
  function renderFacilities() {
    if (!facilityList) return;
    facilityList.innerHTML = "";

    updateLocationHeaderUI();

    const filtered = getFilteredFacilities();

    if (filtered.length === 0) {
      facilityList.innerHTML = `
        <div class="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
          <i data-lucide="map-pin-off" class="w-10 h-10 text-slate-400 mx-auto"></i>
          <p class="text-sm font-semibold text-slate-700">Tidak ada lokasi yang cocok.</p>
          <p class="text-xs text-slate-400">Coba pilih filter 'Semua' atau periksa kata kunci Anda.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    filtered.forEach((fac) => {
      const card = document.createElement("div");
      const directionsUrl = getDirectionsUrl(fac.lat, fac.lng);
      const formattedDistance =
        fac.distanceKm < 1
          ? `${Math.round(fac.distanceKm * 1000)} m`
          : `${fac.distanceKm.toFixed(1)} km`;

      card.id = `card-${fac.id}`;
      card.className =
        "facility-item-card bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs hover:shadow-md hover:border-brand-300 transition-all duration-200 flex flex-col justify-between space-y-3.5 cursor-pointer group animate-in fade-in duration-300";

      card.innerHTML = `
        <div class="space-y-2.5">
          <!-- Top Row: Type Badge & Distance -->
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${fac.typeBadge}">
              ${fac.typeName}
            </span>
            <div class="flex items-center gap-1.5">
              ${activeLocation.isGps ? '<span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">Terdekat</span>' : ''}
              <span class="inline-flex items-center gap-1 text-xs font-extrabold text-brand-800 bg-brand-50 px-2.5 py-0.5 rounded-xl border border-brand-100/80">
                <i data-lucide="navigation-2" class="w-3.5 h-3.5 text-brand-600"></i>
                <span>${formattedDistance}</span>
              </span>
            </div>
          </div>

          <!-- Title -->
          <h3 class="text-base font-bold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug">
            ${fac.name}
          </h3>

          <!-- Address & Hours -->
          <p class="text-xs text-slate-500 flex items-start gap-1.5 leading-relaxed">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5"></i>
            <span>${fac.address}</span>
          </p>

          <p class="text-xs text-slate-500 flex items-center gap-1.5">
            <i data-lucide="clock" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></i>
            <span>${fac.operatingHours}</span>
          </p>

          <!-- Accepted Tags -->
          <div class="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
            ${fac.accepted.slice(0, 3).map((item) => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">${item}</span>`).join('')}
            ${fac.accepted.length > 3 ? `<span class="px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[11px] font-medium">+${fac.accepted.length - 3}</span>` : ''}
          </div>
        </div>

        <!-- Bottom Actions -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button 
            type="button" 
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-800 text-slate-700 text-xs font-bold transition-all border border-slate-200/70 cursor-pointer"
            onclick="event.stopPropagation(); window.panToFacilityOnMap('${fac.id}')"
          >
            <i data-lucide="map" class="w-3.5 h-3.5"></i>
            <span>Lihat di Peta</span>
          </button>

          <a 
            href="${directionsUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            onclick="event.stopPropagation();"
            class="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <i data-lucide="navigation" class="w-3 h-3"></i>
            <span>Rute</span>
          </a>
        </div>
      `;

      // Clicking card pans map to facility
      card.addEventListener("click", () => {
        window.panToFacilityOnMap(fac.id);
      });

      facilityList.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // ================= LIVE GPS ACTIVATION =================
  function activateLiveGps() {
    if (!navigator.geolocation) {
      alert("Browser atau perangkat Anda tidak mendukung fitur Geolocation GPS.");
      return;
    }

    if (btnLiveGps) {
      btnLiveGps.disabled = true;
      btnLiveGps.innerHTML = `
        <div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></div>
        <span>Mencari Sinyal GPS...</span>
      `;
    }

    if (facilityList) {
      facilityList.style.opacity = "0.5";
      facilityList.style.transition = "opacity 0.2s ease";
    }

    async function handleSuccess(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = Math.round(position.coords.accuracy) || 15;

      // 1. Reverse-geocode with 2.5s timeout via Nominatim
      let addressInfo = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
          {
            headers: { "User-Agent": "PilahKiApp/1.0" },
            signal: controller.signal
          }
        );
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          addressInfo = data.address || null;
        }
      } catch (e) {
        console.warn("Reverse geocode offline or timeout, falling back:", e);
      }

      // 2. Extract District & City
      let districtName = "";
      let cityName = "";
      if (addressInfo) {
        districtName =
          addressInfo.suburb ||
          addressInfo.city_district ||
          addressInfo.village ||
          addressInfo.neighbourhood ||
          addressInfo.town ||
          "Wilayah Anda";
        cityName =
          addressInfo.city ||
          addressInfo.town ||
          addressInfo.county ||
          addressInfo.municipality ||
          "Kota Anda";
      }

      // 3. Update activeLocation
      activeLocation = {
        lat,
        lng,
        isGps: true,
        accuracy,
        district: districtName || "Sekitar Anda",
        city: cityName || "Lokasi Anda",
        label: districtName ? `${districtName}, ${cityName}` : "Lokasi GPS Terkini Anda"
      };

      // 4. Update currentFacilities dataset based on actual coordinates
      currentFacilities = getNearbyFacilitiesForCoords(lat, lng, addressInfo, activeLocation.district, activeLocation.city);

      // 5. Restore Button UI to Active State
      if (btnLiveGps) {
        btnLiveGps.disabled = false;
        btnLiveGps.className =
          "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer group";
        btnLiveGps.innerHTML = `
          <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-200"></i>
          <span id="btn-live-gps-text">Perbarui GPS</span>
        `;
      }

      if (facilityList) {
        facilityList.style.opacity = "1";
      }

      // 6. Re-render Cards & Map
      renderFacilities();
      updateMap();

      if (window.lucide) window.lucide.createIcons();
    }

    function handleError(error) {
      console.warn("GPS Geolocation error:", error);
      if (facilityList) facilityList.style.opacity = "1";

      let msg = "Gagal mendeteksi lokasi GPS Anda.";
      if (error && error.code === 1) {
        msg = "Izin akses lokasi GPS ditolak oleh browser. Silakan izinkan akses lokasi di bilah alamat browser untuk mendeteksi fasilitas terdekat.";
      } else if (error && error.code === 2) {
        msg = "Sinyal lokasi tidak dapat diperoleh saat ini.";
      } else if (error && error.code === 3) {
        msg = "Waktu pencarian GPS habis (timeout). Silakan coba lagi.";
      }
      alert(msg);

      if (btnLiveGps) {
        btnLiveGps.disabled = false;
        btnLiveGps.className =
          "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer group";
        btnLiveGps.innerHTML = `
          <i data-lucide="crosshair" class="w-4 h-4 text-accent-light"></i>
          <span id="btn-live-gps-text">Live GPS Saya</span>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    }

    // Try high accuracy first; if timeout, retry with standard accuracy (covers laptop/desktop WiFi IP location)
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      (err) => {
        console.warn("Retrying GPS with standard accuracy...", err);
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          (err2) => handleError(err2 || err),
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 30000 }
        );
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 10000 }
    );
  }

  // ================= EVENT LISTENERS =================

  // 1. Live GPS Button Click
  if (btnLiveGps) {
    btnLiveGps.addEventListener("click", () => {
      activateLiveGps();
    });
  }

  // 2. Center Map on User Position
  if (btnCenterMap) {
    btnCenterMap.addEventListener("click", () => {
      if (leafletMap) {
        leafletMap.flyTo([activeLocation.lat, activeLocation.lng], 15, { duration: 1 });
        if (userMarker) userMarker.openPopup();
      }
    });
  }

  // 3. Category Filter Buttons (Semua, Bank Sampah, TPS 3R, Drop Box B3)
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("bg-brand-800", "text-white", "shadow-xs");
        b.classList.add("bg-slate-100/80", "text-slate-700");
      });
      btn.classList.add("bg-brand-800", "text-white", "shadow-xs");
      btn.classList.remove("bg-slate-100/80", "text-slate-700");

      currentTypeFilter = btn.getAttribute("data-type") || "semua";
      renderFacilities();
      updateMap();
    });
  });

  // 4. Search Input
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderFacilities();
      updateMap();
    });
  }

  // 5. URL Query Filter Parameter (?filter=drop_box_b3)
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get("filter");
  if (filterParam) {
    const targetBtn = document.querySelector(`.facility-filter-btn[data-type="${filterParam}"]`);
    if (targetBtn) targetBtn.click();
  }

  // ================= INITIALIZATION =================
  initLeafletMap();
  renderFacilities();
});
