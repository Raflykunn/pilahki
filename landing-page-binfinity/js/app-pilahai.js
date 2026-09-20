/**
 * PilahKi' — PilahAI Hub Page Script (js/app-pilahai.js)
 * Interactive chatbot with smart suggestions, function-calling simulations, and history
 */

document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chat-messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const btnClearChat = document.getElementById("btn-clear-chat");
  const chipButtons = document.querySelectorAll(".prompt-chip");
  const chatWelcomeName = document.getElementById("chat-welcome-name");

  // Set welcome name from session
  const user = window.getPilahkiUser ? window.getPilahkiUser() : { name: "Warga" };
  if (chatWelcomeName && user.name) {
    chatWelcomeName.innerText = user.name.split(" ")[0];
  }

  function scrollToBottom() {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function appendUserMessage(text) {
    if (!chatMessages) return;
    const msgDiv = document.createElement("div");
    msgDiv.className = "flex items-start justify-end gap-3";
    msgDiv.innerHTML = `
      <div class="max-w-[85%] sm:max-w-[75%] bg-brand-800 text-white p-4 rounded-2xl rounded-tr-none text-sm leading-relaxed shadow-2xs">
        <p>${text}</p>
      </div>
      <div class="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 select-none">
        ${(user.name || 'W').charAt(0).toUpperCase()}
      </div>
    `;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  function appendTypingIndicator() {
    if (!chatMessages) return null;
    const typingDiv = document.createElement("div");
    typingDiv.id = "chat-typing";
    typingDiv.className = "flex items-start gap-3";
    typingDiv.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-brand-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
        <i data-lucide="bot" class="w-4 h-4 text-accent-light"></i>
      </div>
      <div class="bg-white border border-slate-200/80 p-4 rounded-2xl rounded-tl-none shadow-2xs">
        <div class="flex items-center gap-1.5 py-1">
          <span class="w-2 h-2 rounded-full bg-brand-600 animate-bounce"></span>
          <span class="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]"></span>
          <span class="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]"></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    if (window.lucide) window.lucide.createIcons();
    scrollToBottom();
    return typingDiv;
  }

  function generateAIResponse(query) {
    const q = query.toLowerCase();
    const activeDomicile = window.getPilahkiDomicile ? window.getPilahkiDomicile() : { district: "Panakkukang", city: "Makassar" };

    if (q.includes("baterai") || q.includes("aki") || q.includes("b3") || q.includes("lampu")) {
      return {
        functionCalled: "get_waste_category(waste_name='Baterai Bekas')",
        text: `Baterai bekas dan bohlam termasuk dalam kategori **Limbah B3 (Bahan Berbahaya & Beracun)**.<br><br>
        <strong>Langkah Penanganan:</strong><br>
        1. Tutup kedua kutub (+) dan (-) baterai dengan selotip bening untuk mencegah korsleting arus pendek.<br>
        2. Simpan di wadah plastik kering dan jauhkan dari jangkauan anak-anak.<br>
        3. <strong>Jangan dibuang ke tempat sampah umum atau dibakar!</strong> Salurkan ke Drop Box B3 DLH terdekat.`,
        actionLink: "cari-lokasi.html?filter=drop_box_b3",
        actionText: "Lihat Drop Box B3 Terdekat",
      };
    }

    if (q.includes("jadwal") || q.includes("truk") || q.includes("angkut") || q.includes("kapan")) {
      return {
        functionCalled: `get_pickup_schedule(district='${activeDomicile.district}')`,
        text: `Berikut jadwal armada pengangkutan sampah untuk wilayah <strong>${activeDomicile.district}, ${activeDomicile.city}</strong>:<br><br>
        • <strong>Senin (06.30 - 09.00 WIB)</strong>: Sampah Organik & Sisa Dapur (Truk TPS 3R)<br>
        • <strong>Rabu (08.00 - 11.00 WIB)</strong>: Sampah Anorganik & Kertas/Kardus (Bank Sampah)<br>
        • <strong>Kamis & Sabtu (06.00 - 08.30 WIB)</strong>: Sampah Residu Umum (Truk Kompaktor DLH)<br><br>
        <em>Tips: Letakkan tempat sampah di depan pagar sebelum jam penjemputan dalam keadaan tertutup rapat.</em>`,
        actionLink: "jadwal-angkut.html",
        actionText: "Lihat Jadwal Lengkap",
      };
    }

    if (q.includes("bank sampah") || q.includes("lokasi") || q.includes("tps") || q.includes("terdekat")) {
      return {
        functionCalled: `find_facilities(district='${activeDomicile.district}')`,
        text: `Saya menemukan fasilitas pengelolaan sampah terdekat dari domisili Anda di <strong>${activeDomicile.district}</strong>:<br><br>
        1. <strong>Bank Sampah Berkah Resik Pedurungan</strong> (± 0.8 km)<br>
           <em>Jl. Wolter Monginsidi No. 45 — Buka: Sabtu & Minggu (08.00 - 13.00 WIB)</em><br>
           Menerima: Botol PET, Kardus, Kertas, Kaleng, Minyak Jelantah.<br><br>
        2. <strong>TPS 3R Wilayah ${activeDomicile.district}</strong> (± 1.4 km)<br>
           <em>Buka setiap hari kerja untuk pengolahan sampah organik & daur ulang.</em>`,
        actionLink: "cari-lokasi.html",
        actionText: "Buka Peta & Petunjuk Arah",
      };
    }

    if (q.includes("kardus") || q.includes("karton") || q.includes("botol") || q.includes("plastik")) {
      return {
        functionCalled: "get_waste_category(waste_name='Kardus & Plastik')",
        text: `Kardus dan botol plastik termasuk kategori <strong>Sampah Anorganik Daur Ulang</strong> dengan nilai ekonomis tinggi.<br><br>
        <strong>Cara Penanganan:</strong><br>
        1. Buka lipatan kardus dan pipihkan agar hemat ruang penyimpanan.<br>
        2. Bilas botol plastik dari sisa rasa manis atau minyak, lalu remas botol.<br>
        3. Kumpulkan hingga minimal 2-3 kg untuk ditimbang dan ditukar saldo di Bank Sampah terdekat!`,
        actionLink: "pilah-sampah.html?filter=anorganik",
        actionText: "Buka Katalog Anorganik",
      };
    }

    if (q.includes("kompos") || q.includes("sayur") || q.includes("sisa makanan") || q.includes("buah")) {
      return {
        functionCalled: "get_guide(slug='kompos-mandiri-takakura')",
        text: `Sisa sayur, buah, dan makanan dapur termasuk <strong>Sampah Organik</strong>. Hindari langsung dibuang ke tempat sampah residu agar tidak menimbulkan bau dan gas metana di TPA.<br><br>
        Anda dapat mengolahnya menjadi pupuk kompos berkualitas di rumah menggunakan <strong>Metode Keranjang Takakura</strong> atau dimasukkan ke lubang biopori.`,
        actionLink: "panduan.html",
        actionText: "Baca Panduan Kompos Takakura",
      };
    }

    // Default Fallback
    return {
      functionCalled: "search_waste_database(query='" + query + "')",
      text: `Pertanyaan Anda seputar <em>"${query}"</em> telah saya proses.<br><br>
      Untuk hasil paling akurat, Anda dapat memeriksa panduan pemilahan 22 jenis sampah umum di tab <strong>Pilah Sampah</strong>, atau cek fasilitas penampungan di tab <strong>Cari Lokasi</strong>.`,
      actionLink: "pilah-sampah.html",
      actionText: "Jelajahi Katalog Sampah",
    };
  }

  function appendBotMessage(responseObj) {
    if (!chatMessages) return;
    const msgDiv = document.createElement("div");
    msgDiv.className = "flex items-start gap-3";
    msgDiv.innerHTML = `
      <div class="w-8 h-8 rounded-xl bg-brand-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
        <i data-lucide="bot" class="w-4 h-4 text-accent-light"></i>
      </div>
      <div class="max-w-[85%] sm:max-w-[75%] bg-white border border-slate-200/90 text-slate-800 p-4 sm:p-5 rounded-2xl rounded-tl-none shadow-2xs space-y-3">
        ${
          responseObj.functionCalled
            ? `<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-50 text-brand-800 text-[11px] font-mono border border-brand-100/80">
                <i data-lucide="cpu" class="w-3 h-3 text-brand-600"></i>
                <span>${responseObj.functionCalled}</span>
               </div>`
            : ""
        }
        <div class="text-sm leading-relaxed text-slate-700">
          ${responseObj.text}
        </div>
        ${
          responseObj.actionLink
            ? `<div class="pt-1">
                <a href="${responseObj.actionLink}" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold transition-colors border border-brand-200/60">
                  <span>${responseObj.actionText}</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </a>
               </div>`
            : ""
        }
      </div>
    `;
    chatMessages.appendChild(msgDiv);
    if (window.lucide) window.lucide.createIcons();
    scrollToBottom();
  }

  function handleSendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    appendUserMessage(trimmed);
    if (chatInput) chatInput.value = "";

    const typingEl = appendTypingIndicator();
    setTimeout(() => {
      if (typingEl && typingEl.parentNode) {
        typingEl.parentNode.removeChild(typingEl);
      }
      const response = generateAIResponse(trimmed);
      appendBotMessage(response);
    }, 600);
  }

  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (chatInput) handleSendMessage(chatInput.value);
    });
  }

  chipButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = btn.getAttribute("data-query");
      if (q) handleSendMessage(q);
    });
  });

  if (btnClearChat) {
    btnClearChat.addEventListener("click", () => {
      if (confirm("Bersihkan seluruh riwayat percakapan chat ini?")) {
        chatMessages.innerHTML = `
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-brand-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <i data-lucide="bot" class="w-4 h-4 text-accent-light"></i>
            </div>
            <div class="max-w-[85%] sm:max-w-[75%] bg-white border border-slate-200/90 text-slate-800 p-4 rounded-2xl rounded-tl-none shadow-2xs space-y-2">
              <p class="text-sm leading-relaxed">
                Halo! Riwayat percakapan telah dibersihkan. Ada yang bisa saya bantu terkait pemilahan atau penyaluran sampah hari ini?
              </p>
            </div>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  // FAB Toggle Logic
  const btnTogglePilahai = document.getElementById("btn-toggle-pilahai");
  const btnClosePilahai = document.getElementById("btn-close-pilahai");
  const pilahaiChatWindow = document.getElementById("pilahai-chat-window");

  function openPilahaiChat() {
    if (pilahaiChatWindow) {
      pilahaiChatWindow.classList.remove("hidden");
      scrollToBottom();
      if (chatInput) setTimeout(() => chatInput.focus(), 150);
    }
  }

  function closePilahaiChat() {
    if (pilahaiChatWindow) {
      pilahaiChatWindow.classList.add("hidden");
    }
  }

  if (btnTogglePilahai) {
    btnTogglePilahai.addEventListener("click", () => {
      if (pilahaiChatWindow && pilahaiChatWindow.classList.contains("hidden")) {
        openPilahaiChat();
      } else {
        closePilahaiChat();
      }
    });
  }

  if (btnClosePilahai) {
    btnClosePilahai.addEventListener("click", closePilahaiChat);
  }

  window.openPilahAiWithQuery = function (query) {
    openPilahaiChat();
    handleSendMessage(query);
  };

  // Check URL query parameters (e.g., ?q=baterai)
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q");
  if (initialQuery) {
    setTimeout(() => {
      openPilahaiChat();
      handleSendMessage(initialQuery);
    }, 400);
  }
});
