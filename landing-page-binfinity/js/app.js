/**
 * PilahKi' — Core Application Logic (js/app.js)
 * Manages Dashboard, Tabs, Progressive Profiling, PilahAI Chat, Waste Catalog, Facilities, and Schedules
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // ================= 1. USER SESSION & PROFILE =================
  const rawUser = localStorage.getItem('pilahki_user');
  let currentUser = {
    name: 'Warga PilahKi\'',
    email: 'warga@pilahki.id'
  };

  if (rawUser) {
    try {
      currentUser = JSON.parse(rawUser);
    } catch (e) {
      console.error('Failed to parse user session', e);
    }
  }

  // Update User UI
  const userDisplayName = document.getElementById('user-display-name');
  const userDisplayEmail = document.getElementById('user-display-email');
  const userAvatarInitial = document.getElementById('user-avatar-initial');
  const chatWelcomeName = document.getElementById('chat-welcome-name');

  if (userDisplayName) userDisplayName.innerText = currentUser.name;
  if (userDisplayEmail) userDisplayEmail.innerText = currentUser.email;
  if (userAvatarInitial && currentUser.name) {
    userAvatarInitial.innerText = currentUser.name.trim().charAt(0).toUpperCase();
  }
  if (chatWelcomeName && currentUser.name) {
    chatWelcomeName.innerText = currentUser.name.split(' ')[0];
  }

  // Logout Handler
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin keluar dari PilahKi\'?')) {
        localStorage.removeItem('pilahki_is_new_user');
        window.location.href = 'login.html';
      }
    });
  }

  // ================= 2. DOMICILE & PROGRESSIVE PROFILING =================
  const domicileModal = document.getElementById('domicile-modal');
  const domicileForm = document.getElementById('domicile-form');
  const btnOpenDomicile = document.getElementById('btn-open-domicile');
  const btnDismissDomicile = document.getElementById('btn-dismiss-domicile');
  const triggerDomicileBtns = document.querySelectorAll('.trigger-domicile-btn');
  const headerDomicileText = document.getElementById('header-domicile-text');
  const locationTargetLabel = document.getElementById('location-target-label');
  const scheduleDomicileLabel = document.getElementById('schedule-domicile-label');

  let activeDomicile = {
    city: 'Kota Makassar',
    district: 'Panakkukang',
    detail: 'Karebosi'
  };

  // Load saved domicile
  const savedDomicile = localStorage.getItem('pilahki_domicile');
  if (savedDomicile) {
    try {
      activeDomicile = JSON.parse(savedDomicile);
    } catch (e) {
      console.error('Failed to parse domicile', e);
    }
  }

  function updateDomicileUI() {
    const formatted = `${activeDomicile.district}, ${activeDomicile.city.replace('Kota ', '')}`;
    if (headerDomicileText) headerDomicileText.innerText = formatted;
    if (locationTargetLabel) locationTargetLabel.innerText = formatted;
    if (scheduleDomicileLabel) scheduleDomicileLabel.innerText = formatted;
  }
  updateDomicileUI();

  // Check if first-time visitor (progressive profiling)
  const isNewUser = localStorage.getItem('pilahki_is_new_user');
  if (isNewUser === 'true' && !savedDomicile && domicileModal) {
    setTimeout(() => {
      domicileModal.classList.remove('hidden');
    }, 400);
  }

  function openDomicileModal() {
    const citySelect = document.getElementById('domicile-city');
    const districtSelect = document.getElementById('domicile-district');
    const detailInput = document.getElementById('domicile-detail');

    if (citySelect) citySelect.value = activeDomicile.city;
    if (districtSelect) districtSelect.value = activeDomicile.district;
    if (detailInput) detailInput.value = activeDomicile.detail || '';

    if (domicileModal) domicileModal.classList.remove('hidden');
  }

  function closeDomicileModal() {
    if (domicileModal) domicileModal.classList.add('hidden');
  }

  if (btnOpenDomicile) btnOpenDomicile.addEventListener('click', openDomicileModal);
  if (btnDismissDomicile) {
    btnDismissDomicile.addEventListener('click', () => {
      closeDomicileModal();
      localStorage.removeItem('pilahki_is_new_user');
    });
  }

  triggerDomicileBtns.forEach((btn) => {
    btn.addEventListener('click', openDomicileModal);
  });

  if (domicileForm) {
    domicileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = document.getElementById('domicile-city').value;
      const district = document.getElementById('domicile-district').value;
      const detail = document.getElementById('domicile-detail').value.trim();

      activeDomicile = { city, district, detail };
      localStorage.setItem('pilahki_domicile', JSON.stringify(activeDomicile));
      localStorage.removeItem('pilahki_is_new_user');

      updateDomicileUI();
      renderFacilities();
      closeDomicileModal();

      // Show temporary notification
      alert(`Wilayah domisili berhasil diatur ke: ${activeDomicile.district}, ${activeDomicile.city}! Data fasilitas dan jadwal telah diperbarui.`);
    });
  }

  // ================= 3. TAB NAVIGATION SYSTEM =================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabViews = document.querySelectorAll('.tab-view');

  function switchTab(targetTabId) {
    tabButtons.forEach((btn) => {
      const isTarget = btn.getAttribute('data-tab') === targetTabId;
      if (isTarget) {
        btn.classList.add('bg-brand-800', 'text-white', 'shadow-xs');
        btn.classList.remove('text-slate-600', 'hover:text-brand-800', 'hover:bg-slate-100/70');
      } else {
        btn.classList.remove('bg-brand-800', 'text-white', 'shadow-xs');
        btn.classList.add('text-slate-600', 'hover:text-brand-800', 'hover:bg-slate-100/70');
      }
    });

    tabViews.forEach((view) => {
      if (view.id === `tab-view-${targetTabId}`) {
        view.classList.remove('hidden');
      } else {
        view.classList.add('hidden');
      }
    });

    // Refresh lucide icons in active tab
    if (window.lucide) window.lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // ================= 4. PILAH SAMPAH (DATABASE & SEARCH) =================
  const wasteDatabase = [
    // Organik
    {
      id: 'sisa-nasi-sayur',
      name: 'Sisa Nasi & Sayuran',
      category: 'organik',
      categoryLabel: 'Organik',
      icon: 'leaf',
      handling: 'Tiriskan dari kuah berlebih. Masukkan ke komposter atau biopori di rumah untuk dijadikan pupuk organik cair/padat.',
      recommendation: 'Kompos mandiri rumah tangga atau masukkan ke tong sampah organik penjemputan armada Senin & Kamis.'
    },
    {
      id: 'kulit-buah',
      name: 'Kulit Buah & Dedaunan',
      category: 'organik',
      categoryLabel: 'Organik',
      icon: 'apple',
      handling: 'Potong kecil-kecil untuk mempercepat dekomposisi. Sangat cocok dijadikan bahan pembuatan Eco-Enzyme serbaguna.',
      recommendation: 'Diolah menjadi Eco-Enzyme atau dimasukkan ke lubang biopori pekarangan rumah.'
    },
    {
      id: 'tulang-ikan-ayam',
      name: 'Tulang Ikan & Ayam',
      category: 'organik',
      categoryLabel: 'Organik',
      icon: 'fish',
      handling: 'Cuci dari sisa bumbu berlebih, keringkan sejenak, atau gunakan komposter khusus BSF (larva Black Soldier Fly).',
      recommendation: 'Diberikan ke peternak pakan maggot terdekat atau disetor ke armada pengangkut organik.'
    },
    {
      id: 'ampas-kopi-teh',
      name: 'Ampas Kopi & Daun Teh',
      category: 'organik',
      categoryLabel: 'Organik',
      icon: 'coffee',
      handling: 'Dapat langsung ditaburkan tipis di atas tanah pot tanaman sebagai sumber nitrogen alami penstabil kelembaban.',
      recommendation: 'Pupuk langsung tanaman hias atau campurkan ke tumpukan kompos.'
    },
    {
      id: 'cangkang-telur',
      name: 'Cangkang Telur',
      category: 'organik',
      categoryLabel: 'Organik',
      icon: 'egg',
      handling: 'Bilas bersih, jemur hingga kering, lalu tumbuk halus menjadi bubuk kalsium untuk nutrisi tanah kebun.',
      recommendation: 'Campuran pupuk organik kaya kalsium tinggi pencegah hama siput.'
    },

    // Anorganik (Daur Ulang)
    {
      id: 'botol-plastik-pet',
      name: 'Botol Plastik Air Mineral (PET)',
      category: 'anorganik',
      categoryLabel: 'Anorganik (Daur Ulang)',
      icon: 'cylinder',
      handling: 'Buka tutupnya, kosongkan cairan, remas/injak hingga pipih untuk menghemat ruang penyimpanan.',
      recommendation: 'Setor ke Bank Sampah terdekat dengan nilai tukar poin tabungan sampah.'
    },
    {
      id: 'kardus-karton',
      name: 'Kardus & Boks Karton',
      category: 'anorganik',
      categoryLabel: 'Anorganik (Daur Ulang)',
      icon: 'package',
      handling: 'Lepaskan selotip/lakban plastik, bongkar lipatan menjadi lembaran rata, ikat kencang dengan tali rafia.',
      recommendation: 'Setor ke Bank Sampah atau jual ke pengepul daur ulang kertas.'
    },
    {
      id: 'kaleng-minuman',
      name: 'Kaleng Minuman Aluminium',
      category: 'anorganik',
      categoryLabel: 'Anorganik (Daur Ulang)',
      icon: 'archive',
      handling: 'Bilas sisa minuman manis agar tidak mengundang semut, lalu pipihkan jika memungkinkan.',
      recommendation: 'Diterima di seluruh Bank Sampah dengan nilai jual daur ulang tinggi.'
    },
    {
      id: 'kertas-hvs-buku',
      name: 'Kertas HVS & Buku Bekas',
      category: 'anorganik',
      categoryLabel: 'Anorganik (Daur Ulang)',
      icon: 'file-text',
      handling: 'Pisahkan dari klip kertas atau kawat staples besi. Pastikan tetap kering dan tidak terkena noda minyak.',
      recommendation: 'Bank Sampah atau daur ulang pabrik kertas.'
    },
    {
      id: 'botol-kaca-sirup',
      name: 'Botol Kaca & Selai',
      category: 'anorganik',
      categoryLabel: 'Anorganik (Daur Ulang)',
      icon: 'wine',
      handling: 'Bilas bersih sisa makanan di dalamnya. Jangan dicampur dengan pecahan kaca berbahaya.',
      recommendation: 'Dapat digunakan ulang (*reusable*) atau disetor ke Bank Sampah.'
    },
    {
      id: 'kantong-kresek-bersih',
      name: 'Kantong Kresek (HDPE/LDPE)',
      category: 'anorganik',
      categoryLabel: 'Anorganik (Daur Ulang)',
      icon: 'shopping-bag',
      handling: 'Kumpulkan kantong kresek yang bersih dan kering, lipat rapi atau padatkan dalam wadah tertutup.',
      recommendation: 'Bank Sampah yang menerima daur ulang plastik kresek atau pembuatan *ecobrick*.'
    },

    // Limbah B3
    {
      id: 'baterai-bekas',
      name: 'Baterai Bekas (AA/AAA/HP)',
      category: 'b3',
      categoryLabel: 'Limbah B3',
      icon: 'battery-warning',
      handling: 'Tutup kutub positif & negatif dengan selotip kering. Simpan dalam wadah toples plastik terpisah dari anak-anak.',
      recommendation: 'Serahkan ke Drop-Box Limbah B3 DLH atau TPS terpadu, dilarang dibakar atau dibuang ke tanah!'
    },
    {
      id: 'lampu-neon-bohlam',
      name: 'Lampu Neon (TL) & Bohlam',
      category: 'b3',
      categoryLabel: 'Limbah B3',
      icon: 'lightbulb',
      handling: 'Bungkus rapat dengan kardus aslinya atau kertas tebal agar gas merkuri tidak bocor saat tertimpa beban.',
      recommendation: 'Drop-Box Limbah B3 di kantor kecamatan atau dinas lingkungan hidup kota.'
    },
    {
      id: 'minyak-jelantah',
      name: 'Minyak Jelantah (Minyak Goreng Bekas)',
      category: 'b3',
      categoryLabel: 'Limbah Khusus / B3',
      icon: 'flame',
      handling: 'Dinginkan, saring remah makanan, tuangkan ke dalam jeriken atau botol plastik tebal tertutup rapat.',
      recommendation: 'Setor ke Bank Sampah atau mitra pengumpul biodiesel. Jangan tuang ke wastafel!'
    },
    {
      id: 'botol-semprot-aerosol',
      name: 'Kaleng Semprot / Pestisida',
      category: 'b3',
      categoryLabel: 'Limbah B3',
      icon: 'shield-alert',
      handling: 'Pastikan isi kaleng telah habis tak bersisa. Jangan ditusuk atau dibakar karena memicu ledakan.',
      recommendation: 'Titik pengumpulan limbah B3 resmi kota.'
    },
    {
      id: 'obat-kadaluarsa',
      name: 'Obat & Sirup Kadaluarsa',
      category: 'b3',
      categoryLabel: 'Limbah B3 Farmasi',
      icon: 'pill',
      handling: 'Keluarkan pil dari kemasan, campur dengan tanah atau ampas kopi agar tidak disalahgunakan, buang bungkus terpisah.',
      recommendation: 'Fasilitas Puskesmas terdekat atau drop box B3 farmasi.'
    },

    // Residu
    {
      id: 'styrofoam-makanan',
      name: 'Styrofoam Makanan',
      category: 'residu',
      categoryLabel: 'Residu',
      icon: 'trash-2',
      handling: 'Bersihkan dari sisa minyak atau makanan sebelum dibuang untuk mencegah penularan penyakit.',
      recommendation: 'Tong sampah residu resmi untuk pemrosesan akhir di TPA sanitary landfill.'
    },
    {
      id: 'popok-bayi-diapers',
      name: 'Popok Bayi (Diapers) & Pembalut',
      category: 'residu',
      categoryLabel: 'Residu Higienis',
      icon: 'shield-x',
      handling: 'Buang kotoran padat ke toilet, gulung popok dengan rapi lalu ikat dalam kantong plastik tertutup.',
      recommendation: 'Wajib masuk ke armada residu umum.'
    },
    {
      id: 'tisu-basah-kotor',
      name: 'Tisu Basah & Tisu Berminyak',
      category: 'residu',
      categoryLabel: 'Residu',
      icon: 'file-x',
      handling: 'Tisu basah mengandung serat sintetis plastik yang tidak bisa terurai alami. Jangan dimasukkan ke komposter!',
      recommendation: 'Tempat sampah residu.'
    },
    {
      id: 'puntung-rokok',
      name: 'Puntung Rokok',
      category: 'residu',
      categoryLabel: 'Residu Beracun',
      icon: 'cigarette',
      handling: 'Pastikan bara rokok sudah mati sempurna dengan membasahinya sedikit air.',
      recommendation: 'Tempat sampah residu tertutup.'
    },
    {
      id: 'sachet-kopi-foil',
      name: 'Bungkus Kopi Multilayer (Sachet)',
      category: 'residu',
      categoryLabel: 'Residu / Ecobrick',
      icon: 'layers',
      handling: 'Gunting bersih sisa bubuk kopi, keringkan, dan dapat dipotong kecil untuk isian botol *ecobrick*.',
      recommendation: 'Bahan ecobrick rumah tangga atau tempat sampah residu.'
    },
    {
      id: 'kain-lap-kotor',
      name: 'Kain Perca & Lap Bekas Oli',
      category: 'residu',
      categoryLabel: 'Residu',
      icon: 'scissors',
      handling: 'Kain lap yang terkontaminasi minyak atau bahan kimia tidak dapat didaur ulang bersama tekstil.',
      recommendation: 'Tempat sampah residu.'
    }
  ];

  const wasteGrid = document.getElementById('waste-grid');
  const wasteSearchInput = document.getElementById('waste-search-input');
  const btnClearWasteSearch = document.getElementById('btn-clear-waste-search');
  const wasteEmptyState = document.getElementById('waste-empty-state');
  const categoryFilterBtns = document.querySelectorAll('.category-filter-btn');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  function getBadgeClasses(category) {
    switch (category) {
      case 'organik':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'anorganik':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'b3':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'residu':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  }

  function renderWasteItems() {
    if (!wasteGrid) return;
    wasteGrid.innerHTML = '';

    const filtered = wasteDatabase.filter((item) => {
      const matchCategory = currentCategory === 'all' || item.category === currentCategory;
      const matchQuery = !currentSearchQuery || 
        item.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
        item.handling.toLowerCase().includes(currentSearchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });

    if (filtered.length === 0) {
      if (wasteEmptyState) wasteEmptyState.classList.remove('hidden');
      return;
    }

    if (wasteEmptyState) wasteEmptyState.classList.add('hidden');

    filtered.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-300 hover:shadow-card-hover transition-all duration-200 cursor-pointer flex flex-col justify-between group';
      card.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold border ${getBadgeClasses(item.category)}">
              ${item.categoryLabel}
            </span>
            <span class="text-xs text-brand-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              Lihat Cara <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </span>
          </div>
          <h3 class="text-base font-bold text-slate-900 group-hover:text-brand-900 transition-colors">
            ${item.name}
          </h3>
          <p class="text-xs text-slate-600 leading-relaxed line-clamp-2">
            ${item.handling}
          </p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Penyaluran:</span>
          <span class="font-medium text-slate-700 truncate max-w-[170px] text-right">${item.recommendation}</span>
        </div>
      `;

      card.addEventListener('click', () => openWasteModal(item));
      wasteGrid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // Waste Search & Filter Events
  if (wasteSearchInput) {
    wasteSearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim();
      if (btnClearWasteSearch) {
        if (currentSearchQuery.length > 0) {
          btnClearWasteSearch.classList.remove('hidden');
        } else {
          btnClearWasteSearch.classList.add('hidden');
        }
      }
      renderWasteItems();
    });
  }

  if (btnClearWasteSearch) {
    btnClearWasteSearch.addEventListener('click', () => {
      wasteSearchInput.value = '';
      currentSearchQuery = '';
      btnClearWasteSearch.classList.add('hidden');
      renderWasteItems();
      wasteSearchInput.focus();
    });
  }

  categoryFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryFilterBtns.forEach((b) => {
        b.classList.remove('active', 'bg-brand-800', 'text-white', 'shadow-xs');
        b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      });
      btn.classList.add('active', 'bg-brand-800', 'text-white', 'shadow-xs');
      btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');

      currentCategory = btn.getAttribute('data-category');
      renderWasteItems();
    });
  });

  // Waste Item Detail Modal
  const wasteModal = document.getElementById('waste-detail-modal');
  const btnCloseWasteModal = document.getElementById('btn-close-waste-modal');
  const modalWasteTitle = document.getElementById('modal-waste-title');
  const modalWasteBadge = document.getElementById('modal-waste-category-badge');
  const modalWasteHandling = document.getElementById('modal-waste-handling');
  const modalWasteRec = document.getElementById('modal-waste-recommendation');
  const btnWasteAskPilahAI = document.getElementById('btn-waste-ask-pilahai');
  let selectedWasteItem = null;

  function openWasteModal(item) {
    selectedWasteItem = item;
    if (modalWasteTitle) modalWasteTitle.innerText = item.name;
    if (modalWasteBadge) {
      modalWasteBadge.innerText = item.categoryLabel;
      modalWasteBadge.className = `inline-block px-3 py-1 rounded-full text-xs font-bold border ${getBadgeClasses(item.category)}`;
    }
    if (modalWasteHandling) modalWasteHandling.innerText = item.handling;
    if (modalWasteRec) modalWasteRec.innerText = item.recommendation;

    if (wasteModal) wasteModal.classList.remove('hidden');
  }

  function closeWasteModal() {
    if (wasteModal) wasteModal.classList.add('hidden');
  }

  if (btnCloseWasteModal) btnCloseWasteModal.addEventListener('click', closeWasteModal);

  if (btnWasteAskPilahAI) {
    btnWasteAskPilahAI.addEventListener('click', () => {
      closeWasteModal();
      if (selectedWasteItem) {
        switchTab('pilahai');
        sendUserQueryToAI(`Bagaimana cara menangani dan menyalurkan ${selectedWasteItem.name}?`);
      }
    });
  }

  // Ask PilahAI Fallback button in empty state
  const btnAskPilahaiFallback = document.getElementById('btn-ask-pilahai-fallback');
  if (btnAskPilahaiFallback) {
    btnAskPilahaiFallback.addEventListener('click', () => {
      const q = wasteSearchInput.value.trim() || 'sampah';
      switchTab('pilahai');
      sendUserQueryToAI(`Kategori apa untuk ${q} dan bagaimana cara memilahnya?`);
    });
  }

  renderWasteItems();

  // ================= 5. CARI LOKASI FASILITAS =================
  const facilitiesDatabase = [
    {
      id: 'bs-berkah-hijau',
      name: 'Bank Sampah Berkah Hijau',
      type: 'bank_sampah',
      typeLabel: 'Bank Sampah',
      district: 'Pedurungan',
      distance: '450 meter',
      address: 'Jl. Pedurungan Tengah Raya No. 12, Pedurungan',
      hours: 'Rabu & Sabtu (08.00 - 13.00 WIB)',
      status: 'Buka Besok',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      accepted: ['Kardus', 'Botol PET', 'Kaleng Aluminium', 'Minyak Jelantah'],
      phone: '0812-3456-7890'
    },
    {
      id: 'tps-muktiharjo',
      name: 'TPS 3R Muktiharjo Mandiri',
      type: 'tps',
      typeLabel: 'TPS 3R',
      district: 'Pedurungan',
      distance: '900 meter',
      address: 'Jl. Muktiharjo Kidul No. 45, Pedurungan',
      hours: 'Setiap Hari (06.00 - 17.00 WIB)',
      status: 'Buka Sekarang',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      accepted: ['Sampah Organik', 'Anorganik Kering', 'Residu Domestik'],
      phone: '024-7654321'
    },
    {
      id: 'bs-melati-bersih',
      name: 'Bank Sampah Melati Bersih',
      type: 'bank_sampah',
      typeLabel: 'Bank Sampah',
      district: 'Pedurungan',
      distance: '1.2 km',
      address: 'Jl. Ketileng Indah Blok E, Pedurungan',
      hours: 'Sabtu & Minggu (09.00 - 14.00 WIB)',
      status: 'Buka Akhir Pekan',
      statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
      accepted: ['Kertas & Buku', 'Botol Plastik', 'Besi Logam', 'Tembaga'],
      phone: '0857-9876-5432'
    },
    {
      id: 'dropbox-b3-dlh',
      name: 'Drop Box Limbah B3 Kantor Kecamatan',
      type: 'b3',
      typeLabel: 'Drop Box B3',
      district: 'Pedurungan',
      distance: '1.5 km',
      address: 'Kantor Kecamatan Pedurungan, Jl. Majapahit No. 110',
      hours: 'Senin - Jumat (08.00 - 15.30 WIB)',
      status: 'Buka Hari Kerja',
      statusColor: 'text-purple-700 bg-purple-50 border-purple-200',
      accepted: ['Baterai Bekas', 'Lampu TL/Bohlam', 'Kaleng Pestisida', 'Kemasan Obat'],
      phone: '024-6789012'
    },
    {
      id: 'tps-tlogosari',
      name: 'TPS Terpadu Tlogosari Kulon',
      type: 'tps',
      typeLabel: 'TPS Terpadu',
      district: 'Pedurungan',
      distance: '1.8 km',
      address: 'Jl. Tlogosari Raya II, Semarang',
      hours: 'Setiap Hari (06.00 - 16.30 WIB)',
      status: 'Buka Sekarang',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      accepted: ['Organik Dapur', 'Residu Rumah Tangga'],
      phone: '024-7890123'
    }
  ];

  const facilitiesGrid = document.getElementById('facilities-grid');
  const facilityFilterBtns = document.querySelectorAll('.facility-filter-btn');
  let currentFacilityFilter = 'all';

  function renderFacilities() {
    if (!facilitiesGrid) return;
    facilitiesGrid.innerHTML = '';

    const filtered = facilitiesDatabase.filter((fac) => {
      return currentFacilityFilter === 'all' || fac.type === currentFacilityFilter;
    });

    filtered.forEach((fac) => {
      const card = document.createElement('div');
      card.className = 'p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-card-hover hover:border-brand-300 transition-all flex flex-col justify-between';
      card.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-800 border border-brand-100 mb-1.5">
                ${fac.typeLabel}
              </span>
              <h3 class="text-lg font-bold text-slate-900 leading-snug">${fac.name}</h3>
            </div>
            <div class="text-right flex-shrink-0">
              <span class="inline-block px-2.5 py-1 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-800">
                📍 ${fac.distance}
              </span>
            </div>
          </div>

          <p class="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
            <i data-lucide="map-pin" class="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5"></i>
            <span>${fac.address}</span>
          </p>

          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-500 flex items-center gap-1">
                <i data-lucide="clock" class="w-3.5 h-3.5"></i> Jam Operasional:
              </span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${fac.statusColor}">
                ${fac.status}
              </span>
            </div>
            <p class="font-semibold text-slate-800">${fac.hours}</p>
          </div>

          <div class="space-y-1.5">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Menerima:</span>
            <div class="flex flex-wrap gap-1.5">
              ${fac.accepted.map((item) => `<span class="px-2 py-0.5 rounded-md bg-brand-50 text-brand-800 text-[11px] font-medium border border-brand-100/80">${item}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <span class="text-xs text-slate-500 flex items-center gap-1">
            <i data-lucide="phone" class="w-3.5 h-3.5 text-slate-400"></i> ${fac.phone}
          </span>
          <button 
            type="button" 
            onclick="alert('Membuka rute petunjuk arah navigasi ke ${fac.name} (${fac.distance}). Silakan ikuti panduan peta GPS!')" 
            class="px-4 py-2 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <i data-lucide="navigation" class="w-3.5 h-3.5"></i>
            <span>Petunjuk Arah</span>
          </button>
        </div>
      `;
      facilitiesGrid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  facilityFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      facilityFilterBtns.forEach((b) => {
        b.classList.remove('active', 'bg-brand-800', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });
      btn.classList.add('active', 'bg-brand-800', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-700');

      currentFacilityFilter = btn.getAttribute('data-facility');
      renderFacilities();
    });
  });

  renderFacilities();

  // ================= 6. PANDUAN EDUKASI =================
  const guidesDatabase = [
    {
      id: 'kompos-mandiri',
      tag: 'Tutorial Praktis',
      title: 'Panduan Mudah Membuat Kompos Mandiri dari Sampah Dapur',
      summary: 'Ubah sisa sayuran, nasi, dan kulit buah menjadi nutrisi penyubur tanah tanpa menimbulkan bau tak sedap.',
      readTime: '4 Menit Baca',
      content: `
        <h4 class="text-base font-bold text-slate-900 mt-2">1. Apa Saja yang Boleh Dimasukkan?</h4>
        <p>Bahan organik "hijau" (sisa sayur, ampas kopi, daun teh, kulit buah) yang kaya nitrogen, dicampur bahan "cokelat" (daun kering, sobekan kardus tipis) sebagai sumber karbon penyeimbang.</p>
        
        <h4 class="text-base font-bold text-slate-900 mt-4">2. Alat Sederhana yang Dibutuhkan</h4>
        <p>Ember bekas bertutup yang dilubangi kecil-kecil di bagian bawah sebagai sirkulasi udara, atau lubang biopori di halaman.</p>
        
        <h4 class="text-base font-bold text-slate-900 mt-4">3. Langkah Pembuatan</h4>
        <p>1. Buat lapisan dasar dengan daun kering atau sekam padi.<br/>
        2. Masukkan sisa potongan dapur organik.<br/>
        3. Percikkan sedikit cairan EM4 atau air cucian beras untuk mempercepat proses dekomposisi.<br/>
        4. Aduk seminggu sekali. Dalam 3-4 minggu, kompos matang berbau harum tanah!</p>
      `
    },
    {
      id: 'kategori-sampah',
      tag: 'Dasar Pemilahan',
      title: 'Mengenal 4 Kategori Utama Sampah Rumah Tangga',
      summary: 'Kunci keberhasilan pengelolaan sampah berawal dari ketepatan memilah di dapur sebelum diserahkan ke armada.',
      readTime: '3 Menit Baca',
      content: `
        <h4 class="text-base font-bold text-slate-900 mt-2">🍃 1. Sampah Organik (Mudah Terurai)</h4>
        <p>Sisa makanan, kulit buah, tulang hewan, dan dedaunan. Wajib dipisahkan dari plastik agar tidak membusuk dan memicu gas metana di TPA.</p>
        
        <h4 class="text-base font-bold text-slate-900 mt-3">📦 2. Sampah Anorganik Daur Ulang</h4>
        <p>Kardus, kertas, botol plastik PET, kaleng logam, dan botol kaca. Bersihkan dari sisa cairan dan setorkan ke Bank Sampah untuk nilai ekonomis.</p>
        
        <h4 class="text-base font-bold text-slate-900 mt-3">⚠️ 3. Limbah B3 (Bahan Berbahaya & Beracun)</h4>
        <p>Baterai bekas, lampu neon, botol pestisida, obat kadaluarsa, dan minyak jelantah. Jangan dibuang di tong sampah biasa karena meracuni air tanah!</p>
        
        <h4 class="text-base font-bold text-slate-900 mt-3">🗑️ 4. Sampah Residu</h4>
        <p>Popok bekas, tisu berminyak, puntung rokok, dan styrofoam yang tidak dapat didaur ulang. Masukkan ke armada penjemputan resmi.</p>
      `
    },
    {
      id: 'amankan-b3',
      tag: 'Keamanan Lingkungan',
      title: 'Bahaya Limbah B3 Rumah Tangga & Cara Mengamankannya',
      summary: 'Baterai dan lampu bekas tampak sepele, namun mengandung merkuri dan timbal yang sangat merusak ekosistem.',
      readTime: '5 Menit Baca',
      content: `
        <h4 class="text-base font-bold text-slate-900 mt-2">Mengapa B3 Tidak Boleh Dibuang Sembarangan?</h4>
        <p>Satu butir baterai jam tangan bekas yang bocor di tanah dapat mencemari ribuan liter air tanah yang dikonsumsi warga.</p>
        
        <h4 class="text-base font-bold text-slate-900 mt-4">Prosedur Pengamanan di Rumah:</h4>
        <p>• Rekatkan selotip bening pada ujung kutub baterai bekas untuk mencegah korsleting listrik mikro.<br/>
        • Wadahi lampu neon yang putus dengan karton aslinya agar tidak pecah.<br/>
        • Simpan minyak jelantah di jeriken plastik tertutup, lalu setorkan ke program sedekah jelantah Bank Sampah terdekat.</p>
      `
    },
    {
      id: 'zero-waste-lifestyle',
      tag: 'Gaya Hidup',
      title: '5 Langkah Praktis Memulai Gaya Hidup Zero Waste dari Dapur',
      summary: 'Menuju bebas sampah bukan berarti harus sempurna seketika, tetapi konsisten mengurangi timbulan sampah sekali pakai.',
      readTime: '3 Menit Baca',
      content: `
        <h4 class="text-base font-bold text-slate-900 mt-2">Prinsip 5R Sederhana:</h4>
        <p><strong>1. Refuse (Tolak):</strong> Katakan tidak pada sedotan plastik dan kantong kresek belanjaan.<br/>
        <strong>2. Reduce (Kurangi):</strong> Beli bahan makanan sesuai kebutuhan mingguan agar tidak ada makanan basi.<br/>
        <strong>3. Reuse (Gunakan Ulang):</strong> Manfaatkan toples selai kaca untuk wadah bumbu dapur.<br/>
        <strong>4. Rot (Komposkan):</strong> Olah seluruh sisa organik menjadi pupuk tanaman.<br/>
        <strong>5. Recycle (Daur Ulang):</strong> Pilah sampah anorganik dan setorkan ke Bank Sampah terdekat.</p>
      `
    }
  ];

  const guidesGrid = document.getElementById('guides-grid');
  const guideModal = document.getElementById('guide-detail-modal');
  const btnCloseGuideModal = document.getElementById('btn-close-guide-modal');
  const btnCloseGuideBottom = document.getElementById('btn-close-guide-bottom');
  const modalGuideTag = document.getElementById('modal-guide-tag');
  const modalGuideTitle = document.getElementById('modal-guide-title');
  const modalGuideContent = document.getElementById('modal-guide-content');

  function renderGuides() {
    if (!guidesGrid) return;
    guidesGrid.innerHTML = '';

    guidesDatabase.forEach((guide) => {
      const card = document.createElement('div');
      card.className = 'p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-card-hover hover:border-brand-300 transition-all flex flex-col justify-between group cursor-pointer';
      card.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-brand-700 uppercase tracking-wider">${guide.tag}</span>
            <span class="text-slate-400 flex items-center gap-1">
              <i data-lucide="book-open" class="w-3.5 h-3.5"></i> ${guide.readTime}
            </span>
          </div>
          <h3 class="text-xl font-bold text-slate-900 group-hover:text-brand-900 transition-colors leading-snug">
            ${guide.title}
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            ${guide.summary}
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs font-bold text-brand-800 flex items-center gap-1 group-hover:gap-2 transition-all">
            <span>Baca Selengkapnya</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </span>
        </div>
      `;

      card.addEventListener('click', () => openGuideModal(guide));
      guidesGrid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function openGuideModal(guide) {
    if (modalGuideTag) modalGuideTag.innerText = guide.tag;
    if (modalGuideTitle) modalGuideTitle.innerText = guide.title;
    if (modalGuideContent) modalGuideContent.innerHTML = guide.content;
    if (guideModal) guideModal.classList.remove('hidden');
  }

  function closeGuideModal() {
    if (guideModal) guideModal.classList.add('hidden');
  }

  if (btnCloseGuideModal) btnCloseGuideModal.addEventListener('click', closeGuideModal);
  if (btnCloseGuideBottom) btnCloseGuideBottom.addEventListener('click', closeGuideModal);

  renderGuides();

  // ================= 7. PILAHAI ASSISTANT (CHAT COMPANION) =================
  const aiChatForm = document.getElementById('ai-chat-form');
  const aiChatInput = document.getElementById('ai-chat-input');
  const aiChatMessages = document.getElementById('ai-chat-messages');
  const btnClearChat = document.getElementById('btn-clear-chat');
  const chatChips = document.querySelectorAll('.chat-chip');

  function appendChatUser(text) {
    if (!aiChatMessages) return;
    const msg = document.createElement('div');
    msg.className = 'flex items-start justify-end gap-3';
    msg.innerHTML = `
      <div class="bg-brand-800 text-white rounded-2xl rounded-tr-none p-3.5 max-w-md shadow-2xs text-sm leading-relaxed">
        ${text}
      </div>
      <div class="w-8 h-8 rounded-xl bg-brand-200 text-brand-900 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
        ${currentUser.name.charAt(0).toUpperCase()}
      </div>
    `;
    aiChatMessages.appendChild(msg);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  function appendChatBot(fnName, contentHtml) {
    if (!aiChatMessages) return;

    // Typing state
    const typing = document.createElement('div');
    typing.className = 'flex items-start gap-3 bot-typing-indicator';
    typing.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-brand-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
        <i data-lucide="bot" class="w-4 h-4 text-accent-light"></i>
      </div>
      <div class="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none p-3 max-w-sm text-xs text-slate-500 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
        <span>PilahAI sedang memanggil data sistem...</span>
      </div>
    `;
    aiChatMessages.appendChild(typing);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      typing.remove();

      const botMsg = document.createElement('div');
      botMsg.className = 'flex items-start gap-3';
      botMsg.innerHTML = `
        <div class="w-8 h-8 rounded-xl bg-brand-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <i data-lucide="bot" class="w-4 h-4 text-accent-light"></i>
        </div>
        <div class="bg-white border border-slate-200/90 rounded-2xl rounded-tl-none p-4 max-w-xl text-sm text-slate-800 space-y-2.5 shadow-2xs">
          <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[11px] text-slate-400">
            <span class="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">⚡ Function: ${fnName}</span>
            <span class="text-emerald-700 font-bold">Terverifikasi</span>
          </div>
          <div class="space-y-2 text-sm leading-relaxed">
            ${contentHtml}
          </div>
        </div>
      `;
      aiChatMessages.appendChild(botMsg);
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
      if (window.lucide) window.lucide.createIcons();
    }, 500);
  }

  function processAIQuery(query) {
    const q = query.toLowerCase();

    if (q.includes('kardus') || q.includes('karton') || q.includes('kertas')) {
      appendChatBot(
        'check_waste_category("kardus")',
        `
          <p>Kardus bekas kemasan masuk ke dalam kategori <strong>Anorganik (Daur Ulang)</strong> 📦.</p>
          <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <p class="font-bold">Cara Penanganan Tepat:</p>
            <p>Lipat pipih kardus dan ikat rapi agar hemat tempat. Pastikan tidak terkena tumpahan minyak atau air.</p>
          </div>
          <p class="text-xs text-slate-600">
            📍 <strong>Rekomendasi Penyaluran:</strong> Anda bisa langsung menyetorkannya ke <strong>Bank Sampah Berkah Hijau (450m)</strong> di wilayah ${activeDomicile.district} untuk ditukar tabungan sampah!
          </p>
        `
      );
    } else if (q.includes('lokasi') || q.includes('bank sampah') || q.includes('tps') || q.includes('terdekat')) {
      appendChatBot(
        `search_facilities("${activeDomicile.district}")`,
        `
          <p>Berdasarkan domisili aktif Anda di <strong>${activeDomicile.district}, ${activeDomicile.city}</strong>, berikut 2 fasilitas pengelolaan terdekat:</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <p class="font-bold text-slate-800">1. Bank Sampah Berkah Hijau</p>
              <p class="text-slate-500">Jarak: 450 meter</p>
              <p class="text-emerald-700 font-semibold">Buka: Rab & Sab (08.00-13.00)</p>
            </div>
            <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <p class="font-bold text-slate-800">2. TPS 3R Muktiharjo</p>
              <p class="text-slate-500">Jarak: 900 meter</p>
              <p class="text-emerald-700 font-semibold">Buka Setiap Hari (06.00-17.00)</p>
            </div>
          </div>
          <p class="text-xs text-slate-500 pt-1">Buka tab <strong>Cari Lokasi Fasilitas</strong> untuk melihat petunjuk arah rute lengkap.</p>
        `
      );
    } else if (q.includes('jadwal') || q.includes('angkut') || q.includes('truk') || q.includes('kapan')) {
      appendChatBot(
        `get_pickup_schedule("${activeDomicile.district}")`,
        `
          <p>Berikut jadwal armada angkut sampah resmi untuk wilayah <strong>${activeDomicile.district}</strong>:</p>
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1.5 text-blue-950">
            <p class="font-bold flex items-center justify-between">
              <span>Sampah Anorganik / Kering:</span>
              <span class="px-2 py-0.5 bg-blue-200 text-blue-900 rounded-full font-bold">Rabu & Sabtu</span>
            </p>
            <p class="text-slate-600">Jam lintasan armada: <strong>08.00 - 10.30 WIB</strong>.</p>
            <p class="text-slate-500 italic">Untuk sampah organik, dijemput setiap hari <strong>Senin & Kamis (07.00 - 09.30 WIB)</strong>.</p>
          </div>
        `
      );
    } else if (q.includes('baterai') || q.includes('lampu') || q.includes('b3')) {
      appendChatBot(
        'check_hazardous_waste("baterai_b3")',
        `
          <p>⚠️ <strong>Peringatan Limbah B3:</strong> Baterai bekas dan lampu neon tergolong bahan beracun dan berbahaya!</p>
          <div class="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-950 space-y-1">
            <p class="font-bold">Langkah Pengamanan:</p>
            <p>Rekatkan selotip bening pada kutub baterai dan simpan dalam wadah kering khusus. Jangan pernah dibakar atau dibuang ke selokan!</p>
          </div>
          <p class="text-xs text-slate-600">
            Kumpulkan dan serahkan ke <strong>Drop Box B3 Kantor Kecamatan ${activeDomicile.district} (1.5 km)</strong>.
          </p>
        `
      );
    } else if (q.includes('minyak') || q.includes('jelantah') || q.includes('goreng')) {
      appendChatBot(
        'check_waste_category("minyak_jelantah")',
        `
          <p>Minyak jelantah tergolong <strong>Limbah Khusus / B3</strong> 🍳.</p>
          <p class="text-xs text-slate-600">Jangan tuang minyak jelantah ke wastafel atau got karena memicu penyumbatan dan mencemari ekosistem air.</p>
          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950">
            <p class="font-bold">Penyaluran Bermanfaat:</p>
            <p>Tampung dalam jeriken/botol plastik tertutup. Anda dapat menyetorkannya ke Bank Sampah Berkah Hijau untuk diolah menjadi bahan bakar biodiesel ramah lingkungan!</p>
          </div>
        `
      );
    } else if (q.includes('botol') || q.includes('plastik')) {
      appendChatBot(
        'check_waste_category("botol_plastik_pet")',
        `
          <p>Botol plastik minuman (PET) tergolong <strong>Anorganik (Daur Ulang)</strong> 🧴.</p>
          <p class="text-xs text-slate-600">
            <strong>Tips:</strong> Kosongkan sisa cairan, lepas tutup dan labelnya, lalu remas hingga pipih agar hemat tempat penyimpanan sebelum disetor ke Bank Sampah.
          </p>
        `
      );
    } else {
      appendChatBot(
        'smart_assistant_reasoning("' + query.slice(0, 20) + '...")',
        `
          <p>Terima kasih atas pertanyaannya! Saya dapat membantu Anda mengidentifikasi kategori sampah, mengecek lokasi Bank Sampah, hingga jadwal penjemputan armada.</p>
          <p class="text-xs text-slate-600">
            Silakan coba ketik nama sampah tertentu seperti: <em>kardus, botol plastik, baterai, minyak jelantah</em>, atau tanyakan <em>jadwal angkut</em> dan <em>bank sampah terdekat</em>.
          </p>
        `
      );
    }
  }

  function sendUserQueryToAI(text) {
    if (!text.trim()) return;
    appendChatUser(text);
    processAIQuery(text);
  }

  if (aiChatForm) {
    aiChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = aiChatInput.value.trim();
      if (!text) return;
      aiChatInput.value = '';
      sendUserQueryToAI(text);
    });
  }

  chatChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (q === 'kardus') sendUserQueryToAI('Kardus bekas masuk kategori apa & ke mana disalurkan?');
      else if (q === 'lokasi') sendUserQueryToAI('Di mana lokasi Bank Sampah terdekat dari tempat saya?');
      else if (q === 'jadwal') sendUserQueryToAI('Kapan jadwal pengangkutan sampah anorganik minggu ini?');
      else if (q === 'baterai') sendUserQueryToAI('Bagaimana cara membuang baterai bekas dengan aman?');
      else if (q === 'minyak') sendUserQueryToAI('Minyak jelantah sisa gorengan harus disalurkan ke mana?');
    });
  });

  if (btnClearChat) {
    btnClearChat.addEventListener('click', () => {
      if (confirm('Bersihkan riwayat percakapan chat ini?')) {
        aiChatMessages.innerHTML = `
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-brand-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <i data-lucide="bot" class="w-4 h-4 text-accent-light"></i>
            </div>
            <div class="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none p-4 max-w-xl text-sm text-slate-700 space-y-2 shadow-2xs">
              <p>Halo <strong>${currentUser.name.split(' ')[0]}</strong>! Percakapan telah direset.</p>
              <p>Ada yang ingin kamu tanyakan lagi seputar sampah, fasilitas, atau jadwal?</p>
            </div>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }
});
