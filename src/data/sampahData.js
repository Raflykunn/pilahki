// Database jenis sampah umum rumah tangga (mengikut PRD Seksyen 7.1 — minimal 20 item)
export const kategoriConfig = {
  organik: {
    label: 'Organik',
    warna: 'green',
    warnaBg: '#f0fdf4',
    warnaBorder: '#bbf7d0',
    warnaText: '#15803d',
    deskripsiUmum: 'Sampah alami yang mudah membusuk dan dapat diolah menjadi kompos.'
  },
  anorganik: {
    label: 'Anorganik',
    warna: 'blue',
    warnaBg: '#eff6ff',
    warnaBorder: '#bfdbfe',
    warnaText: '#1d4ed8',
    deskripsiUmum: 'Sampah kering daur ulang yang bernilai ekonomis dan diterima di Bank Sampah.'
  },
  b3: {
    label: 'Limbah B3',
    warna: 'amber',
    warnaBg: '#fffbeb',
    warnaBorder: '#fde68a',
    warnaText: '#b45309',
    deskripsiUmum: 'Bahan Berbahaya & Beracun yang memerlukan penanganan khusus dan drop box terpisah.'
  },
  residu: {
    label: 'Residu',
    warna: 'slate',
    warnaBg: '#f8fafc',
    warnaBorder: '#e2e8f0',
    warnaText: '#475569',
    deskripsiUmum: 'Sampah yang sulit didaur ulang dan harus dibungkus rapat menuju TPA.'
  }
}

export const daftarSampah = [
  {
    id: 's-1',
    nama: 'Botol Plastik Air Mineral (PET)',
    kategori: 'anorganik',
    alias: ['botol aqua', 'botol plastik', 'pet', 'botol mineral', 'plastik bening'],
    penanganan: [
      'Kosongkan cairan di dalam botol hingga tuntas.',
      'Lepaskan label plastik pembungkus merk (label masuk residu).',
      'Remas atau injak botol hingga gepeng untuk menghemat ruang.',
      'Pasang kembali tutupnya dan simpan di wadah anorganik kering.'
    ],
    tujuanPenyaluran: 'Bank Sampah Terdekat atau Pemulung',
    tipsPraktis: 'Botol PET bersih tanpa label memiliki harga timbangan paling tinggi di Bank Sampah.'
  },
  {
    id: 's-2',
    nama: 'Baterai Bekas (AA, AAA, Kancing, HP)',
    kategori: 'b3',
    alias: ['baterai', 'batu baterai', 'aki kecil', 'batre', 'battery'],
    penanganan: [
      'Jangan sekali-kali membakar atau membuang baterai ke tanah/got.',
      'Tutup kedua kutub baterai (+ dan -) dengan selotip bening untuk mencegah arus pendek.',
      'Kumpulkan dalam wadah toples kering terpisah jauh dari anak-anak.',
      'Bawa ke Dropbox E-Waste di kelurahan atau TPS B3 terdekat.'
    ],
    tujuanPenyaluran: 'Drop Box E-Waste Kelurahan / TPS B3',
    tipsPraktis: 'Cairan baterai yang bocor mengandung logam berat merkuri yang dapat meracuni air tanah.'
  },
  {
    id: 's-3',
    nama: 'Kemasan Sachet Kopi / Bumbu (Multilayer)',
    kategori: 'residu',
    alias: ['sachet', 'bungkus royco', 'saset', 'bungkus kopi', 'foil plastik', 'kemasan mie instan'],
    penanganan: [
      'Kosongkan sisa serbuk atau bumbu di dalamnya.',
      'Gunting sedikit dan bersihkan jika berminyak.',
      'Kumpulkan dalam kantong residu tertutup.',
      'Serahkan saat jadwal truk residu kota atau manfaatkan untuk kerajinan ecobrick bila kering.'
    ],
    tujuanPenyaluran: 'Truk Sampah Residu Lingkungan (TPA)',
    tipsPraktis: 'Kemasan sachet terbuat dari lapisan plastik dan aluminium foil yang tidak bisa dilebur mesin daur ulang biasa.'
  },
  {
    id: 's-4',
    nama: 'Sisa Sayur & Kulit Buah',
    kategori: 'organik',
    alias: ['kulit buah', 'sayur busuk', 'sisa sayuran', 'kulit pisang', 'potongan wortel'],
    penanganan: [
      'Tiriskan sisa air cucian atau kuah sayur.',
      'Potong kecil-kecil bila ingin dijadikan kompos agar cepat terurai.',
      'Masukkan ke tong sampah dapur tertutup atau lubang biopori pekarangan.'
    ],
    tujuanPenyaluran: 'Kompos Mandiri / Gerobak Sampah Organik TPS 3R',
    tipsPraktis: 'Jangan campur dengan kantong kresek pengikat sayur saat membuang.'
  },
  {
    id: 's-5',
    nama: 'Nasi Basi & Sisa Makanan Berkuah',
    kategori: 'organik',
    alias: ['nasi sisa', 'makanan sisa', 'lauk basi', 'kuah gulai'],
    penanganan: [
      'Saring kuah/cairan ke saringan wastafel (jangan buang minyak pekat).',
      'Masukkan nasi basi ke wadah organik tertutup.',
      'Bisa diolah menjadi Mikroorganisme Lokal (MOL) atau pakan maggot BSF.'
    ],
    tujuanPenyaluran: 'Pengolahan Organik TPS 3R / Pakan Ternak',
    tipsPraktis: 'Nasi basi yang ditaburi sedikit bekatul atau sekam tidak akan berbau menyengat.'
  },
  {
    id: 's-6',
    nama: 'Minyak Goreng Bekas (Minyak Jelantah)',
    kategori: 'anorganik',
    alias: ['jelantah', 'minyak bekas', 'minyak goreng bekas', 'oli bekas'],
    penanganan: [
      'Tunggu hingga minyak dingin sehabis memasak.',
      'Saring sisa remahan tepung/makanan.',
      'Tuangkan ke dalam botol atau jeriken plastik tertutup rapat.',
      'JANGAN PERNAH dibuang ke wastafel atau got rumah karena membeku dan menyumbat saluran.'
    ],
    tujuanPenyaluran: 'Bank Sampah Penerima Jelantah / Komunitas Biodiesel',
    tipsPraktis: 'Minyak jelantah dapat dijual per liter ke pengepul resmi untuk bahan baku bahan bakar terbarukan (biofuel).'
  },
  {
    id: 's-7',
    nama: 'Kardus Paket & Box Makanan',
    kategori: 'anorganik',
    alias: ['kardus', 'karton', 'box paket', 'kardus sepatu', 'kotak kardus'],
    penanganan: [
      'Lepaskan lakban cokelat dan stiker resi pengiriman plastik.',
      'Lipat kardus hingga pipih dan ikat dengan tali rafia bila jumlahnya banyak.',
      'Pastikan kardus dalam keadaan kering dan tidak terkena tumpahan kuah minyak.'
    ],
    tujuanPenyaluran: 'Bank Sampah / Pengepul Kertas',
    tipsPraktis: 'Kardus tebal cokelat adalah salah satu komoditas daur ulang paling dicari dan bernilai stabil.'
  },
  {
    id: 's-8',
    nama: 'Kaleng Minuman & Susu (Aluminium/Besi)',
    kategori: 'anorganik',
    alias: ['kaleng', 'kaleng soda', 'kaleng susu', 'seng', 'kaleng biskuit'],
    penanganan: [
      'Bilas sisa minuman manis atau susu kental dengan air agar tidak dikerubungi semut.',
      'Injak atau tekan kaleng agar pipih bila memungkinkan.',
      'Kumpulkan bersama kelompok anorganik logam.'
    ],
    tujuanPenyaluran: 'Bank Sampah Logam',
    tipsPraktis: 'Aluminium kaleng minuman dapat didaur ulang tanpa batas tanpa menurunkan kualitas logamnya.'
  },
  {
    id: 's-9',
    nama: 'Lampu Neon / Bohlam TL / LED Rusak',
    kategori: 'b3',
    alias: ['lampu', 'bohlam', 'lampu neon', 'lampu philips', 'tl', 'neon'],
    penanganan: [
      'Bungkus lampu dengan kardus aslinya atau koran agar tidak pecah.',
      'Jangan memecahkan kaca lampu karena uap merkuri di dalamnya beracun bila terhirup.',
      'Serahkan ke dropbox limbah B3.'
    ],
    tujuanPenyaluran: 'Drop Box E-Waste / TPS B3',
    tipsPraktis: 'Bila lampu pecah tanpa sengaja, buka ventilasi ruangan dan gunakan lap basah untuk membersihkan serpihan (jangan gunakan vacuum cleaner).'
  },
  {
    id: 's-10',
    nama: 'Popok Bayi (Pampers) & Pembalut Wanita',
    kategori: 'residu',
    alias: ['popok', 'pampers', 'pembalut', 'diapers', 'pampers bekas'],
    penanganan: [
      'Keluarkan kotoran padat ke kloset dan siram.',
      'Gulung popok/pembalut ke arah dalam dan rekatkan perekat sampingnya.',
      'Bungkus dalam plastik kecil terpisah dan ikat rapat.',
      'Keluarkan hanya saat jadwal pengangkutan residu.'
    ],
    tujuanPenyaluran: 'Truk Sampah Residu Kota',
    tipsPraktis: 'Membuang kotoran padat ke toilet mengurangi bau menyengat di tong sampah secara drastis.'
  },
  {
    id: 's-11',
    nama: 'Tisu Bekas Pakai & Tisu Basah',
    kategori: 'residu',
    alias: ['tisu', 'tissue', 'tisu basah', 'tisu makan'],
    penanganan: [
      'Jangan masukkan ke saluran kloset karena serat tisu basah tidak mudah hancur dan membuat pipa tersumbat.',
      'Masukkan langsung ke tempat sampah residu rumah.'
    ],
    tujuanPenyaluran: 'TPA Sampah Kota',
    tipsPraktis: 'Tisu yang sudah terkena minyak makanan atau ingus tidak dapat didaur ulang menjadi kertas baru.'
  },
  {
    id: 's-12',
    nama: 'Botol Kaca Sirup / Kecap / Selai',
    kategori: 'anorganik',
    alias: ['botol kaca', 'beling', 'toples kaca', 'botol kecap', 'botol sirup'],
    penanganan: [
      'Cuci bersih sisa kecap atau sirup.',
      'Lepaskan tutup botol logam/plastik.',
      'Simpan dalam kardus terpisah agar tidak beradu dan pecah.'
    ],
    tujuanPenyaluran: 'Bank Sampah / Tukang Loak',
    tipsPraktis: 'Botol kecap atau sirup berstandar sering kali diambil kembali oleh produsen melalui sistem botol balikan.'
  },
  {
    id: 's-13',
    nama: 'Kantong Plastik Kresek Kotor / Tipis',
    kategori: 'residu',
    alias: ['kresek', 'plastik belanja', 'kresek hitam', 'kantong kresek'],
    penanganan: [
      'Bila masih bersih, simpan dan gunakan kembali untuk berbelanja.',
      'Bila sudah kotor terkena kuah atau robek parah, masukkan ke tong residu.'
    ],
    tujuanPenyaluran: 'Truk Residu Lingkungan',
    tipsPraktis: 'Bawa tas belanja kain lipat di dalam tas kerja/pasar untuk menghindari penumpukan kantong kresek.'
  },
  {
    id: 's-14',
    nama: 'Gelas Plastik Air Mineral (PP)',
    kategori: 'anorganik',
    alias: ['gelas aqua', 'cup plastik', 'gelas plastik', 'gelas pop ice'],
    penanganan: [
      'Cabut tutup sedotan plastik lid bagian atas.',
      'Kosongkan air dan tumpuk gelas plastik rapi memanjang.',
      'Kumpulkan bersama barang anorganik plastik.'
    ],
    tujuanPenyaluran: 'Bank Sampah',
    tipsPraktis: 'Gelas plastik PP bernilai tinggi bagi pabrik daur ulang biji plastik tali rafia dan ember cor.'
  },
  {
    id: 's-15',
    nama: 'Obat Kedaluwarsa & Sirup Obat Sisa',
    kategori: 'b3',
    alias: ['obat', 'obat basi', 'obat kedaluwarsa', 'sirup obat', 'kapsul bekas'],
    penanganan: [
      'Untuk obat tablet: keluarkan dari blister, hancurkan, dan campur dengan bubuk kopi/tanah agar tidak diminum hewan/orang lain.',
      'Untuk obat sirup: buang cairan ke saluran air yang mengalir bersama sabun cuci.',
      'Rusak label botol obat sebelum wadahnya dibuang.'
    ],
    tujuanPenyaluran: 'Drop Box Farmasi / TPS B3',
    tipsPraktis: 'Beberapa apotek jaringan dan puskesmas menerima program serah obat kedaluwarsa untuk dimusnahkan secara aman.'
  },
  {
    id: 's-16',
    nama: 'Kaleng Semprotan Nyamuk / Aerosol / Deodoran',
    kategori: 'b3',
    alias: ['baygon', 'semprotan nyamuk', 'hit', 'pilox', 'aerosol'],
    penanganan: [
      'Pastikan gas di dalam kaleng sudah habis terpakai.',
      'JANGAN menusuk atau melubangi kaleng karena sisa tekanan gas dapat memicu percikan api.',
      'Serahkan terpisah kepada petugas kebersihan atau drop box B3.'
    ],
    tujuanPenyaluran: 'Drop Box B3 / Petugas Khusus',
    tipsPraktis: 'Wadah aerosol yang dibakar di tempat sampah liar adalah penyebab utama ledakan di tempat pembuangan.'
  },
  {
    id: 's-17',
    nama: 'Kulit Telur Ayam / Bebek',
    kategori: 'organik',
    alias: ['cangkang telur', 'kulit telor', 'kulit telur'],
    penanganan: [
      'Bilas sedikit bila berlendir putih telur.',
      'Remas dengan tangan hingga berbutir kecil.',
      'Bisa langsung ditaburkan di atas tanah pot tanaman sebagai kalsium alami atau dimasukkan ke komposter.'
    ],
    tujuanPenyaluran: 'Pupuk Tanaman / Kompos Mandiri',
    tipsPraktis: 'Butiran cangkang telur di sekitar tanaman juga efektif mencegah siput dan hama bekicot mendekat.'
  },
  {
    id: 's-18',
    nama: 'Ampas Kopi & Teh Celup',
    kategori: 'organik',
    alias: ['ampas kopi', 'ampas teh', 'kantong teh celup', 'teh basi'],
    penanganan: [
      'Lepaskan benang dan isi kantong teh bila kantongnya terbuat dari serat plastik jaring.',
      'Ampas kopi bisa langsung ditabur ke media tanam bunga untuk penyubur tanah.'
    ],
    tujuanPenyaluran: 'Kompos / Media Tanam',
    tipsPraktis: 'Ampas kopi kering efektif menyerap bau apek di dalam kulkas atau lemari sepatu.'
  },
  {
    id: 's-19',
    nama: 'Wadah Styrofoam Makanan Kotor',
    kategori: 'residu',
    alias: ['styrofoam', 'sterofoam', 'gabus makanan', 'wadah seblak'],
    penanganan: [
      'Buang sisa makanan kuah ke tempat organik.',
      'Patahkan styrofoam agar hemat tempat.',
      'Masukkan ke tempat sampah residu (karena tidak diterima bank sampah).'
    ],
    tujuanPenyaluran: 'TPA',
    tipsPraktis: 'Kurangi pemakaian styrofoam untuk makanan panas karena partikel mikronya dapat larut ke dalam kuah makanan berlemak.'
  },
  {
    id: 's-20',
    nama: 'Kertas HVS / Buku / Koran Bekas',
    kategori: 'anorganik',
    alias: ['kertas', 'hvs', 'buku bekas', 'koran', 'majalah', 'kertas ujian'],
    penanganan: [
      'Pisahkan kertas dari klip kertas besi atau map plastik.',
      'Tumpuk rapi dan ikat dengan tali.',
      'Jaga agar tidak basah terkena air hujan.'
    ],
    tujuanPenyaluran: 'Bank Sampah / Daur Ulang Kertas',
    tipsPraktis: 'Kertas putih HVS bersih memiliki harga kiloan lebih tinggi dibanding kertas buram atau koran.'
  },
  {
    id: 's-21',
    nama: 'Pecahan Keramik / Genteng / Kaca Cermin',
    kategori: 'residu',
    alias: ['piring pecah', 'cermin pecah', 'keramik', 'genteng'],
    penanganan: [
      'Bungkus pecahan tajam dengan koran tebal atau kardus bekas berlapis.',
      'Tuliskan peringatan "AWAS KACA PECAH" di bagian luar dengan spidol agar tidak melukai tangan petugas kebersihan.',
      'Masukkan ke tong residu.'
    ],
    tujuanPenyaluran: 'TPA Kota',
    tipsPraktis: 'Kaca cermin dan keramik memiliki titik lebur berbeda dengan botol beling biasa, sehingga tidak bisa didaur ulang di pabrik botol.'
  },
  {
    id: 's-22',
    nama: 'Dedaunan Kering & Ranting Pangkasan Kebun',
    kategori: 'organik',
    alias: ['daun kering', 'ranting', 'rumput', 'pangkasan taman'],
    penanganan: [
      'Kumpulkan dalam karung goni atau karung beras bekas.',
      'Gunakan sebagai mulsa pelindung tanah pot atau masukkan ke lubang resapan biopori.',
      'Serahkan ke armada organik TPS 3R.'
    ],
    tujuanPenyaluran: 'Kompos / TPS 3R',
    tipsPraktis: 'JANGAN membakar dedaunan kering di pemukiman karena asapnya mencemari udara dan memicu gangguan pernapasan tetangga.'
  }
]
