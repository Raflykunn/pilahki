// Data konten edukasi pemilahan sampah rumah tangga (mengikut PRD Seksyen 7.4)
// Ditulis dengan bahasa awam dan praktikal khas untuk warga (persona Bu Rina)

export const kategoriEdukasiList = [
  {
    id: 'organik',
    nama: 'Sampah Organik',
    tagline: 'Mudah Membusuk & Jadi Kompos',
    warna: 'green',
    warnaWadah: 'Wadah Hijau',
    ringkasan: 'Semua sisa bahan makanan dan tumbuhan yang bisa terurai secara alami oleh tanah.',
    contoh: ['Sisa sayur & buah', 'Nasi basi & sisa lauk', 'Ampas kelapa & teh/kopi', 'Kulit telur', 'Dedaunan kering'],
    janganCampur: ['Plastik pembungkus sisa makanan', 'Minyak jelantah berlebih', 'Tisu basah sintetis'],
    langkahPraktis: [
      'Tiriskan kuah atau air dari sisa makanan sebelum dimasukkan ke wadah agar tidak cepat membusuk dan berbau asam.',
      'Gunakan wadah tertutup di dapur agar tidak dikerubungi lalat atau kecoak.',
      'Bila punya pekarangan, gali lubang biopori atau timbun sisa buah/sayur untuk dijadikan kompos alami.'
    ],
    tipsRina: 'Kulit jeruk atau serai bisa ditaruh di bawah tong sampah dapur untuk menyamarkan bau.'
  },
  {
    id: 'anorganik',
    nama: 'Sampah Anorganik',
    tagline: 'Bisa Didaur Ulang & Bernilai',
    warna: 'blue',
    warnaWadah: 'Wadah Biru / Kuning',
    ringkasan: 'Barang kering non-hayati yang tidak mudah membusuk dan dapat disetorkan ke Bank Sampah.',
    contoh: ['Botol plastik bening (PET)', 'Gelas air mineral', 'Kardus & karton telur', 'Kertas HVS/koran', 'Kaleng susu & minuman'],
    janganCampur: ['Kardus basah terkena minyak pekat', 'Botol plastik berisi sisa saus/minuman', 'Pecahan kaca campur'],
    langkahPraktis: [
      'Terapkan aturan 3B: Kosongkan isi, Bilas sedikit dengan air, lalu Keringkan.',
      'Gepengkan botol plastik dan lipat kardus tipis-tipis agar hemat tempat di rumah.',
      'Kumpulkan sampai jumlahnya cukup untuk disetor ke Bank Sampah terdekat agar menghasilkan saldo tabungan.'
    ],
    tipsRina: 'Lepaskan label plastik pada botol PET karena harga jualnya di bank sampah lebih tinggi bila botolnya bersih.'
  },
  {
    id: 'b3',
    nama: 'Limbah B3 (Berbahaya)',
    tagline: 'Racun & Zat Berbahaya',
    warna: 'amber',
    warnaWadah: 'Wadah Khusus Merah / Drop Box',
    ringkasan: 'Barang yang mengandung zat kimia beracun, mudah meledak, atau berisiko melukai petugas.',
    contoh: ['Baterai bekas (jam, remote, HP)', 'Lampu neon & bohlam TL', 'Wadah aerosol/semprotan nyamuk', 'Obat kedaluwarsa', 'Cairan pembersih lantai'],
    janganCampur: ['JANGAN dibakar', 'JANGAN dibuang ke saluran air/got', 'JANGAN dicampur ke tempat sampah biasa'],
    langkahPraktis: [
      'Tempelkan selotip bening pada kedua kutub baterai bekas untuk mencegah arus pendek.',
      'Simpan dalam toples atau kardus kecil terpisah jauh dari jangkauan anak-anak.',
      'Bawa ke drop box e-waste di kantor kelurahan atau serahkan saat ada pengumpulan B3 khusus di TPS.'
    ],
    tipsRina: 'Obat tablet kedaluwarsa sebaiknya dihancurkan dan dicampur tanah/kopi sebelum dibungkus terpisah agar tidak disalahgunakan.'
  },
  {
    id: 'residu',
    nama: 'Sampah Residu',
    tagline: 'Tempat Terakhir ke TPA',
    warna: 'slate',
    warnaWadah: 'Wadah Abu-abu / Hitam',
    ringkasan: 'Sampah yang sulit didaur ulang dan tidak dapat dikomposkan, sehingga harus diangkut ke TPA.',
    contoh: ['Popok sekali pakai & pembalut', 'Kemasan sachet multilayer (kopi, bumbu)', 'Tisu bekas pakai', 'Puntung rokok', 'Styrofoam kotor'],
    janganCampur: ['Limbah jarum suntik/medis tajam', 'Baterai bekas', 'Kardus bersih'],
    langkahPraktis: [
      'Untuk popok bayi: buang kotoran padat ke kloset terlebih dahulu, gulung rapat popok dan rekatkan perekatnya.',
      'Bungkus dalam kantong tertutup agar tidak tercecer atau diacak-acak hewan liar.',
      'Keluarkan saat jadwal pengangkutan residu wilayah Anda tiba.'
    ],
    tipsRina: 'Usahakan membawa kantong belanja kain saat ke pasar untuk memangkas timbunan kantong kresek residu di rumah.'
  }
]

export const artikelPanduan = [
  {
    id: 'art-1',
    kategoriId: 'organik',
    kategori: 'Organik & Dapur',
    judul: '3 Langkah Memulai Pilah Sampah di Dapur Sempit',
    ringkasan: 'Tidak perlu beli tong mahal. Cukup sediakan 2 wadah sederhana di bawah bak cuci piring.',
    estimasiBaca: '2 mnt',
    isi: [
      'Banyak ibu rumah tangga ragu memilah karena merasa dapurnya sempit dan takut repot. Padahal kuncinya cuma memisahkan yang basah (organik) dan yang kering (anorganik).',
      'Langkah 1: Siapkan ember kecil bekas cat atau toples bekas berpenutup untuk sisa dapur harian.',
      'Langkah 2: Sediakan satu kardus bekas untuk wadah botol, kaleng, dan kemasan kering.',
      'Langkah 3: Tiriskan sisa sayur sebelum dibuang ke ember basah. Anda akan terkejut melihat sampah rumah tangga berkurang drastis dan tidak lagi bau!'
    ]
  },
  {
    id: 'art-2',
    kategoriId: 'anorganik',
    kategori: 'Anorganik & Daur Ulang',
    judul: 'Cara Mencuci Botol & Wadah Plastik Tanpa Boros Air',
    ringkasan: 'Wadah minyak atau kecap kotor sering bikin bingung. Ini trik mencucinya dalam hitungan detik.',
    estimasiBaca: '3 mnt',
    isi: [
      'Bank sampah dan pemulung sering menolak botol yang masih ada sisa minyak atau sirup lengket karena mengundang semut dan busuk.',
      'Trik hemat air: Gunakan sisa air bilasan cucian piring terakhir untuk mengocok bagian dalam botol.',
      'Untuk botol minyak jelantah: tiriskan sisa minyak ke toples khusus minyak jelantah (jangan buang ke wastafel karena bikin mampet), lalu usap mulut botol dengan kain lap sisa.',
      'Injak botol hingga gepeng, pasang kembali tutupnya. Botol siap disetor!'
    ]
  },
  {
    id: 'art-3',
    kategoriId: 'b3',
    kategori: 'Limbah Berbahaya (B3)',
    judul: 'Di Mana Menyerahkan Baterai & Lampu Bekas?',
    ringkasan: 'Zat merkuri dan timbal pada baterai bocor bisa mencemari air tanah bila dibuang sembarangan.',
    estimasiBaca: '2 mnt',
    isi: [
      'Baterai bekas remote atau mainan anak sering kali tercecer di laci rumah. Padahal bila lapisan luarnya berkarat, racun kimianya berbahaya bila terkena tangan.',
      'Sediakan satu kotak plastik kecil khusus di rumah bertuliskan "Limbah Baterai".',
      'Saat kotak sudah terkumpul 5-10 buah, bawa ke kotak penampungan E-Waste di kantor kecamatan/kelurahan terdekat atau TPS 3R.',
      'Jika ragu lokasi drop box terdekat di Makassar, Anda bisa menanyakannya langsung lewat PilahAI!'
    ]
  }
]

export const faqPanduan = [
  {
    id: 'faq-1',
    q: 'Bolehkah minyak sisa menggoreng (jelantah) dibuang ke saluran wastafel?',
    tanya: 'Bolehkah minyak sisa menggoreng (jelantah) dibuang ke saluran wastafel?',
    a: 'Jangan pernah dibuang ke wastafel atau got! Minyak akan membeku dan menyumbat pipa got rumah serta mencemari air tanah. Sebaiknya kumpulkan minyak jelantah dingin dalam botol tertutup, banyak bank sampah unit di Makassar yang menerima dan membeli minyak jelantah per liter untuk diolah jadi biodiesel.',
    jawab: 'Jangan pernah dibuang ke wastafel atau got! Minyak akan membeku dan menyumbat pipa got rumah serta mencemari air tanah. Sebaiknya kumpulkan minyak jelantah dingin dalam botol tertutup, banyak bank sampah unit di Makassar yang menerima dan membeli minyak jelantah per liter untuk diolah jadi biodiesel.'
  },
  {
    id: 'faq-2',
    q: 'Apakah kertas bungkus nasi cokelat bisa disetor ke Bank Sampah?',
    tanya: 'Apakah kertas bungkus nasi cokelat bisa disetor ke Bank Sampah?',
    a: 'Tidak bisa. Kertas bungkus nasi cokelat dilapisi lapisan plastik tipis laminasi (kedap air) dan sudah terkena noda minyak makanan. Kertas ini masuk kategori Residu dan tidak dapat dilebur menjadi bubur kertas daur ulang biasa.',
    jawab: 'Tidak bisa. Kertas bungkus nasi cokelat dilapisi lapisan plastik tipis laminasi (kedap air) dan sudah terkena noda minyak makanan. Kertas ini masuk kategori Residu dan tidak dapat dilebur menjadi bubur kertas daur ulang biasa.'
  },
  {
    id: 'faq-3',
    q: 'Bagaimana kalau tetangga atau keluarga saya belum mau ikut memilah?',
    tanya: 'Bagaimana kalau tetangga atau keluarga saya belum mau ikut memilah?',
    a: 'Mulai dari dapur sendiri secara bertahap. Cukup pisahkan sisa basah (makanan) dan kering (botol/kardus). Saat tempat sampah rumah Anda terbukti tidak bau busuk dan tidak lagi diacak-acak kucing liar, keluarga dan tetangga biasanya akan lebih mudah terinspirasi untuk meniru.',
    jawab: 'Mulai dari dapur sendiri secara bertahap. Cukup pisahkan sisa basah (makanan) dan kering (botol/kardus). Saat tempat sampah rumah Anda terbukti tidak bau busuk dan tidak lagi diacak-acak kucing liar, keluarga dan tetangga biasanya akan lebih mudah terinspirasi untuk meniru.'
  },
  {
    id: 'faq-4',
    q: 'Apakah botol plastik harus dicopot label merknya sebelum disetor ke Bank Sampah?',
    tanya: 'Apakah botol plastik harus dicopot label merknya sebelum disetor ke Bank Sampah?',
    a: 'Sangat dianjurkan! Botol plastik bening (PET) yang sudah dicopot labelnya dan dilepas tutupnya memiliki nilai jual daur ulang yang lebih tinggi di Bank Sampah karena pabrik daur ulang tidak perlu memilah plastik jenis lain lagi.',
    jawab: 'Sangat dianjurkan! Botol plastik bening (PET) yang sudah dicopot labelnya dan dilepas tutupnya memiliki nilai jual daur ulang yang lebih tinggi di Bank Sampah karena pabrik daur ulang tidak perlu memilah plastik jenis lain lagi.'
  },
  {
    id: 'faq-5',
    q: 'Bagaimana cara membuang pecahan beling atau piring kaca dengan aman?',
    tanya: 'Bagaimana cara membuang pecahan beling atau piring kaca dengan aman?',
    a: 'Bungkus pecahan kaca tebal-tebal dengan koran atau masukkan ke dalam kardus kecil/botol plastik tebal, lalu beri selotip rapat. Beri tulisan spidol "Awas Pecahan Kaca" agar tidak melukai tangan petugas kebersihan saat mengangkut sampah.',
    jawab: 'Bungkus pecahan kaca tebal-tebal dengan koran atau masukkan ke dalam kardus kecil/botol plastik tebal, lalu beri selotip rapat. Beri tulisan spidol "Awas Pecahan Kaca" agar tidak melukai tangan petugas kebersihan saat mengangkut sampah.'
  },
  {
    id: 'faq-6',
    q: 'Kemasan kopi sachet dan bungkus mi instan masuk kategori apa?',
    tanya: 'Kemasan kopi sachet dan bungkus mi instan masuk kategori apa?',
    a: 'Kemasan sachet multilayer (campuran plastik foil metalizer) saat ini masuk kategori Sampah Residu karena sangat sulit dipisahkan lapisannya untuk didaur ulang konvensional.',
    jawab: 'Kemasan sachet multilayer (campuran plastik foil metalizer) saat ini masuk kategori Sampah Residu karena sangat sulit dipisahkan lapisannya untuk didaur ulang konvensional.'
  }
]
