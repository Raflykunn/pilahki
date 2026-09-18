// Data konten edukasi pemilahan sampah rumah tangga (mengikut PRD Seksyen 7.4)
// Ditulis dengan bahasa awam dan praktikal khas untuk warga (persona Bu Rina)

export const kategoriEdukasiList = [
  {
    id: 'organik',
    nama: 'Sampah Organik',
    tagline: 'Mudah Membusuk & Jadi Kompos',
    warna: 'green',
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
    ringkasan: 'Sampah yang sulit didaur ulang dan tidak dapat dikomposkan, sehingga harus diangkut ke TPA.',
    contoh: ['Popok sekali pakai & pembalut', 'Kemasan sachet multilayer (kopi, bumbu)', 'Tisu bekas pakai', 'Puntung rokok', 'Styrofoam kotor'],
    janganCampur: ['Limbah jarum suntik/medis tajam', 'Baterai bekas', 'Kardus bersih'],
    langkahPraktis: [
      'Untuk popok bayi: buang kotoran padat ke kloset terlebih dahulu, gulung rapat popok dan rekatkan perekatnya.',
      'Bungkus dalam kantong tertutup agar tidak tercecer atau diacak-acak hewan liar.',
      'Keluarkan saat jadwal pengangkutan residu wilayah Anda tiba.'
    ],
    tipsRina: 'Usahakan membawa kantong belanja kain saat ke pasar untuk memangkas timbunan kantong kresek kresek residu di rumah.'
  }
]

export const artikelPanduan = [
  {
    id: 'art-1',
    kategoriId: 'organik',
    judul: '3 Langkah Memulai Pilah Sampah di Dapur Sempit',
    ringkasan: 'Tidak perlu beli tong mahal. Cukup sediakan 2 wadah sederhana di bawah bak cuci piring.',
    waktuBaca: '2 menit baca',
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
    judul: 'Cara Mencuci Botol & Wadah Plastik Tanpa Boros Air',
    ringkasan: 'Wadah minyak atau kecap kotor sering bikin bingung. Ini trik mencucinya dalam hitungan detik.',
    waktuBaca: '3 menit baca',
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
    judul: 'Di Mana Menyerahkan Baterai & Lampu Bekas?',
    ringkasan: 'Zat merkuri dan timbal pada baterai bocor bisa mencemari air sumur jika dibuang ke pekarangan.',
    waktuBaca: '2 menit baca',
    isi: [
      'Baterai bekas remote atau mainan anak sering kali tercecer di laci rumah. Padahal bila lapisan luarnya berkarat, racun kimianya berbahaya bila terkena tangan.',
      'Sediakan satu kotak plastik kecil khusus di rumah bertuliskan "Limbah Baterai".',
      'Saat kotak sudah terkumpul 5-10 buah, bawa ke kotak penampungan E-Waste yang sekarang ada di sebagian besar kantor kelurahan, halte bus kota, atau TPS 3R wilayah.',
      'Jika ragu lokasi drop box terdekat, Anda bisa menanyakannya langsung lewat PilahAI!'
    ]
  }
]

export const faqPanduan = [
  {
    q: 'Bolehkah minyak sisa menggoreng (jelantah) dibuang ke saluran wastafel?',
    a: 'Jangan pernah dibuang ke wastafel karena minyak akan membeku dan menyumbat pipa got rumah. Kumpulkan minyak jelantah dingin dalam botol tertutup — saat ini banyak komunitas Bank Sampah yang membeli minyak jelantah per liter untuk biofuel.'
  },
  {
    q: 'Apakah kertas bungkus nasi cokelat masuk kertas daur ulang?',
    a: 'Tidak, kertas bungkus nasi cokelat dilapisi lapisan plastik tipis kedap air dan terkena minyak makanan, sehingga masuk kategori Residu.'
  },
  {
    q: 'Bagaimana kalau tetangga atau keluarga saya belum mau ikut memilah?',
    a: 'Mulai dari dapur sendiri secara bertahap. Cukup bedakan sampah basah dan kering dulu. Saat tempat sampah rumah Anda terbebas dari bau belatung dan kucing liar, tetangga biasanya akan tertarik meniru.'
  }
]
