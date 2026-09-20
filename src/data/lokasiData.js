/**
 * Data Fasilitas Pengelolaan Sampah Kota Makassar
 * Dari prototipe Binfinity (app-facilities.js)
 */

export const MAKASSAR_CENTER = { lat: -5.1342, lng: 119.4140 }

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
  drop_box_b3: {
    label: 'Drop Box B3',
    typeName: 'Drop Box B3',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    accentColor: '#d97706',
    desc: 'Titik penampungan khusus baterai, lampu, obat kedaluwarsa, dan limbah elektronik rumah tangga.'
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
]

// Haversine formula distance calculation in kilometers
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of earth in KM
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

// Backwards-compatible aliases
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
