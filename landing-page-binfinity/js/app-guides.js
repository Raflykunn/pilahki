/**
 * PilahKi' — Educational Guides Page Script (js/app-guides.js)
 * Manages article rendering, detail reader modal, and sustainability literacy content
 */

document.addEventListener("DOMContentLoaded", () => {
  const guideGrid = document.getElementById("guide-grid");
  const modal = document.getElementById("guide-detail-modal");
  const modalCloseBtn = document.getElementById("btn-close-guide-modal");
  const modalDismissBtn = document.getElementById("btn-dismiss-guide-modal");

  const modalCategoryBadge = document.getElementById("modal-guide-category");
  const modalReadTime = document.getElementById("modal-guide-readtime");
  const modalTitle = document.getElementById("modal-guide-title");
  const modalSummary = document.getElementById("modal-guide-summary");
  const modalContent = document.getElementById("modal-guide-content");

  const guidesData = [
    {
      id: "kompos-takakura",
      title: "Kompos Mandiri Metode Keranjang Takakura",
      category: "Kompos & Organik",
      readTime: "4 Menit Baca",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      summary: "Solusi praktis mengolah sampah sisa makanan menjadi pupuk kompos berkualitas tinggi di lahan terbatas tanpa bau.",
      contentHtml: `
        <h4 class="text-base font-bold text-slate-900 mt-2">Mengapa Metode Takakura Cocok untuk Rumah Tangga?</h4>
        <p class="text-sm text-slate-700 leading-relaxed">
          Metode Takakura dikembangkan oleh Koji Takakura dari Jepang. Berbeda dengan komposter konvensional yang kerap berbau busuk, metode ini memanfaatkan keranjang berpori dan bantalan sekam yang kaya mikroorganisme lokal untuk fermentasi aerobik yang higienis.
        </p>

        <h4 class="text-base font-bold text-slate-900 mt-4">Alat & Bahan yang Diperlukan:</h4>
        <ul class="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
          <li>Keranjang cucian berlubang/anyaman berpori (ukuran 40x30 cm).</li>
          <li>Dua buah bantal sekam (sekam padi dibungkus kain kasa/kelambu).</li>
          <li>Kardus bekas tebal untuk melapisi dinding bagian dalam keranjang.</li>
          <li>Starter mikroorganisme (kompos matang atau EM4 yang dicampur bekatul).</li>
          <li>Kain penutup keranjang berpori (kain katun/kaos lama).</li>
        </ul>

        <h4 class="text-base font-bold text-slate-900 mt-4">Langkah-Langkah Pembuatan & Perawatan:</h4>
        <ol class="list-decimal pl-5 text-sm text-slate-700 space-y-2">
          <li>Lapisi dinding dalam keranjang dengan kardus tebal guna menjaga kelembapan mikroba dan sirkulasi udara.</li>
          <li>Letakkan bantal sekam pertama di bagian dasar keranjang sebagai filter sirkulasi bawah.</li>
          <li>Masukkan starter kompos atau tanah subur setinggi 5–10 cm di atas bantal sekam.</li>
          <li>Masukkan sampah organik dapur (sayur, kulit buah, sisa nasi) yang sudah dipotong kecil dan ditiriskan kuahnya.</li>
          <li>Aduk merata menggunakan sekop kecil agar sampah bercampur dengan mikroba.</li>
          <li>Tutup dengan bantal sekam kedua dan tutupi keranjang dengan kain penutup agar lalat tidak masuk.</li>
          <li>Suhu hangat pada media kompos menandakan bakteri pengurai bekerja aktif!</li>
        </ol>
      `
    },
    {
      id: "lubang-biopori",
      title: "Pembuatan Lubang Resapan Biopori (LRB)",
      category: "Konservasi Tanah",
      readTime: "3 Menit Baca",
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
      summary: "Cegah genangan air hujan sekaligus ubah daun kering pekarangan menjadi kompos alami langsung di dalam tanah.",
      contentHtml: `
        <h4 class="text-base font-bold text-slate-900 mt-2">Manfaat Lubang Resapan Biopori (LRB)</h4>
        <p class="text-sm text-slate-700 leading-relaxed">
          Biopori adalah lubang silindris vertikal ke dalam tanah yang memicu aktivitas fauna tanah seperti cacing dan perakaran tanaman. Lubang ini berfungsi ganda: memaksimalkan resapan air hujan ke tanah dan mendegradasi sampah organik dedaunan secara alami.
        </p>

        <h4 class="text-base font-bold text-slate-900 mt-4">Cara Membuat Biopori Pekarangan:</h4>
        <ol class="list-decimal pl-5 text-sm text-slate-700 space-y-2">
          <li>Pilih lokasi pekarangan tanah yang dialiri air hujan (dekat talang atau sudut halaman).</li>
          <li>Siram tanah dengan air agar lunak sebelum dibor.</li>
          <li>Gunakan bor biopori manual tegak lurus dengan kedalaman sekitar 80–100 cm dengan diameter 10 cm.</li>
          <li>Masukkan pipa paralon PVC diameter 10 cm yang dindingnya telah dilubangi kecil-kecil dan pasang tutup berpori di atasnya.</li>
          <li>Isi lubang dengan sampah organik kebun (daun kering, ranting kecil, sisa buah).</li>
          <li>Biarkan 2-3 bulan hingga menyusut dan berubah menjadi kompos kaya humus yang bisa dipanen dengan bor biopori.</li>
        </ol>
      `
    },
    {
      id: "limbah-b3-rumah-tangga",
      title: "Pengelolaan Limbah B3 Rumah Tangga Aman",
      category: "Keamanan Lingkungan",
      readTime: "5 Menit Baca",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      summary: "Hindari bahaya ledakan dan keracunan zat merkuri/timbal dari baterai, kaleng aerosol, dan obat kedaluwarsa.",
      contentHtml: `
        <h4 class="text-base font-bold text-slate-900 mt-2">Apa Saja Limbah B3 Rumah Tangga?</h4>
        <p class="text-sm text-slate-700 leading-relaxed">
          Bahan Berbahaya dan Beracun (B3) tidak hanya berasal dari pabrik industri. Setiap rumah tangga rutin menghasilkan limbah B3 seperti baterai remote/jam, botol obat nyamuk semprot, bohlam lampu, termometer raksa, hingga pembersih porselen lantai.
        </p>

        <h4 class="text-base font-bold text-slate-900 mt-4">Aturan Emas Penanganan B3:</h4>
        <ul class="list-disc pl-5 text-sm text-slate-700 space-y-2">
          <li><strong>Isolasi Kontak Listrik:</strong> Rekatkan selotip bening pada kutub baterai bekas sebelum disimpan.</li>
          <li><strong>Kotak Khusus Kering:</strong> Gunakan kotak plastik bertutup berlabel "BAHAYA B3" dan letakkan di tempat tinggi yang tidak terjangkau anak-anak.</li>
          <li><strong>Jangan Dibuang ke Saluran Air:</strong> Pembuangan zat kimia pembersih pekat ke selokan mematikan ekosistem air dan mencemari sumur dangkal warga.</li>
          <li><strong>Salurkan ke Drop Box Resmi:</strong> Kunjungi Pos Pantau DLH Kota Makassar atau Drop Box Balai Kota setiap kali kotak B3 Anda penuh.</li>
        </ul>
      `
    },
    {
      id: "kode-plastik",
      title: "Panduan Lengkap Memahami 7 Kode Plastik",
      category: "Plastik & Daur Ulang",
      readTime: "4 Menit Baca",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      summary: "Kenali arti kode segitiga angka 1 hingga 7 pada wadah plastik makanan agar aman digunakan dan bernilai tinggi di Bank Sampah.",
      contentHtml: `
        <h4 class="text-base font-bold text-slate-900 mt-2">Arti Kode Daur Ulang Resin Plastik:</h4>
        <div class="space-y-2.5 text-sm text-slate-700 mt-2">
          <p><strong>1 - PET / PETE (Polyethylene Terephthalate):</strong> Botol air mineral bening. Hanya untuk sekali pakai. Nilai jual di bank sampah sangat tinggi.</p>
          <p><strong>2 - HDPE (High-Density Polyethylene):</strong> Botol sampo, botol detergen, tutup galon. Plastik tebal, aman dipakai berulang, mudah didaur ulang.</p>
          <p><strong>3 - PVC (Polyvinyl Chloride):</strong> Pipa paralon, selang air. Mengandung klorin dan dilarang keras dibakar.</p>
          <p><strong>4 - LDPE (Low-Density Polyethylene):</strong> Plastik kresek belanja, bubble wrap. Fleksibel dan elastis.</p>
          <p><strong>5 - PP (Polypropylene):</strong> Kotak makan microwave, botol susu bayi, sedotan. Jenis plastik paling tahan panas dan aman untuk wadah makanan berulang.</p>
          <p><strong>6 - PS (Polystyrene / Styrofoam):</strong> Tempat makan mie instan, kotak sterofoam. Rawan mengeluarkan zat stiren berbahaya bila terkena panas tinggi. Masuk residu.</p>
          <p><strong>7 - OTHER:</strong> Bahan campuran (seperti polikarbonat atau bioplastik PLA).</p>
        </div>
      `
    }
  ];

  function renderGuides() {
    if (!guideGrid) return;
    guideGrid.innerHTML = "";

    guidesData.forEach((guide) => {
      const card = document.createElement("div");
      card.className =
        "bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-brand-300 transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer group";

      card.innerHTML = `
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${guide.badgeColor}">
              ${guide.category}
            </span>
            <span class="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <i data-lucide="book-open" class="w-3.5 h-3.5 text-brand-600"></i>
              ${guide.readTime}
            </span>
          </div>

          <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug">
            ${guide.title}
          </h3>

          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ${guide.summary}
          </p>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-700 group-hover:text-brand-800">
          <span>Baca Panduan Lengkap</span>
          <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
        </div>
      `;

      card.addEventListener("click", () => {
        openGuideModal(guide);
      });

      guideGrid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function openGuideModal(guide) {
    if (modalTitle) modalTitle.innerText = guide.title;
    if (modalCategoryBadge) {
      modalCategoryBadge.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${guide.badgeColor}`;
      modalCategoryBadge.innerText = guide.category;
    }
    if (modalReadTime) modalReadTime.innerText = guide.readTime;
    if (modalSummary) modalSummary.innerText = guide.summary;
    if (modalContent) modalContent.innerHTML = guide.contentHtml;

    if (modal) modal.classList.remove("hidden");
  }

  function closeGuideModal() {
    if (modal) modal.classList.add("hidden");
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeGuideModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener("click", closeGuideModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeGuideModal();
    });
  }

  renderGuides();
});
