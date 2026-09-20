

export const CATEGORY_THEMES = {
  organik: {
    name: 'Organik',
    icon: 'leaf',
    iconBox: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    hoverBorder: 'hover:border-emerald-300',
    accentHover: 'group-hover:text-emerald-800',
  },
  anorganik: {
    name: 'Anorganik',
    icon: 'recycle',
    iconBox: 'bg-blue-50 text-blue-700 border border-blue-100',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    hoverBorder: 'hover:border-blue-300',
    accentHover: 'group-hover:text-blue-800',
  },
  b3: {
    name: 'B3',
    icon: 'alert-triangle',
    iconBox: 'bg-amber-50 text-amber-700 border border-amber-100',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    hoverBorder: 'hover:border-amber-300',
    accentHover: 'group-hover:text-amber-800',
  },
  residu: {
    name: 'Residu',
    icon: 'trash-2',
    iconBox: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    hoverBorder: 'hover:border-slate-300',
    accentHover: 'group-hover:text-slate-800',
  }
}

export const wasteData = [
  {
    id: "botol-pet",
    name: "Botol Plastik PET (Air Mineral)",
    category: "anorganik",
    categoryName: "Anorganik",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    recyclableValue: "Tinggi (Rp 2.500 - Rp 4.500 / kg)",
    shortDesc: "Botol bening kemasan minuman. Lepas tutup dan cincin segel, lalu remas hingga pipih.",
    steps: [
      "Kosongkan sisa air atau minuman manis hingga bersih.",
      "Buka tutup botol dan pisahkan cincin segel leher botol.",
      "Injak atau remas botol hingga pipih untuk menghemat ruang tempat penyimpanan.",
      "Kumpulkan tutup botol secara terpisah karena jenis plastiknya berbeda (HDPE)."
    ],
    destination: "Bank Sampah Unit terdekat atau lapak pengepul daur ulang plastik.",
    prohibitions: [
      "Jangan membuang botol dalam keadaan berisi cairan penuh.",
      "Jangan membakar botol plastik karena melepaskan gas dioksin yang memicu kanker."
    ],
    keywords: ["aqua", "botol", "plastik", "pet", "air mineral", "minuman"]
  },
  {
    id: "baterai-bekas",
    name: "Baterai Bekas (Alkaline / Remote)",
    category: "b3",
    categoryName: "B3",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    recyclableValue: "Wajib Penanganan Khusus (Mengandung Logam Berat)",
    shortDesc: "Baterai remote, jam, mainan anak. Berpotensi bocor dan mencemari tanah.",
    steps: [
      "Tutup kutub positif (+) dan negatif (-) dengan selotip bening isolasi.",
      "Simpan dalam toples atau wadah plastik kedap yang kering.",
      "Jauhkan dari jangkauan anak-anak dan bahan mudah terbakar."
    ],
    destination: "Fasilitas Pengolahan Limbah Khusus DLH, TPA Tamangapa, atau Bank Sampah induk penampung e-waste.",
    prohibitions: [
      "Dilarang keras membakar atau merusak/membongkar baterai.",
      "Dilarang membuang baterai ke tempat sampah residu umum atau saluran air."
    ],
    keywords: ["baterai", "alkaline", "aki", "lithium", "jam", "remote"]
  },
  {
    id: "sisa-sayur-buah",
    name: "Sisa Makanan Sayur & Buah",
    category: "organik",
    categoryName: "Organik",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    recyclableValue: "Tinggi (Bahan Baku Kompos / Eco-Enzyme)",
    shortDesc: "Kulit buah, sayuran layu, dan ampas dapur. Mengurangi emisi gas metana TPA.",
    steps: [
      "Tiriskan sisa sayur/buah agar tidak terlalu becek berair.",
      "Cacah atau potong menjadi ukuran lebih kecil (2-3 cm) untuk mempercepat penguraian.",
      "Masukkan ke dalam wadah komposter Takakura atau lubang resapan biopori pekarangan."
    ],
    destination: "Komposter mandiri di rumah atau diserahkan ke TPS 3R pengolah kompos.",
    prohibitions: [
      "Jangan campur dengan plastik klip, karet gelang, atau staples bungkus sayur.",
      "Hindari mencampur minyak/lemak berlebih ke komposter aerobik."
    ],
    keywords: ["sayur", "buah", "kulit", "pisang", "makanan", "dapur", "organik"]
  },
  {
    id: "bohlam-lampu",
    name: "Bohlam Lampu & Neon Bekas",
    category: "b3",
    categoryName: "B3",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    recyclableValue: "Wajib Penanganan Khusus (Mengandung Uap Merkuri)",
    shortDesc: "Lampu TL panjang, LED mati, atau bohlam pijar. Rawan pecah dan beracun.",
    steps: [
      "Masukkan lampu ke dalam kotak kemasan aslinya atau bungkus tebal dengan koran.",
      "Tuliskan tanda peringatan 'Lampu Bekas - Rawan Pecah'.",
      "Kumpulkan terpisah hingga jadwal penyaluran B3."
    ],
    destination: "Fasilitas Pengolahan DLH Kota Makassar, TPA Tamangapa, atau gerai pengumpulan e-waste.",
    prohibitions: [
      "Jangan memecahkan bohlam secara sengaja karena serbuk merkuri sangat berbahaya bila terhirup."
    ],
    keywords: ["lampu", "bohlam", "neon", "led", "philips"]
  },
  {
    id: "minyak-jelantah",
    name: "Minyak Jelantah (Minyak Goreng Bekas)",
    category: "b3",
    categoryName: "B3",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    recyclableValue: "Tinggi (Rp 4.000 - Rp 7.000 / liter untuk Biodiesel)",
    shortDesc: "Minyak sisa penggorengan dapur. Berbahaya bila menyumbat saluran air.",
    steps: [
      "Tunggu hingga minyak benar-benar dingin setelah memasak.",
      "Saring remah-remah kotoran makanan menggunakan saringan halus.",
      "Tuang ke dalam jeriken atau botol plastik bekas bertutup rapat."
    ],
    destination: "Bank Sampah Unit atau mitra pengumpul bahan baku biodiesel terdaftar.",
    prohibitions: [
      "Dilarang keras membuang minyak jelantah ke wastafel cuci piring atau selokan!",
      "Jangan menyiramkan ke tanah pekarangan karena merusak kesuburan tanah."
    ],
    keywords: ["minyak", "jelantah", "goreng", "sawit", "kelapa"]
  },
  {
    id: "popok-pembalut",
    name: "Popok Bayi & Pembalut Sekali Pakai",
    category: "residu",
    categoryName: "Residu",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    recyclableValue: "Non-Ekonomis (Residu Menuju TPA)",
    shortDesc: "Limbah sanitasi sekali pakai dengan gel penyerap yang tidak dapat terurai alami.",
    steps: [
      "Buang kotoran padat ke dalam kloset dan siram bersih.",
      "Gulung popok/pembalut dengan rapi dan rekatkan perekat sampingnya.",
      "Bungkus menggunakan plastik atau kertas bekas agar tertutup rapat dan higienis.",
      "Masukkan ke kantong sampah residu berwarna gelap."
    ],
    destination: "Truk pengangkut sampah residu Dinas Lingkungan Hidup menuju TPA.",
    prohibitions: [
      "Dilarang membuang ke sungai atau saluran drainase (dapat menyumbat gorong-gorong).",
      "Jangan dibakar di pemukiman karena menimbulkan bau menyengat dan asap beracun."
    ],
    keywords: ["popok", "pampers", "pembalut", "bayi", "diaper", "sanitasi"]
  },
  {
    id: "kotak-kardus",
    name: "Kotak Kardus / Karton Cokelat",
    category: "anorganik",
    categoryName: "Anorganik",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    recyclableValue: "Tinggi (Rp 1.200 - Rp 2.200 / kg)",
    shortDesc: "Kardus paket pengiriman, kemasan makanan kering, karton tebal.",
    steps: [
      "Lepaskan lakban cokelat, isolasi plastik, dan staples besi yang menempel.",
      "Lipat kardus hingga pipih dan rapikan bentuknya.",
      "Tumpuk kardus sejenis dan ikat kencang dengan tali rafia."
    ],
    destination: "Bank Sampah Unit atau pengepul kertas/karton daur ulang.",
    prohibitions: [
      "Hindari kardus basah terkena hujan karena menurunkan harga jual timbangan.",
      "Jangan campurkan kardus yang berlumur minyak goreng atau lemak kotor."
    ],
    keywords: ["kardus", "karton", "box", "paket", "kertas"]
  },
  {
    id: "kaleng-minuman",
    name: "Kaleng Logam & Minuman Ringan",
    category: "anorganik",
    categoryName: "Anorganik",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    recyclableValue: "Sangat Tinggi (Aluminium: Rp 12.000 - Rp 16.000 / kg)",
    shortDesc: "Kaleng soda aluminium, kaleng susu kental manis, kaleng biskuit.",
    steps: [
      "Bilas bagian dalam kaleng dari sisa cairan manis atau susu.",
      "Pipihkan kaleng dengan cara diinjak secara hati-hati agar hemat tempat.",
      "Kumpulkan dalam karung khusus wadah logam."
    ],
    destination: "Bank Sampah Unit terdekat.",
    prohibitions: [
      "Jangan membiarkan kaleng terbuka dalam kondisi manis karena mengundang lalat dan semut."
    ],
    keywords: ["kaleng", "logam", "soda", "aluminium", "susu", "biskuit"]
  },
  {
    id: "kemasan-sachet",
    name: "Kemasan Sachet Kopi & Bumbu (Multilayer)",
    category: "residu",
    categoryName: "Residu",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    recyclableValue: "Rendah (Bahan Baku Ecobrick / RDF)",
    shortDesc: "Plastik kemasan berlapis aluminium foil (multilayer) yang sulit dipisahkan mesin daur ulang.",
    steps: [
      "Gunting sachet dan bilas dari sisa bumbu/kopi.",
      "Keringkan di bawah sinar matahari.",
      "Dapat dipotong kecil-kecil dan dipadatkan ke botol PET untuk membuat Ecobrick."
    ],
    destination: "Komunitas pembuat ecobrick atau truk residu TPA.",
    prohibitions: [
      "Dilarang dibakar di pekarangan rumah."
    ],
    keywords: ["sachet", "kopi", "bumbu", "snack", "foil", "kemasan"]
  },
  {
    id: "puntung-rokok",
    name: "Puntung Rokok & Abu",
    category: "residu",
    categoryName: "Residu",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    recyclableValue: "Non-Ekonomis (Mengandung Toksin & Plastik Selulosa Asetat)",
    shortDesc: "Filter rokok membutuhkan waktu 10-15 tahun untuk terurai dan mengandung zat karsinogenik.",
    steps: [
      "Pastikan bara api rokok telah mati sempurna.",
      "Kumpulkan di asbak kering, lalu masukkan ke kantong sampah residu tertutup."
    ],
    destination: "Tempat sampah residu TPA.",
    prohibitions: [
      "Jangan membuang puntung ke saluran air atau pot tanaman (meracuni mikroorganisme tanah).",
      "Jangan buang puntung sembarangan yang masih menyala (bahaya kebakaran)."
    ],
    keywords: ["rokok", "puntung", "abu", "filter", "tembakau"]
  },
  {
    id: "pakaian-bekas",
    name: "Pakaian & Kain Bekas (Tekstil)",
    category: "anorganik",
    categoryName: "Anorganik",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    recyclableValue: "Sedang (Donasi Layak Pakai / Lap Pembersih)",
    shortDesc: "Baju robek, kain perca, sprei lama yang tidak terpakai.",
    steps: [
      "Pilah antara yang masih layak pakai dan yang sudah rusak parah.",
      "Baju layak pakai dapat dicuci bersih untuk didonasikan ke pos donasi sandang.",
      "Kain robek dapat dipotong menjadi lap pembersih dapur (kain majun)."
    ],
    destination: "Bank Sampah Unit yang menerima tekstil atau pos donasi pakaian.",
    prohibitions: [
      "Jangan membuang kain ke aliran selokan.",
      "Hindari membakar kain sintetis berbahan poliester."
    ],
    keywords: ["baju", "pakaian", "kain", "tekstil", "celana", "donasi"]
  },
  {
    id: "botol-kaca",
    name: "Botol Kaca & Beling Utuh",
    category: "anorganik",
    categoryName: "Anorganik",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    recyclableValue: "Sedang (Rp 500 - Rp 1.500 / botol)",
    shortDesc: "Botol sirup kaca, botol kecap, toples selai kaca.",
    steps: [
      "Bilas bagian dalam botol dari sisa saus atau sirup manis.",
      "Buka tutup seng atau plastik penutupnya.",
      "Simpan dalam peti atau kotak kardus agar tidak pecah terbentur."
    ],
    destination: "Bank Sampah atau lapak pengumpul botol bekas sistem tukar isi ulang.",
    prohibitions: [
      "Jangan mencampurkan botol kaca utuh dengan pecahan beling tajam tanpa pengaman."
    ],
    keywords: ["kaca", "beling", "sirup", "kecap", "toples", "marjan"]
  },
  {
    id: "styrofoam-makanan",
    name: "Wadah Makanan Styrofoam (Polystyrene)",
    category: "residu",
    categoryName: "Residu",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    recyclableValue: "Non-Ekonomis (Sangat Ringan, Volume Besar)",
    shortDesc: "Kotak styrofoam bekas wadah bubur atau makanan cepat saji.",
    steps: [
      "Bersihkan sisa makanan dan minyak semaksimal mungkin.",
      "Patahkan menjadi bagian lebih kecil agar tidak memenuhi tong sampah residu."
    ],
    destination: "Tempat sampah residu TPA.",
    prohibitions: [
      "Dilarang membakar styrofoam karena melepaskan senyawa stiren beracun ke udara."
    ],
    keywords: ["styrofoam", "gabus", "makanan", "bubur", "ps"]
  },
  {
    id: "obat-kedaluwarsa",
    name: "Obat-obatan Kedaluwarsa & Bekas",
    category: "b3",
    categoryName: "B3",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    recyclableValue: "Wajib Penanganan Khusus",
    shortDesc: "Sirup obat, tablet, kapsul, dan salep kedaluwarsa.",
    steps: [
      "Keluarkan tablet/kapsul dari blister dan hancurkan, campur dengan tanah/ampas kopi dalam plastik tertutup.",
      "Obat sirup diencerkan dengan air dan dibuang ke saluran limbah bertahap.",
      "Hilangkan label nama pasien pada botol obat sebelum wadahnya dibuang."
    ],
    destination: "Pos Khusus Puskesmas / Farmasi DLH atau TPA.",
    prohibitions: [
      "Jangan membuang obat tablet utuh langsung ke tong sampah (rawan disalahgunakan pemulung/anak-anak)."
    ],
    keywords: ["obat", "farmasi", "sirup", "tablet", "kapsul", "kedaluwarsa"]
  },
  {
    id: "daun-ranting",
    name: "Daun Kering & Ranting Pangkasan",
    category: "organik",
    categoryName: "Organik",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    recyclableValue: "Tinggi (Bahan Kompos Cokelat / Mulsa Tanah)",
    shortDesc: "Sampah sapuan pekarangan kaya kandungan karbon (unsur C).",
    steps: [
      "Pisahkan dari sampah plastik atau kawat yang tercecer di halaman.",
      "Patahkan ranting kecil dan tumpuk daun kering sebagai lapisan penutup komposter atau biopori."
    ],
    destination: "Lubang biopori pekarangan atau TPS 3R bagian pencacah daun.",
    prohibitions: [
      "Jangan dibakar di halaman rumah karena asapnya mengganggu pernapasan warga sekitar."
    ],
    keywords: ["daun", "ranting", "kebun", "rumput", "pekarangan"]
  },
  {
    id: "kaleng-aerosol",
    name: "Kaleng Aerosol (Semprotan Nyamuk / Deodoran)",
    category: "b3",
    categoryName: "B3",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    recyclableValue: "Wajib Penanganan Khusus (Rawan Meledak)",
    shortDesc: "Semprotan obat nyamuk, cat semprot, deodoran aerosol bertekanan gas.",
    steps: [
      "Pastikan isi gas di dalam kaleng telah benar-benar habis di ruang terbuka.",
      "Jangan pernah melubangi kaleng aerosol secara paksa.",
      "Kumpulkan terpisah di wadah B3."
    ],
    destination: "Fasilitas Pengolahan Limbah Khusus DLH atau TPA Tamangapa.",
    prohibitions: [
      "Dilarang keras melempar kaleng aerosol ke api/pembakaran karena akan meledak seketika."
    ],
    keywords: ["aerosol", "semprotan", "baygon", "hit", "pilox", "deodoran"]
  },
  {
    id: "elektronik-kecil",
    name: "Casing HP, Kabel & Charger Bekas",
    category: "b3",
    categoryName: "B3",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    recyclableValue: "Sedang (Mengandung Tembaga & Plastik Khusus)",
    shortDesc: "Kabel charger putus, powerbank rusak, earphone mati.",
    steps: [
      "Gulung kabel dengan rapi dan ikat.",
      "Simpan bersama barang elektronik kecil lainnya di kotak e-waste rumah."
    ],
    destination: "Sentra E-Waste DLH Kota Makassar, TPA Tamangapa, atau Bank Sampah induk.",
    prohibitions: [
      "Jangan membuang charger ke tempat sampah basah."
    ],
    keywords: ["kabel", "charger", "hp", "earphone", "elektronik", "powerbank"]
  },
  {
    id: "kantong-kresek",
    name: "Kantong Kresek Plastik Lembut (LDPE)",
    category: "anorganik",
    categoryName: "Anorganik",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    recyclableValue: "Rendah (Rp 500 - Rp 1.000 / kg)",
    shortDesc: "Kresek belanja warung atau kantong plastik bening.",
    steps: [
      "Pastikan kantong kering dan bersih dari tumpahan kuah makanan.",
      "Lipat segitiga atau tumpuk rapi agar bisa digunakan kembali sebagai kantong belanja.",
      "Jika sudah sobek, kumpulkan dalam jumlah banyak untuk ditimbang."
    ],
    destination: "Bank Sampah Unit atau wadah daur ulang plastik lembut.",
    prohibitions: [
      "Hindari membuang kresek sembarangan karena mudah terbang dan mencemari saluran air."
    ],
    keywords: ["kresek", "kantong", "plastik", "belanja", "ldpe"]
  },
  {
    id: "kertas-hvs",
    name: "Kertas HVS & Dokumen Bekas",
    category: "anorganik",
    categoryName: "Anorganik",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    recyclableValue: "Tinggi (Rp 2.000 - Rp 3.500 / kg)",
    shortDesc: "Kertas cetak kantor, lembar fotokopi, buku tulis bekas.",
    steps: [
      "Lepaskan klip kertas dan staples kawat logam.",
      "Jika memuat data rahasia/pribadi, robek atau potong terlebih dahulu.",
      "Susun rapi dan ikat dengan tali rapia."
    ],
    destination: "Bank Sampah Unit atau pabrik daur ulang kertas.",
    prohibitions: [
      "Hindari kertas terkena basah atau tumpahan minyak."
    ],
    keywords: ["kertas", "hvs", "dokumen", "buku", "skripsi", "print"]
  },
  {
    id: "sikat-gigi",
    name: "Sikat Gigi Plastik Bekas",
    category: "residu",
    categoryName: "Residu",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    recyclableValue: "Non-Ekonomis (Komposit Bulu Sikat & Karet Gagang)",
    shortDesc: "Gagang plastik dengan bulu nilon yang sulit dipisahkan secara ekonomis.",
    steps: [
      "Bilas bersih dan gunakan sebagai sikat pembersih sudut keramik lantai kamar mandi.",
      "Jika sudah aus total, masukkan ke kantong sampah residu."
    ],
    destination: "Tempat sampah residu TPA.",
    prohibitions: [
      "Jangan buang ke kloset."
    ],
    keywords: ["sikat", "gigi", "nilon", "kamar mandi"]
  },
  {
    id: "masker-medis",
    name: "Masker Medis Sekali Pakai",
    category: "residu",
    categoryName: "Residu",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    recyclableValue: "Non-Ekonomis",
    shortDesc: "Masker spunbond sekali pakai.",
    steps: [
      "Gunting kedua tali telinga masker agar tidak menjerat satwa liar jika tercecer.",
      "Lipat bagian luar ke dalam dan bungkus dengan plastik kecil.",
      "Semprotkan sedikit disinfektan jika bekas orang sakit."
    ],
    destination: "Tong sampah residu.",
    prohibitions: [
      "Jangan membuang masker dalam keadaan tali utuh."
    ],
    keywords: ["masker", "medis", "kesehatan", "flu", "batuk"]
  },
  {
    id: "tulang-sisa-daging",
    name: "Tulang & Duri Sisa Daging/Ikan",
    category: "organik",
    categoryName: "Organik",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    recyclableValue: "Bahan Pengisi Biopori / Tepung Tulang",
    shortDesc: "Sisa olahan hewani yang membutuhkan waktu lebih lama terurai.",
    steps: [
      "Pisahkan dari kuah berminyak kental.",
      "Masukkan ke lubang biopori dalam tanah (hindari komposter Takakura karena dapat memicu belatung dan bau amis)."
    ],
    destination: "Lubang resapan biopori atau TPS 3R.",
    prohibitions: [
      "Jangan dibiarkan terbuka di tempat sampah tanpa penutup (mengundang kucing dan tikus)."
    ],
    keywords: ["tulang", "duri", "ikan", "ayam", "daging", "hewan"]
  }
]

export const daftarSampah = wasteData.map(w => ({
  id: w.id,
  nama: w.name,
  kategori: w.category,
  kategoriLabel: w.categoryName,
  alias: w.keywords || [],
  penanganan: w.steps,
  tujuanPenyaluran: w.destination,
  tipsPraktis: w.shortDesc
}))

export const kategoriConfig = {
  organik: { label: 'Organik', color: 'emerald' },
  anorganik: { label: 'Anorganik', color: 'blue' },
  b3: { label: 'B3', color: 'amber' },
  residu: { label: 'Residu', color: 'slate' }
}
