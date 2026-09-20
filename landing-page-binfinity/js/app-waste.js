/**
 * PilahKi' — Waste Catalog Page Script (js/app-waste.js)
 * Manages 22 items catalog, real-time search, category filters, and detail modal
 */

document.addEventListener("DOMContentLoaded", () => {
  const wasteGrid = document.getElementById("waste-grid");
  const searchInput = document.getElementById("waste-search-input");
  const filterBtns = document.querySelectorAll(".waste-filter-btn");
  const wasteCountBadge = document.getElementById("waste-count-badge");
  const wasteEmptyState = document.getElementById("waste-empty-state");

  // Detail Modal Elements
  const modal = document.getElementById("waste-detail-modal");
  const modalCloseBtn = document.getElementById("btn-close-waste-modal");
  const modalDismissBtn = document.getElementById("btn-dismiss-waste-modal");
  const modalAskAiBtn = document.getElementById("btn-modal-ask-ai");
  const modalTitle = document.getElementById("modal-waste-title");
  const modalCategoryBadge = document.getElementById("modal-waste-category-badge");
  const modalValueText = document.getElementById("modal-waste-value");
  const modalStepsContainer = document.getElementById("modal-waste-steps");
  const modalDestination = document.getElementById("modal-waste-destination");
  const modalProhibitions = document.getElementById("modal-waste-prohibitions");

  // 22 Common Household Waste Items Data
  const wasteData = [
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
      destination: "Drop Box Limbah B3 Dinas Lingkungan Hidup atau Bank Sampah induk penampung e-waste.",
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
      destination: "Drop Box E-Waste DLH Kota Makassar atau gerai pengumpulan limbah elektronik.",
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
      destination: "Komunitas pembuat ecobrick atau truk residu TPA Jatibarang.",
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
        "Baju layak pakai dapat dicuci bersih untuk didonasikan ke dropbox sandang.",
        "Kain robek dapat dipotong menjadi lap pembersih dapur (kain majun)."
      ],
      destination: "Bank Sampah Unit yang menerima tekstil atau dropbox donasi pakaian.",
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
      destination: "Drop Box Obat Kedaluwarsa di Puskesmas / Farmasi DLH.",
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
      destination: "Drop Box Limbah B3 DLH.",
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
      destination: "Dropbox E-Waste Balai Kota Makassar atau Bank Sampah induk.",
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
  ];

  let currentCategory = "semua";
  let searchQuery = "";
  let selectedWasteItem = null;

  const CATEGORY_THEMES = {
    organik: {
      icon: "leaf",
      iconBox: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
      hoverBorder: "hover:border-emerald-300",
      accentHover: "group-hover:text-emerald-800",
    },
    anorganik: {
      icon: "recycle",
      iconBox: "bg-blue-50 text-blue-700 border border-blue-100",
      badge: "bg-blue-50 text-blue-800 border-blue-200",
      hoverBorder: "hover:border-blue-300",
      accentHover: "group-hover:text-blue-800",
    },
    b3: {
      icon: "alert-triangle",
      iconBox: "bg-amber-50 text-amber-700 border border-amber-100",
      badge: "bg-amber-50 text-amber-800 border-amber-200",
      hoverBorder: "hover:border-amber-300",
      accentHover: "group-hover:text-amber-800",
    },
    residu: {
      icon: "trash-2",
      iconBox: "bg-slate-100 text-slate-700 border border-slate-200/80",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      hoverBorder: "hover:border-slate-300",
      accentHover: "group-hover:text-slate-900",
    },
  };

  function getShortEconomicValue(val) {
    if (!val) return "Informasi Pemilahan";
    if (val.includes("Sangat Tinggi")) return "Nilai Sangat Tinggi";
    if (val.includes("Tinggi")) return "Nilai Daur Ulang Tinggi";
    if (val.includes("Sedang")) return "Nilai Sedang";
    if (val.includes("Rendah")) return "Nilai Rendah";
    if (val.includes("Khusus")) return "Penanganan Khusus";
    if (val.includes("Non-Ekonomis")) return "Residu Non-Ekonomis";
    return val.split("(")[0].trim();
  }

  function renderWasteList() {
    if (!wasteGrid) return;
    wasteGrid.innerHTML = "";

    const filtered = wasteData.filter((item) => {
      const matchCategory = currentCategory === "semua" || item.category === currentCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });

    if (wasteCountBadge) {
      wasteCountBadge.innerText = `${filtered.length} Jenis Sampah`;
    }

    if (filtered.length === 0) {
      if (wasteEmptyState) wasteEmptyState.classList.remove("hidden");
      return;
    } else {
      if (wasteEmptyState) wasteEmptyState.classList.add("hidden");
    }

    filtered.forEach((item) => {
      const theme = CATEGORY_THEMES[item.category] || CATEGORY_THEMES.residu;
      const shortValue = getShortEconomicValue(item.recyclableValue);

      const card = document.createElement("div");
      card.className = `bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-2xs hover:shadow-lg ${theme.hoverBorder} hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between cursor-pointer group`;

      card.innerHTML = `
        <div>
          <!-- Top Row: Category Icon & Sleek Badge with ample spacing -->
          <div class="flex items-center justify-between gap-3">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105 duration-200 ${theme.iconBox}">
              <i data-lucide="${theme.icon}" class="w-6 h-6"></i>
            </div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${theme.badge}">
              ${item.categoryName}
            </span>
          </div>

          <!-- Middle Content: Prominent Title & Breathable Short Desc -->
          <div class="mt-5 space-y-2">
            <h3 class="text-base sm:text-lg font-bold text-slate-900 ${theme.accentHover} transition-colors leading-snug tracking-tight">
              ${item.name}
            </h3>
            <p class="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2">
              ${item.shortDesc}
            </p>
          </div>
        </div>

        <!-- Bottom Row: Simple Value Indicator & Arrow Button with Airy Margins -->
        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-500">
            <i data-lucide="tag" class="w-3.5 h-3.5 text-slate-400"></i>
            <span>${shortValue}</span>
          </div>
          <div class="w-8 h-8 rounded-xl bg-slate-100/70 group-hover:bg-brand-800 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
            <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-0.5 transition-transform"></i>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        openWasteDetail(item);
      });

      wasteGrid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function openWasteDetail(item) {
    selectedWasteItem = item;
    if (modalTitle) modalTitle.innerText = item.name;
    if (modalCategoryBadge) {
      modalCategoryBadge.className = `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${item.badgeColor}`;
      modalCategoryBadge.innerText = item.categoryName;
    }
    if (modalValueText) modalValueText.innerText = item.recyclableValue;
    if (modalDestination) modalDestination.innerText = item.destination;

    if (modalStepsContainer) {
      modalStepsContainer.innerHTML = item.steps
        .map(
          (step, idx) => `
          <li class="flex items-start gap-3">
            <span class="w-5 h-5 rounded-full bg-brand-50 text-brand-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-brand-200/80">${idx + 1}</span>
            <span class="text-xs sm:text-sm text-slate-700 leading-relaxed">${step}</span>
          </li>
        `
        )
        .join("");
    }

    if (modalProhibitions) {
      modalProhibitions.innerHTML = item.prohibitions
        .map(
          (prohib) => `
          <li class="flex items-start gap-2 text-xs sm:text-sm text-red-700 leading-relaxed">
            <i data-lucide="alert-circle" class="w-4 h-4 text-red-500 shrink-0 mt-0.5"></i>
            <span>${prohib}</span>
          </li>
        `
        )
        .join("");
    }

    if (modal) modal.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();
  }

  function closeWasteDetail() {
    if (modal) modal.classList.add("hidden");
    selectedWasteItem = null;
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeWasteDetail);
  if (modalDismissBtn) modalDismissBtn.addEventListener("click", closeWasteDetail);

  if (modalAskAiBtn) {
    modalAskAiBtn.addEventListener("click", () => {
      if (selectedWasteItem) {
        const query = `Bagaimana cara penanganan ${selectedWasteItem.name}?`;
        if (typeof window.openPilahAiWithQuery === "function") {
          closeWasteDetail();
          window.openPilahAiWithQuery(query);
        } else {
          window.location.href = `index.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeWasteDetail();
    });
  }

  // Filter Buttons Handler
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("bg-brand-800", "text-white", "shadow-xs");
        b.classList.add("bg-white", "text-slate-700", "border-slate-200");
      });
      btn.classList.add("bg-brand-800", "text-white", "shadow-xs");
      btn.classList.remove("bg-white", "text-slate-700", "border-slate-200");

      currentCategory = btn.getAttribute("data-category") || "semua";
      renderWasteList();
    });
  });

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderWasteList();
    });
  }

  // Handle URL Query Params (e.g., ?filter=b3 or ?q=plastik)
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get("filter");
  const queryParam = urlParams.get("q");

  if (filterParam) {
    const targetBtn = document.querySelector(`.waste-filter-btn[data-category="${filterParam}"]`);
    if (targetBtn) targetBtn.click();
  }
  if (queryParam && searchInput) {
    searchInput.value = queryParam;
    searchQuery = queryParam;
  }

  // Initial Render
  renderWasteList();
});
