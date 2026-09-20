

export const MAKASSAR_CENTER = { lat: -5.1342, lng: 119.4140 }

export const MAKASSAR_DISTRICT_COORDS = {
  "Panakkukang": { lat: -5.1488, lng: 119.4445 },
  "Rappocini": { lat: -5.1680, lng: 119.4350 },
  "Ujung Pandang": { lat: -5.1350, lng: 119.4100 },
  "Tamalanrea": { lat: -5.1270, lng: 119.4930 },
  "Bontoala": { lat: -5.1295, lng: 119.4225 },
  "Mariso": { lat: -5.1540, lng: 119.4100 },
  "Manggala": { lat: -5.1650, lng: 119.4850 },
  "Tamalate": { lat: -5.1850, lng: 119.4120 }
}

export const jenisFasilitasConfig = {
  bank_sampah: {
    label: 'Bank Sampah',
    typeName: 'Bank Sampah',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    accentColor: '#133826',
    desc: 'Menerima sampah anorganik kering terpilah yang ditimbang dan dapat dicairkan menjadi tabungan rupiah.'
  },
  tps_3r: {
    label: 'TPS 3R',
    typeName: 'TPS 3R',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    accentColor: '#0f766e',
    desc: 'Pusat daur ulang wilayah yang mengolah sampah organik menjadi kompos dan memilah anorganik.'
  },
  tpa: {
    label: 'TPA',
    typeName: 'TPA',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    accentColor: '#d97706',
    desc: 'Tempat Pemrosesan Akhir (TPA) terpusat untuk pemrosesan sampah residu dan penanganan limbah akhir perkotaan.'
  },
  drop_box_b3: { 
    label: 'TPA',
    typeName: 'TPA',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    accentColor: '#d97706',
    desc: 'Tempat Pemrosesan Akhir (TPA) terpusat untuk pemrosesan sampah residu dan penanganan limbah akhir perkotaan.'
  }
}

export const makassarFacilities = [
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
    name: "TPA Tamangapa Antang Makassar",
    type: "tpa",
    typeName: "TPA",
    typeBadge: "bg-amber-50 text-amber-800 border-amber-200",
    accentColor: "#d97706",
    address: "Jl. Tamangapa Raya No. 12, Antang, Manggala",
    district: "Manggala",
    lat: -5.1742,
    lng: 119.4891,
    operatingHours: "Setiap Hari: 06.00 - 18.00 WITA",
    accepted: ["Residu Rumah Tangga", "Limbah Residu Kering", "Puing Konstruksi", "Residu Padat"],
    phone: "0411-491234"
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
    name: "TPA Transit & Pengolahan DLH Kota Makassar",
    type: "tpa",
    typeName: "TPA",
    typeBadge: "bg-amber-50 text-amber-800 border-amber-200",
    accentColor: "#d97706",
    address: "Kompleks Pemrosesan Akhir DLH, Tamangapa, Manggala",
    district: "Manggala",
    lat: -5.1685,
    lng: 119.4812,
    operatingHours: "Setiap Hari: 07.00 - 17.00 WITA",
    accepted: ["Sampah Residu", "Residu Kemasan", "Sisa Daur Ulang", "Residu Campur"],
    phone: "0411-851234"
  }
]

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getNearbyFacilitiesForCoords(lat, lng, addressInfo = null, districtName = '', cityName = '') {
  const distToMakassar = calculateDistance(lat, lng, MAKASSAR_CENTER.lat, MAKASSAR_CENTER.lng)

  if (distToMakassar < 35) {
    return makassarFacilities.map(f => ({ ...f }))
  }

  const sub = districtName || "Wilayah Anda"
  const city = cityName || "Kota Anda"
  const road = addressInfo && addressInfo.road ? addressInfo.road + ", " : ""

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
      lat: lat + 0.0048,
      lng: lng + 0.0035,
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
      lat: lat - 0.0062,
      lng: lng + 0.0045,
      operatingHours: "Senin - Sabtu: 06.30 - 15.00",
      accepted: ["Sampah Organik Dapur", "Sampah Daun Kebun", "Plastik Daur Ulang", "Residu"],
      phone: "0821-9876-5432"
    },
    {
      id: "fac-local-3",
      name: `TPA Regional ${city}`,
      type: "tpa",
      typeName: "TPA",
      typeBadge: "bg-amber-50 text-amber-800 border-amber-200",
      accentColor: "#d97706",
      address: `Pusat Pemrosesan Akhir Lingkungan ${city}`,
      district: city,
      lat: lat + 0.0105,
      lng: lng - 0.0075,
      operatingHours: "Setiap Hari: 06.00 - 18.00",
      accepted: ["Residu Rumah Tangga", "Limbah Padat", "Puing Sisa", "Residu Non-Daur Ulang"],
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
      lat: lat - 0.0125,
      lng: lng - 0.0095,
      operatingHours: "Senin - Sabtu: 08.30 - 15.30",
      accepted: ["Kardus Tebal", "Botol Kaca", "Plastik HD/PE", "Kemasan Kaleng"],
      phone: "0856-7788-9900"
    },
    {
      id: "fac-local-5",
      name: `TPS 3R ${city} Asri Lestari`,
      type: "tps_3r",
      typeName: "TPS 3R",
      typeBadge: "bg-teal-50 text-teal-800 border-teal-200",
      accentColor: "#0f766e",
      address: `Depo Kompos & Daur Ulang Lingkungan, ${city}`,
      district: city,
      lat: lat + 0.0145,
      lng: lng + 0.0115,
      operatingHours: "Setiap Hari: 06.00 - 14.00",
      accepted: ["Sisa Makanan", "Sampah Kebun", "Plastik Kemasan", "Anorganik Terpilah"],
      phone: "0813-1122-3344"
    },
    {
      id: "fac-local-6",
      name: `TPA Pemrosesan Residu ${city}`,
      type: "tpa",
      typeName: "TPA",
      typeBadge: "bg-amber-50 text-amber-800 border-amber-200",
      accentColor: "#d97706",
      address: `Instalasi Akhir Sanitasi ${city}`,
      district: city,
      lat: lat - 0.0165,
      lng: lng + 0.0175,
      operatingHours: "Setiap Hari: 07.00 - 17.00",
      accepted: ["Sampah Residu", "Residu Campuran", "Sisa Daur Ulang"],
      phone: "0819-8877-6655"
    }
  ]
}

export function findNearestMakassarDistrict(lat, lng) {
  let closestDistrict = "Panakkukang"
  let minDistance = Infinity

  for (const [district, coords] of Object.entries(MAKASSAR_DISTRICT_COORDS)) {
    const d = calculateDistance(lat, lng, coords.lat, coords.lng)
    if (d < minDistance) {
      minDistance = d
      closestDistrict = district
    }
  }

  return closestDistrict
}

export const daftarFasilitas = makassarFacilities.map(f => ({
  id: f.id,
  nama: f.name,
  jenis: f.type,
  wilayah: f.district,
  kecamatan: f.district,
  alamat: f.address,
  lat: f.lat,
  lng: f.lng,
  jarakMeter: 500,
  jamOperasional: f.operatingHours,
  sampahDiterima: f.accepted,
  kontakWa: f.phone,
  catatan: f.address
}))
