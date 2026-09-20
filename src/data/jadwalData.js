/**
 * Data Jadwal Pengangkutan Sampah Kota Makassar
 * Dari prototipe Binfinity (app-schedules.js)
 */

export const MAKASSAR_DISTRICTS = [
  "Panakkukang",
  "Rappocini",
  "Ujung Pandang",
  "Tamalanrea",
  "Bontoala",
  "Mariso",
  "Manggala",
  "Tamalate"
]

export const schedulesDatabase = {
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
}

export function getDistrictSchedule(district) {
  if (schedulesDatabase[district]) {
    return schedulesDatabase[district]
  }
  return schedulesDatabase["Panakkukang"].map((item) => ({ ...item }))
}

// Backwards-compatible aliases
export const wilayahList = MAKASSAR_DISTRICTS.map((d, index) => ({
  id: `w-${index + 1}`,
  kecamatan: d,
  kelurahan: 'Pusat Kota',
  rw: 'RW 01-08',
  tpsTerdekat: `TPS 3R Wilayah ${d}`
}))

export const jadwalMaster = {
  'w-1': (schedulesDatabase["Panakkukang"] || []).map(s => ({
    hari: s.day,
    waktu: s.time,
    jenisSampah: s.category,
    kategori: s.category,
    catatan: s.notes
  }))
}
