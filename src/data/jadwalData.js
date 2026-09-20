/**
 * Data Jadwal Pengangkutan Sampah 8 Kecamatan Kota Makassar
 * Terhubung dengan armada DLH Kota Makassar, TPS 3R, Bank Sampah, dan TPA Tamangapa
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
      vehicle: "Truk Kompaktor Menuju TPA Tamangapa",
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
      vehicle: "Truk Kompaktor Menuju TPA Tamangapa",
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
      vehicle: "Truk Kompaktor Menuju TPA Tamangapa",
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
      vehicle: "Truk Kompaktor Menuju TPA Tamangapa",
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
  ],
  "Ujung Pandang": [
    {
      day: "Senin",
      status: "Ada Penjemputan",
      statusDot: "bg-emerald-500",
      time: "06.00 - 08.30 WITA",
      category: "Sampah Organik Rumah Tangga & Restoran",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "leaf",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Truk Pengangkut Organik DLH",
      notes: "Prioritas kawasan pemukiman padat dan koridor sentra kuliner."
    },
    {
      day: "Selasa",
      status: "Ada Penjemputan",
      statusDot: "bg-amber-500",
      time: "06.00 - 08.30 WITA",
      category: "Sampah Residu Kompaktor",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "trash-2",
      iconBg: "bg-slate-100 text-slate-700",
      vehicle: "Truk Kompaktor Menuju TPA Tamangapa",
      notes: "Sampah residu umum yang tidak dapat didaur ulang."
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
      vehicle: "Armada Motor Bank Sampah Unit",
      notes: "Penyetoran kardus, kertas perkantoran, dan botol PET."
    },
    {
      day: "Kamis",
      status: "Ada Penjemputan",
      statusDot: "bg-amber-500",
      time: "06.30 - 09.00 WITA",
      category: "Sampah Residu Niaga & Toko",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "trash-2",
      iconBg: "bg-slate-100 text-slate-700",
      vehicle: "Truk Kompaktor DLH",
      notes: "Kemasan plastik makanan, sachet, dan residu toko."
    },
    {
      day: "Jumat",
      status: "Tidak Ada Penjemputan",
      statusDot: "bg-slate-400",
      time: "-",
      category: "Pembersihan Rutin Kawasan Wisata Losari",
      badge: "bg-slate-100 text-slate-500 border-slate-200",
      icon: "calendar-off",
      iconBg: "bg-slate-100 text-slate-400",
      vehicle: "Satgas DLH Pantai Losari",
      notes: "Fokus kebersihan pesisir anjungan Pantai Losari."
    },
    {
      day: "Sabtu",
      status: "Ada Penjemputan",
      statusDot: "bg-amber-500",
      time: "06.30 - 09.30 WITA",
      category: "Sampah Residu Akhir Pekan",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "trash-2",
      iconBg: "bg-slate-100 text-slate-700",
      vehicle: "Truk Kompaktor Menuju TPA Tamangapa",
      notes: "Pengangkutan residu sebelum kepadatan lalu lintas akhir pekan."
    },
    {
      day: "Minggu",
      status: "Penyetoran Bank Sampah",
      statusDot: "bg-emerald-500",
      time: "08.00 - 11.30 WITA",
      category: "Layanan Bank Sampah Pesisir",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "award",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Pos Bank Sampah Unit Ujung Pandang",
      notes: "Bawa tabungan nasabah dan kumpulkan botol plastik pilahan."
    }
  ],
  "Tamalanrea": [
    {
      day: "Senin",
      status: "Ada Penjemputan",
      statusDot: "bg-amber-500",
      time: "06.00 - 08.30 WITA",
      category: "Sampah Residu Kawasan Kampus & Kos",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "trash-2",
      iconBg: "bg-slate-100 text-slate-700",
      vehicle: "Truk Kompaktor Menuju TPA Tamangapa",
      notes: "Pembersihan sampah residu pasca akhir pekan area perumahan & kos."
    },
    {
      day: "Selasa",
      status: "Ada Penjemputan",
      statusDot: "bg-emerald-500",
      time: "07.00 - 09.30 WITA",
      category: "Sampah Organik Dapur & Kantin",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "leaf",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Truk TPS 3R Tamalanrea",
      notes: "Sisa sayuran, buah, dan makanan dapur warga."
    },
    {
      day: "Rabu",
      status: "Ada Penjemputan",
      statusDot: "bg-blue-500",
      time: "08.30 - 11.30 WITA",
      category: "Anorganik (Kertas Skripsi, Buku, Botol PET)",
      badge: "bg-blue-50 text-blue-800 border-blue-200",
      icon: "recycle",
      iconBg: "bg-blue-100 text-blue-800",
      vehicle: "Armada Motor Bank Sampah Tamalanrea",
      notes: "Kertas HVS dan kardus terikat rapi dalam keadaan kering."
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
      vehicle: "Truk Kompaktor DLH",
      notes: "Styrofoam dan plastik sachet sekali pakai."
    },
    {
      day: "Jumat",
      status: "Tidak Ada Penjemputan",
      statusDot: "bg-slate-400",
      time: "-",
      category: "Libur Operasional Armada",
      badge: "bg-slate-100 text-slate-500 border-slate-200",
      icon: "calendar-off",
      iconBg: "bg-slate-100 text-slate-400",
      vehicle: "Tim Perawatan Armada",
      notes: "Gunakan komposter mandiri untuk sisa bahan organik."
    },
    {
      day: "Sabtu",
      status: "Ada Penjemputan",
      statusDot: "bg-emerald-500",
      time: "07.00 - 09.30 WITA",
      category: "Sampah Kebun & Ranting Perumahan",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "leaf",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Truk TPS 3R Tamalanrea",
      notes: "Hasil pangkas dahan dan dedaunan pekarangan rumah."
    },
    {
      day: "Minggu",
      status: "Penyetoran Bank Sampah",
      statusDot: "bg-emerald-500",
      time: "08.00 - 12.00 WITA",
      category: "Tabungan Bank Sampah Unit Tamalanrea",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "award",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Pos Bank Sampah Unit Tamalanrea Indah",
      notes: "Penimbangan botol PET, kardus tebal, dan minyak jelantah."
    }
  ],
  "Bontoala": [
    {
      day: "Senin",
      status: "Ada Penjemputan",
      statusDot: "bg-emerald-500",
      time: "06.30 - 09.00 WITA",
      category: "Sampah Organik Dapur TPS 3R",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "leaf",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Truk TPS 3R Bontoala Bersih",
      notes: "Letakkan wadah tertutup di depan pagar sebelum jadwal armada."
    },
    {
      day: "Selasa",
      status: "Ada Penjemputan",
      statusDot: "bg-amber-500",
      time: "06.00 - 08.30 WITA",
      category: "Sampah Residu Kompaktor",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "trash-2",
      iconBg: "bg-slate-100 text-slate-700",
      vehicle: "Truk Kompaktor Menuju TPA Tamangapa",
      notes: "Sampah residu padat rumah tangga."
    },
    {
      day: "Rabu",
      status: "Tidak Ada Penjemputan",
      statusDot: "bg-slate-400",
      time: "-",
      category: "Libur Operasional Pengangkutan",
      badge: "bg-slate-100 text-slate-500 border-slate-200",
      icon: "calendar-off",
      iconBg: "bg-slate-100 text-slate-400",
      vehicle: "-",
      notes: "Fokus pemilahan mandiri di rumah tangga."
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
      vehicle: "Truk Kompaktor DLH",
      notes: "Residu plastik kresek kotor dan kemasan sachet."
    },
    {
      day: "Jumat",
      status: "Ada Penjemputan",
      statusDot: "bg-blue-500",
      time: "08.00 - 10.30 WITA",
      category: "Anorganik & Kardus Masjid / Warga",
      badge: "bg-blue-50 text-blue-800 border-blue-200",
      icon: "recycle",
      iconBg: "bg-blue-100 text-blue-800",
      vehicle: "Gerobak Motor Bank Sampah",
      notes: "Kardus bekas dan botol plastik air mineral."
    },
    {
      day: "Sabtu",
      status: "Ada Penjemputan",
      statusDot: "bg-amber-500",
      time: "07.00 - 09.30 WITA",
      category: "Sampah Residu Akhir Pekan",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "trash-2",
      iconBg: "bg-slate-100 text-slate-700",
      vehicle: "Truk Kompaktor Menuju TPA Tamangapa",
      notes: "Pastikan tempat sampah tertutup rapat."
    },
    {
      day: "Minggu",
      status: "Penyetoran Bank Sampah",
      statusDot: "bg-emerald-500",
      time: "08.00 - 11.30 WITA",
      category: "Layanan Bank Sampah Bontoala",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "award",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Pos Bank Sampah Unit Bontoala",
      notes: "Layanan penimbangan sampah daur ulang."
    }
  ],
  "Mariso": [
    {
      day: "Senin",
      status: "Ada Penjemputan",
      statusDot: "bg-amber-500",
      time: "06.00 - 08.30 WITA",
      category: "Sampah Residu Awal Pekan",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "trash-2",
      iconBg: "bg-slate-100 text-slate-700",
      vehicle: "Truk Kompaktor Menuju TPA Tamangapa",
      notes: "Pengangkutan residu lingkungan pemukiman Mariso."
    },
    {
      day: "Selasa",
      status: "Ada Penjemputan",
      statusDot: "bg-emerald-500",
      time: "06.30 - 09.00 WITA",
      category: "Sampah Organik Dapur & Rumah Tangga",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "leaf",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Truk TPS 3R Mariso Mandiri",
      notes: "Sisa sayuran, buah-buahan, dan sisa makanan."
    },
    {
      day: "Rabu",
      status: "Ada Penjemputan",
      statusDot: "bg-blue-500",
      time: "08.00 - 11.00 WITA",
      category: "Anorganik Daur Ulang & Logam",
      badge: "bg-blue-50 text-blue-800 border-blue-200",
      icon: "recycle",
      iconBg: "bg-blue-100 text-blue-800",
      vehicle: "Motor Tiga Roda Bank Sampah",
      notes: "Botol PET, kaleng aluminium, dan kardus bersih."
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
      vehicle: "Truk Kompaktor DLH",
      notes: "Residu plastik sachet dan limbah kemasan kotor."
    },
    {
      day: "Jumat",
      status: "Tidak Ada Penjemputan",
      statusDot: "bg-slate-400",
      time: "-",
      category: "Libur Operasional Armada",
      badge: "bg-slate-100 text-slate-500 border-slate-200",
      icon: "calendar-off",
      iconBg: "bg-slate-100 text-slate-400",
      vehicle: "-",
      notes: "Pembersihan rutin kanal dan drainase wilayah."
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
      vehicle: "Truk TPS 3R Mariso Mandiri",
      notes: "Pengangkutan organik untuk olahan kompos Depo Mariso."
    },
    {
      day: "Minggu",
      status: "Penyetoran Bank Sampah",
      statusDot: "bg-emerald-500",
      time: "08.00 - 12.00 WITA",
      category: "Layanan Penimbangan Bank Sampah",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "award",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Pos Bank Sampah Unit Mariso",
      notes: "Penyetoran anorganik terpilah dan minyak jelantah."
    }
  ],
  "Manggala": [
    {
      day: "Senin",
      status: "Ada Penjemputan",
      statusDot: "bg-amber-500",
      time: "06.00 - 08.30 WITA",
      category: "Sampah Residu Kompaktor TPA",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "trash-2",
      iconBg: "bg-slate-100 text-slate-700",
      vehicle: "Armada Pengangkut TPA Tamangapa",
      notes: "Akses prioritas langsung ke TPA Tamangapa Antang."
    },
    {
      day: "Selasa",
      status: "Ada Penjemputan",
      statusDot: "bg-emerald-500",
      time: "07.00 - 09.30 WITA",
      category: "Sampah Organik & Kebun Warga",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "leaf",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Truk Organik TPS 3R Manggala",
      notes: "Pengolahan kompos komunitas perumahan Antang."
    },
    {
      day: "Rabu",
      status: "Ada Penjemputan",
      statusDot: "bg-blue-500",
      time: "08.00 - 11.00 WITA",
      category: "Anorganik (Plastik Daur Ulang & Botol)",
      badge: "bg-blue-50 text-blue-800 border-blue-200",
      icon: "recycle",
      iconBg: "bg-blue-100 text-blue-800",
      vehicle: "Armada Motor Bank Sampah Induk Manggala",
      notes: "Kardus, botol mineral bening, dan besi/kaleng."
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
      vehicle: "Armada Kompaktor TPA Tamangapa",
      notes: "Residu padat rumah tangga yang tidak terurai."
    },
    {
      day: "Jumat",
      status: "Tidak Ada Penjemputan",
      statusDot: "bg-slate-400",
      time: "-",
      category: "Pemeliharaan Rutin Fasilitas TPA",
      badge: "bg-slate-100 text-slate-500 border-slate-200",
      icon: "calendar-off",
      iconBg: "bg-slate-100 text-slate-400",
      vehicle: "Unit Operasional TPA Tamangapa",
      notes: "Pemeriksaan fasilitas sanitary landfill TPA."
    },
    {
      day: "Sabtu",
      status: "Ada Penjemputan",
      statusDot: "bg-amber-500",
      time: "06.30 - 09.30 WITA",
      category: "Sampah Residu Akhir Pekan",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "trash-2",
      iconBg: "bg-slate-100 text-slate-700",
      vehicle: "Armada Kompaktor TPA Tamangapa",
      notes: "Pengangkutan residu pemukiman Manggala."
    },
    {
      day: "Minggu",
      status: "Penyetoran Bank Sampah",
      statusDot: "bg-emerald-500",
      time: "08.00 - 12.00 WITA",
      category: "Layanan Tabungan Bank Sampah Manggala",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "award",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Pos Pelayanan Bank Sampah Manggala",
      notes: "Pencairan tabungan dan timbang anorganik."
    }
  ],
  "Tamalate": [
    {
      day: "Senin",
      status: "Ada Penjemputan",
      statusDot: "bg-emerald-500",
      time: "06.30 - 09.00 WITA",
      category: "Sampah Organik Dapur",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "leaf",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Truk TPS 3R Tamalate",
      notes: "Sisa sayur, buah-buahan, dan sisa bahan dapur."
    },
    {
      day: "Selasa",
      status: "Ada Penjemputan",
      statusDot: "bg-amber-500",
      time: "06.00 - 08.30 WITA",
      category: "Sampah Residu Kompaktor",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "trash-2",
      iconBg: "bg-slate-100 text-slate-700",
      vehicle: "Truk Kompaktor Menuju TPA Tamangapa",
      notes: "Residu padat rumah tangga dan kawasan komersial."
    },
    {
      day: "Rabu",
      status: "Ada Penjemputan",
      statusDot: "bg-blue-500",
      time: "08.00 - 11.00 WITA",
      category: "Anorganik Daur Ulang (Kardus, Botol PET)",
      badge: "bg-blue-50 text-blue-800 border-blue-200",
      icon: "recycle",
      iconBg: "bg-blue-100 text-blue-800",
      vehicle: "Armada Motor Bank Sampah Tamalate",
      notes: "Kardus pipih dan botol plastik bersih."
    },
    {
      day: "Kamis",
      status: "Tidak Ada Penjemputan",
      statusDot: "bg-slate-400",
      time: "-",
      category: "Libur Operasional Armada",
      badge: "bg-slate-100 text-slate-500 border-slate-200",
      icon: "calendar-off",
      iconBg: "bg-slate-100 text-slate-400",
      vehicle: "-",
      notes: "Gunakan komposter mandiri untuk sisa bahan organik."
    },
    {
      day: "Jumat",
      status: "Ada Penjemputan",
      statusDot: "bg-amber-500",
      time: "06.30 - 09.00 WITA",
      category: "Sampah Residu Umum",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "trash-2",
      iconBg: "bg-slate-100 text-slate-700",
      vehicle: "Truk Kompaktor DLH",
      notes: "Plastik kresek kotor, kemasan sachet, dan residu."
    },
    {
      day: "Sabtu",
      status: "Ada Penjemputan",
      statusDot: "bg-emerald-500",
      time: "07.00 - 09.30 WITA",
      category: "Sampah Organik & Kebun Akhir Pekan",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: "leaf",
      iconBg: "bg-emerald-100 text-emerald-800",
      vehicle: "Truk TPS 3R Tamalate",
      notes: "Hasil pemangkasan dahan dan dedaunan pekarangan."
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
      vehicle: "Pos Bank Sampah Unit Tamalate",
      notes: "Bawa buku tabungan nasabah dan kumpulkan anorganik."
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
