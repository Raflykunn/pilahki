// Data jadual pengangkutan sampah contoh wilayah perbandaran (mengikut PRD Seksyen 7.3 & 12)
export const wilayahList = [
  {
    id: 'kel-sukajadi-rw03',
    kecamatan: 'Kecamatan Sukajadi',
    kelurahan: 'Kelurahan Pasteur',
    rw: 'RW 03 (Jl. Sukajadi & sekitarnya)',
    tpsTerdekat: 'TPS Sukajadi Indah (450 m)'
  },
  {
    id: 'kel-coblong-rw05',
    kecamatan: 'Kecamatan Coblong',
    kelurahan: 'Kelurahan Dago',
    rw: 'RW 05 (Jl. Ir. H. Juanda)',
    tpsTerdekat: 'TPS Dago Resik (600 m)'
  },
  {
    id: 'kel-lengkong-rw02',
    kecamatan: 'Kecamatan Lengkong',
    kelurahan: 'Kelurahan Malabar',
    rw: 'RW 02 (Jl. Palasari & sekitarnya)',
    tpsTerdekat: 'TPS 3R Lengkong Lestari (350 m)'
  },
  {
    id: 'kel-cicendo-rw04',
    kecamatan: 'Kecamatan Cicendo',
    kelurahan: 'Kelurahan Pasirkaliki',
    rw: 'RW 04 (Jl. Kebon Jati)',
    tpsTerdekat: 'TPS Pasirkaliki Bersih (500 m)'
  }
]

export const jadwalMaster = {
  'kel-sukajadi-rw03': [
    {
      id: 'j-1',
      hari: 'Senin',
      hariIndex: 1, // 0: Ahad, 1: Isnin, dst.
      waktu: '06:30 - 08:30 WIB',
      jenisSampah: 'Organik (Sisa Makanan & Dedaunan)',
      kategori: 'organik',
      petugas: 'Armada Gerobak Motor DLH',
      catatan: 'Ikat rapat kantung sampah organik. Taruh di depan pagar sebelum jam 06:30 WIB.',
      diterima: ['Sisa sayur & buah', 'Kulit telur', 'Dedaunan kering', 'Sisa nasi'],
      tidakDiterima: ['Plastik pembungkus', 'Pampers', 'Baterai']
    },
    {
      id: 'j-2',
      hari: 'Rabu',
      hariIndex: 3,
      waktu: '07:00 - 09:00 WIB',
      jenisSampah: 'Anorganik (Plastik, Kertas, Kardus)',
      kategori: 'anorganik',
      petugas: 'Armada Truk Pilah Wilayah',
      catatan: 'Pastikan botol atau wadah plastik dalam keadaan dibilas dan kering.',
      diterima: ['Botol plastik bersih', 'Kardus terlipat', 'Kertas bekas', 'Kaleng minuman'],
      tidakDiterima: ['Sisa makanan berminyak', 'Styrofoam kotor']
    },
    {
      id: 'j-3',
      hari: 'Jumat',
      hariIndex: 5,
      waktu: '06:30 - 08:30 WIB',
      jenisSampah: 'Organik (Sisa Dapur Mingguan)',
      kategori: 'organik',
      petugas: 'Armada Gerobak Motor DLH',
      catatan: 'Pengangkutan kedua untuk sampah basah dapur agar tidak menimbulkan bau di akhir pekan.',
      diterima: ['Sisa makanan', 'Ampas kelapa', 'Sisa masakan'],
      tidakDiterima: ['Kemasan sachet plastik']
    },
    {
      id: 'j-4',
      hari: 'Sabtu',
      hariIndex: 6,
      waktu: '08:00 - 10:00 WIB',
      jenisSampah: 'Residu (Popok, Pembalut, Puntung Rokok)',
      kategori: 'residu',
      petugas: 'Truk Sampah Residural Kota',
      catatan: 'Khusus sampah yang tidak bisa didaur ulang atau dikomposkan.',
      diterima: ['Popok sekali pakai', 'Pembalut bekas', 'Tisu basah kotor', 'Pecahan keramik kecil'],
      tidakDiterima: ['Baterai/Limbah B3 (Serahkan ke Dropbox TPS)']
    }
  ],
  'kel-coblong-rw05': [
    {
      id: 'j-5',
      hari: 'Selasa',
      hariIndex: 2,
      waktu: '06:00 - 08:00 WIB',
      jenisSampah: 'Organik',
      kategori: 'organik',
      petugas: 'Armada DLH Kecamatan',
      catatan: 'Keluarkan wadah sampah organik sebelum jam 06:00 WIB.',
      diterima: ['Sisa dapur', 'Sayuran', 'Buah-buahan'],
      tidakDiterima: ['Plastik kresek']
    },
    {
      id: 'j-6',
      hari: 'Kamis',
      hariIndex: 4,
      waktu: '07:00 - 09:00 WIB',
      jenisSampah: 'Anorganik (Daur Ulang)',
      kategori: 'anorganik',
      petugas: 'Mitra Bank Sampah Unit Coblong',
      catatan: 'Dipilah dan dipres bila memungkinkan.',
      diterima: ['Kardus', 'Plastik PET', 'Aluminium'],
      tidakDiterima: ['Sampah basah']
    },
    {
      id: 'j-7',
      hari: 'Sabtu',
      hariIndex: 6,
      waktu: '06:00 - 08:30 WIB',
      jenisSampah: 'Organik & Residu Terpisah',
      kategori: 'residu',
      petugas: 'Armada DLH Kecamatan',
      catatan: 'Gunakan wadah terpisah berlabel warna.',
      diterima: ['Sisa makanan', 'Residu rumah tangga'],
      tidakDiterima: ['B3/Elektronik']
    }
  ],
  'kel-lengkong-rw02': [
    {
      id: 'j-8',
      hari: 'Senin',
      hariIndex: 1,
      waktu: '06:30 - 08:30 WIB',
      jenisSampah: 'Organik',
      kategori: 'organik',
      petugas: 'Tim Kebersihan Kelurahan',
      catatan: 'Sampah organik diolah langsung ke rumah kompos TPS 3R.',
      diterima: ['Sisa makanan', 'Daun taman'],
      tidakDiterima: ['Plastik']
    },
    {
      id: 'j-9',
      hari: 'Rabu',
      hariIndex: 3,
      waktu: '07:30 - 09:30 WIB',
      jenisSampah: 'Anorganik',
      kategori: 'anorganik',
      petugas: 'Mobil Pengangkut Anorganik',
      catatan: 'Kertas dan plastik kering.',
      diterima: ['Buku bekas', 'Botol plastik', 'Kaleng'],
      tidakDiterima: ['Residu basah']
    },
    {
      id: 'j-10',
      hari: 'Jumat',
      hariIndex: 5,
      waktu: '06:30 - 08:30 WIB',
      jenisSampah: 'Organik & Residu',
      kategori: 'residu',
      petugas: 'Tim Kebersihan Kelurahan',
      catatan: 'Penjemputan rutin akhir pekan.',
      diterima: ['Semua sampah terpilah'],
      tidakDiterima: ['Limbah B3']
    }
  ],
  'kel-cicendo-rw04': [
    {
      id: 'j-11',
      hari: 'Selasa',
      hariIndex: 2,
      waktu: '07:00 - 09:00 WIB',
      jenisSampah: 'Organik',
      kategori: 'organik',
      petugas: 'Gerobak Kebersihan RW',
      catatan: 'Taruh di depan rumah maksimal pukul 07:00.',
      diterima: ['Sisa sayur/buah/lauk'],
      tidakDiterima: ['Bahan kimia']
    },
    {
      id: 'j-12',
      hari: 'Jumat',
      hariIndex: 5,
      waktu: '07:00 - 09:30 WIB',
      jenisSampah: 'Anorganik & Residu',
      kategori: 'anorganik',
      petugas: 'Armada Truk Wilayah',
      catatan: 'Pisahkan kardus dan plastik dalam karung terpisah.',
      diterima: ['Kardus', 'Plastik', 'Residu'],
      tidakDiterima: ['Limbah jarum suntik/medis']
    }
  ]
}
