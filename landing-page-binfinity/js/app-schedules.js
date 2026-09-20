/**
 * PilahKi' — Waste Collection Schedule Page Script (js/app-schedules.js)
 * Features:
 * 1. Live Location Integration (HTML5 Geolocation + Nominatim Reverse Geocoding).
 * 2. Tabel Agenda Mingguan Minimalis: Scannable horizontal row layout with generous white space.
 * 3. Automatic "HARI INI" highlight with distinctive soft emerald accent and status badges.
 * 4. District selector synchronization with local Makassar districts.
 * 5. Zero emojis, clean typography, and Lucide SVG icons.
 */

document.addEventListener("DOMContentLoaded", () => {
  const districtSelect = document.getElementById("schedule-district-select");
  const upcomingBanner = document.getElementById("schedule-upcoming-banner");
  const weeklyList = document.getElementById("schedule-weekly-list");
  const districtTitle = document.getElementById("schedule-district-title");
  const locationLabel = document.getElementById("schedule-location-label");
  const gpsStatusBadge = document.getElementById("gps-status-badge");
  const btnLiveGps = document.getElementById("btn-live-gps");

  // Makassar Districts Supported
  const MAKASSAR_DISTRICTS = [
    "Panakkukang",
    "Rappocini",
    "Ujung Pandang",
    "Tamalanrea",
    "Bontoala",
    "Mariso",
    "Manggala",
    "Tamalate"
  ];

  // Weekly Schedule Database by District (Kota Makassar)
  const schedulesDatabase = {
    "Panakkukang": [
      {
        day: "Senin",
        status: "Ada Penjemputan",
        statusDot: "bg-emerald-500",
        time: "06.30 - 09.00 WITA",
        category: "Sampah Organik & Sisa Dapur",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        icon: "leaf",
        iconBg: "bg-emerald-100 text-emerald-800",
        vehicle: "Truk Sampah Organik TPS 3R",
        notes: "Letakkan wadah tertutup di depan pagar sebelum pukul 06.00 WITA."
      },
      {
        day: "Selasa",
        status: "Tidak Ada Penjemputan",
        statusDot: "bg-slate-400",
        time: "-",
        category: "Libur Operasional Armada Wilayah",
        badge: "bg-slate-100 text-slate-500 border-slate-200",
        icon: "calendar-off",
        iconBg: "bg-slate-100 text-slate-400",
        vehicle: "Armada Pemeliharaan Rutin",
        notes: "Gunakan komposter mandiri untuk sisa sampah organik dapur rumah tangga."
      },
      {
        day: "Rabu",
        status: "Ada Penjemputan",
        statusDot: "bg-blue-500",
        time: "08.00 - 11.00 WITA",
        category: "Anorganik Daur Ulang & Kardus",
        badge: "bg-blue-50 text-blue-800 border-blue-200",
        icon: "recycle",
        iconBg: "bg-blue-100 text-blue-800",
        vehicle: "Gerobak Motor Bank Sampah Induk",
        notes: "Kardus, botol plastik PET, dan kaleng siap timbang dalam kondisi bersih & pipih."
      },
      {
        day: "Kamis",
        status: "Ada Penjemputan",
        statusDot: "bg-amber-500",
        time: "06.00 - 08.30 WITA",
        category: "Sampah Residu Umum",
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        icon: "trash-2",
        iconBg: "bg-slate-100 text-slate-700",
        vehicle: "Truk Kompaktor DLH Kota Makassar",
        notes: "Kemasan sachet, styrofoam, dan pembalut menuju TPA Tamangapa Antang."
      },
      {
        day: "Jumat",
        status: "Tidak Ada Penjemputan",
        statusDot: "bg-slate-400",
        time: "-",
        category: "Pembersihan Rutin Drainase Lingkungan",
        badge: "bg-slate-100 text-slate-500 border-slate-200",
        icon: "calendar-off",
        iconBg: "bg-slate-100 text-slate-400",
        vehicle: "Tim Satgas Kebersihan Kecamatan",
        notes: "Fokus kerja bakti saluran drainase warga RT/RW setempat."
      },
      {
        day: "Sabtu",
        status: "Ada Penjemputan",
        statusDot: "bg-amber-500",
        time: "07.00 - 10.00 WITA",
        category: "Sampah Residu Akhir Pekan",
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        icon: "trash-2",
        iconBg: "bg-slate-100 text-slate-700",
        vehicle: "Truk Kompaktor DLH Kota Makassar",
        notes: "Pastikan tempat sampah tertutup rapat agar tidak diacak hewan liar."
      },
      {
        day: "Minggu",
        status: "Penyetoran Bank Sampah",
        statusDot: "bg-emerald-500",
        time: "08.00 - 12.00 WITA",
        category: "Layanan Tabungan Bank Sampah Unit",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        icon: "award",
        iconBg: "bg-emerald-100 text-emerald-800",
        vehicle: "Pos Pelayanan Bank Sampah Induk Toddopuli",
        notes: "Bawa buku tabungan nasabah bank sampah dan setoran anorganik terpilah."
      }
    ],
    "Rappocini": [
      {
        day: "Senin",
        status: "Ada Penjemputan",
        statusDot: "bg-amber-500",
        time: "06.00 - 08.30 WITA",
        category: "Sampah Residu Awal Pekan",
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        icon: "trash-2",
        iconBg: "bg-slate-100 text-slate-700",
        vehicle: "Truk Kompaktor DLH Kota Makassar",
        notes: "Pengangkutan residu padat rumah tangga pasca akhir pekan."
      },
      {
        day: "Selasa",
        status: "Ada Penjemputan",
        statusDot: "bg-emerald-500",
        time: "07.00 - 09.30 WITA",
        category: "Sampah Organik & Kebun",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        icon: "leaf",
        iconBg: "bg-emerald-100 text-emerald-800",
        vehicle: "Truk TPS 3R Sejahtera",
        notes: "Sisa pangkasan dahan pohon, daun kering, dan sisa bahan dapur."
      },
      {
        day: "Rabu",
        status: "Tidak Ada Penjemputan",
        statusDot: "bg-slate-400",
        time: "-",
        category: "Proses Pengolahan Kompos di Fasilitas",
        badge: "bg-slate-100 text-slate-500 border-slate-200",
        icon: "calendar-off",
        iconBg: "bg-slate-100 text-slate-400",
        vehicle: "Unit Operasional Depo",
        notes: "Fasilitas TPS 3R melakukan proses aerasi dan fermentasi pupuk kompos."
      },
      {
        day: "Kamis",
        status: "Ada Penjemputan",
        statusDot: "bg-amber-500",
        time: "06.30 - 09.00 WITA",
        category: "Sampah Residu Umum",
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        icon: "trash-2",
        iconBg: "bg-slate-100 text-slate-700",
        vehicle: "Truk Kompaktor DLH Kota Makassar",
        notes: "Sampah plastik kresek kotor, kemasan sachet, dan residu kering."
      },
      {
        day: "Jumat",
        status: "Ada Penjemputan",
        statusDot: "bg-blue-500",
        time: "08.00 - 11.00 WITA",
        category: "Anorganik (Plastik, Kertas, Jelantah)",
        badge: "bg-blue-50 text-blue-800 border-blue-200",
        icon: "recycle",
        iconBg: "bg-blue-100 text-blue-800",
        vehicle: "Armada Motor Bank Sampah Induk",
        notes: "Penyetoran minyak jelantah dalam botol tertutup dan kardus terikat."
      },
      {
        day: "Sabtu",
        status: "Ada Penjemputan",
        statusDot: "bg-emerald-500",
        time: "07.00 - 09.30 WITA",
        category: "Sampah Organik Rumah Tangga",
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        icon: "leaf",
        iconBg: "bg-emerald-100 text-emerald-800",
        vehicle: "Truk TPS 3R Sejahtera",
        notes: "Pengangkutan sampah sisa makanan dan sayuran akhir pekan."
      },
      {
        day: "Minggu",
        status: "Tidak Ada Penjemputan",
        statusDot: "bg-slate-400",
        time: "-",
        category: "Libur Operasional Armada",
        badge: "bg-slate-100 text-slate-500 border-slate-200",
        icon: "calendar-off",
        iconBg: "bg-slate-100 text-slate-400",
        vehicle: "-",
        notes: "Simpan sampah terpilah di wadah tertutup teduh."
      }
    ]
  };

  // Helper: Return schedule list for any district
  function getDistrictSchedule(district) {
    if (schedulesDatabase[district]) {
      return schedulesDatabase[district];
    }
    // Alternate template for other districts
    const base = schedulesDatabase["Panakkukang"];
    return base.map((item) => ({ ...item }));
  }

  // ================= RENDER SCHEDULE =================
  function renderSchedule(districtName) {
    const list = getDistrictSchedule(districtName);

    // 1. Update District Title
    if (districtTitle) {
      districtTitle.innerText = `Kecamatan ${districtName}, Kota Makassar`;
    }
    if (districtSelect) {
      districtSelect.value = districtName;
    }

    // 2. Determine Today's Day in Indonesian
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const todayIndex = new Date().getDay();
    const todayName = dayNames[todayIndex];

    const todaySchedule =
      list.find((item) => item.day.toLowerCase() === todayName.toLowerCase()) || list[0];

    // 3. Render Upcoming Pickup Highlight Banner
    if (upcomingBanner) {
      const isPickup = todaySchedule.status.includes("Ada Penjemputan") || todaySchedule.status.includes("Penyetoran");
      upcomingBanner.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
              isPickup
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-white/10 text-slate-200 border border-white/15"
            }">
              <span class="w-2 h-2 rounded-full ${isPickup ? "bg-emerald-400 animate-ping" : "bg-slate-400"}"></span>
              <span>Jadwal Terdekat: Hari ${todaySchedule.day} (Hari Ini)</span>
            </div>
            
            <h3 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              ${todaySchedule.category}
            </h3>

            <p class="text-xs sm:text-sm text-brand-100 leading-relaxed max-w-xl">
              ${
                isPickup
                  ? `Waktu operasional penjemputan: <strong class="text-white">${todaySchedule.time}</strong> menggunakan armada <em class="text-white font-medium">${todaySchedule.vehicle}</em>.`
                  : "Hari ini tidak ada jadwal truk angkut residu di wilayah Anda. Gunakan komposter mandiri untuk sampah organik."
              }
            </p>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold border border-white/15 backdrop-blur-xs">
              <i data-lucide="map-pin" class="w-4 h-4 text-emerald-300"></i>
              <span>Kec. ${districtName}</span>
            </span>
          </div>
        </div>
      `;
    }

    // 4. Render Tabel Agenda Mingguan Minimalis
    if (weeklyList) {
      weeklyList.innerHTML = "";

      list.forEach((item) => {
        const isToday = item.day.toLowerCase() === todayName.toLowerCase();
        const row = document.createElement("div");

        // Styling row with generous white space and clean typography
        if (isToday) {
          row.className =
            "py-5 px-5 sm:px-6 bg-brand-50/60 border-l-4 border-l-brand-800 transition-colors duration-150 animate-in fade-in";
        } else {
          row.className =
            "py-5 px-5 sm:px-6 hover:bg-slate-50/70 transition-colors duration-150";
        }

        row.innerHTML = `
          <!-- Desktop Horizontal Row (md:grid) -->
          <div class="hidden md:grid grid-cols-12 gap-4 items-center">
            
            <!-- Col 1: Hari & Badge Hari Ini -->
            <div class="col-span-2 flex items-center gap-2">
              <span class="text-base font-extrabold ${isToday ? 'text-brand-900 font-black' : 'text-slate-900'}">
                ${item.day}
              </span>
              ${
                isToday
                  ? '<span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-800 text-white shadow-2xs tracking-tight shrink-0">HARI INI</span>'
                  : ''
              }
            </div>

            <!-- Col 2: Status & Jam Operasional -->
            <div class="col-span-3 space-y-1">
              <div>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${item.badge}">
                  <span class="w-1.5 h-1.5 rounded-full ${item.statusDot}"></span>
                  <span>${item.status}</span>
                </span>
              </div>
              <div class="text-xs font-semibold text-slate-600 flex items-center gap-1.5 pt-0.5">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i>
                <span>${item.time}</span>
              </div>
            </div>

            <!-- Col 3: Jenis Sampah & Ikon -->
            <div class="col-span-4 flex items-center gap-3">
              <div class="w-9 h-9 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-2xs">
                <i data-lucide="${item.icon}" class="w-4 h-4"></i>
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900 leading-snug">
                  ${item.category}
                </h4>
              </div>
            </div>

            <!-- Col 4: Armada & Catatan Warga -->
            <div class="col-span-3 space-y-0.5">
              <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <i data-lucide="truck" class="w-3.5 h-3.5 text-brand-700 shrink-0"></i>
                <span class="truncate">${item.vehicle}</span>
              </div>
              <p class="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                ${item.notes}
              </p>
            </div>

          </div>

          <!-- Mobile Compact Agenda Card-Free Layout (< md) -->
          <div class="md:hidden space-y-3">
            
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-base font-extrabold text-slate-900">
                  ${item.day}
                </span>
                ${
                  isToday
                    ? '<span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-800 text-white shadow-2xs">HARI INI</span>'
                    : ''
                }
              </div>

              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${item.badge}">
                <span class="w-1.5 h-1.5 rounded-full ${item.statusDot}"></span>
                <span>${item.status}</span>
              </span>
            </div>

            <div class="flex items-start gap-3 pt-0.5">
              <div class="w-9 h-9 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <i data-lucide="${item.icon}" class="w-4 h-4"></i>
              </div>
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-slate-900 leading-snug">
                  ${item.category}
                </h4>
                <div class="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i>
                  <span>${item.time}</span>
                </div>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px]">
              <div class="font-bold text-slate-700 flex items-center gap-1.5">
                <i data-lucide="truck" class="w-3.5 h-3.5 text-brand-700 shrink-0"></i>
                <span>${item.vehicle}</span>
              </div>
              <p class="text-slate-500 leading-relaxed">
                ${item.notes}
              </p>
            </div>

          </div>
        `;

        weeklyList.appendChild(row);
      });
    }

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
        <span>Mencari GPS...</span>
      `;
    }

    async function handleSuccess(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = Math.round(position.coords.accuracy) || 15;

      let detectedDistrict = "Panakkukang";
      let cityName = "Makassar";

      // 1. Reverse-geocode with 2.5s timeout via Nominatim
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
          const addr = data.address || {};
          const rawSub = addr.suburb || addr.city_district || addr.town || addr.village || "";
          cityName = addr.city || addr.town || "Makassar";

          // Match raw subdistrict to known Makassar districts
          const matched = MAKASSAR_DISTRICTS.find(
            (d) => rawSub.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(rawSub.toLowerCase())
          );
          if (matched) {
            detectedDistrict = matched;
          } else if (rawSub) {
            detectedDistrict = rawSub;
          }
        }
      } catch (e) {
        console.warn("Reverse geocode timeout or offline in schedules:", e);
      }

      // 2. Update UI & Status Badge
      if (gpsStatusBadge) {
        gpsStatusBadge.className =
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 animate-in fade-in";
        gpsStatusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span><span>Live GPS: Kec. ${detectedDistrict} (±${accuracy}m)</span>`;
      }

      if (locationLabel) {
        locationLabel.innerHTML = `Jadwal penjemputan sampah DLH Kota ${cityName} di <strong class="text-slate-900 font-bold">Kecamatan ${detectedDistrict}</strong> (Terdeteksi via Live GPS)`;
      }

      if (districtSelect) {
        districtSelect.value = detectedDistrict;
      }

      // 3. Render Schedule for detected district
      renderSchedule(detectedDistrict);

      // 4. Restore Button UI to Active State
      if (btnLiveGps) {
        btnLiveGps.disabled = false;
        btnLiveGps.className =
          "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer group";
        btnLiveGps.innerHTML = `
          <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-200"></i>
          <span id="btn-live-gps-text">Perbarui GPS</span>
        `;
      }

      if (window.lucide) window.lucide.createIcons();
    }

    function handleError(error) {
      console.warn("GPS Geolocation error in schedules:", error);
      let msg = "Gagal mendeteksi lokasi GPS Anda.";
      if (error && error.code === 1) {
        msg = "Izin akses lokasi GPS ditolak oleh browser. Silakan aktifkan izin lokasi di bilah alamat browser.";
      } else if (error && error.code === 2) {
        msg = "Sinyal lokasi tidak dapat diperoleh saat ini.";
      } else if (error && error.code === 3) {
        msg = "Waktu pencarian GPS habis (timeout).";
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

    // Try high accuracy first; retry with standard accuracy if timeout
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      () => {
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          handleError,
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

  // 2. District Select Dropdown Change
  if (districtSelect) {
    districtSelect.addEventListener("change", (e) => {
      const selected = e.target.value;
      if (locationLabel) {
        locationLabel.innerText = "Jadwal operasional penjemputan sampah terpilah dan residu DLH Kota Makassar di wilayah Anda.";
      }
      renderSchedule(selected);
    });
  }

  // 3. Domicile Sync with LocalStorage or events
  const currentDomicile = window.getPilahkiDomicile ? window.getPilahkiDomicile() : { district: "Panakkukang" };
  renderSchedule(currentDomicile.district || "Panakkukang");

  window.addEventListener("pilahki-domicile-changed", (e) => {
    if (e.detail && e.detail.district) {
      renderSchedule(e.detail.district);
    }
  });
});
