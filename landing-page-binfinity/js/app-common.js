/**
 * PilahKi' — Common Application Script (js/app-common.js)
 * Shared across all tab pages in App/ folder.
 * Manages user session, header profile, logout, and progressive profiling domicile modal.
 */

(function () {
  // Default fallback data
  const DEFAULT_USER = {
    name: "Warga PilahKi'",
    email: "warga@pilahki.id",
  };

  const DEFAULT_DOMICILE = {
    city: "Kota Makassar",
    district: "Panakkukang",
    detail: "",
  };

  // Helper to read user
  window.getPilahkiUser = function () {
    try {
      const raw = localStorage.getItem("pilahki_user");
      return raw ? JSON.parse(raw) : DEFAULT_USER;
    } catch (e) {
      return DEFAULT_USER;
    }
  };

  // Helper to read domicile
  window.getPilahkiDomicile = function () {
    try {
      const raw = localStorage.getItem("pilahki_domicile");
      return raw ? JSON.parse(raw) : DEFAULT_DOMICILE;
    } catch (e) {
      return DEFAULT_DOMICILE;
    }
  };

  // Helper to save domicile
  window.setPilahkiDomicile = function (domicile) {
    localStorage.setItem("pilahki_domicile", JSON.stringify(domicile));
    localStorage.removeItem("pilahki_is_new_user");
    window.dispatchEvent(
      new CustomEvent("pilahki-domicile-changed", { detail: domicile })
    );
  };

  document.addEventListener("DOMContentLoaded", () => {
    // 1. Inisialisasi Ikon Lucide
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // 2. Tampilkan Info Profil Pengguna
    const user = window.getPilahkiUser();
    const userDisplayName = document.getElementById("user-display-name");
    const userDisplayEmail = document.getElementById("user-display-email");
    const userAvatarInitial = document.getElementById("user-avatar-initial");

    if (userDisplayName) userDisplayName.innerText = user.name;
    if (userDisplayEmail) userDisplayEmail.innerText = user.email;
    if (userAvatarInitial && user.name) {
      userAvatarInitial.innerText = user.name.trim().charAt(0).toUpperCase();
    }

    // 3. Tombol Logout
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        if (confirm("Apakah Anda yakin ingin keluar dari PilahKi'?")) {
          localStorage.removeItem("pilahki_is_new_user");
          window.location.href = "../login.html";
        }
      });
    }

    // 3b. Profile Modal Logic (terutama untuk menu mobile)
    const btnMobileProfile = document.getElementById("btn-mobile-profile");
    const profileModal = document.getElementById("profile-modal");
    const btnCloseProfileModal = document.getElementById("btn-close-profile-modal");
    const btnProfileLogout = document.getElementById("btn-profile-logout");
    const profileModalName = document.getElementById("profile-modal-name");
    const profileModalEmail = document.getElementById("profile-modal-email");
    const profileModalAvatar = document.getElementById("profile-modal-avatar");

    if (profileModalName) profileModalName.innerText = user.name;
    if (profileModalEmail) profileModalEmail.innerText = user.email;
    if (profileModalAvatar && user.name) {
      profileModalAvatar.innerText = user.name.trim().charAt(0).toUpperCase();
    }

    if (btnMobileProfile && profileModal) {
      btnMobileProfile.addEventListener("click", () => {
        profileModal.classList.remove("hidden");
      });
    }

    if (btnCloseProfileModal && profileModal) {
      btnCloseProfileModal.addEventListener("click", () => {
        profileModal.classList.add("hidden");
      });
    }

    if (profileModal) {
      profileModal.addEventListener("click", (e) => {
        if (e.target === profileModal) profileModal.classList.add("hidden");
      });
    }

    if (btnProfileLogout) {
      btnProfileLogout.addEventListener("click", () => {
        if (confirm("Apakah Anda yakin ingin keluar dari PilahKi'?")) {
          localStorage.removeItem("pilahki_is_new_user");
          window.location.href = "../login.html";
        }
      });
    }

    // 4. Sinkronisasi Teks Domisili di Header
    function updateHeaderDomicileUI(domicile) {
      const headerDomicileText = document.getElementById(
        "header-domicile-text"
      );
      if (headerDomicileText) {
        headerDomicileText.innerText = `${domicile.district}, ${domicile.city}`;
      }
    }

    const currentDomicile = window.getPilahkiDomicile();
    updateHeaderDomicileUI(currentDomicile);

    // 5. Modal Domisili (Progressive Profiling & Ubah Wilayah)
    const domicileModal = document.getElementById("domicile-modal");
    const domicileForm = document.getElementById("domicile-form");
    const btnOpenDomicile = document.getElementById("btn-open-domicile");
    const btnDismissDomicile = document.getElementById("btn-dismiss-domicile");
    const triggerDomicileBtns = document.querySelectorAll(
      ".trigger-domicile-btn"
    );

    function openDomicileModal() {
      const active = window.getPilahkiDomicile();
      const citySelect = document.getElementById("domicile-city");
      const districtSelect = document.getElementById("domicile-district");
      const detailInput = document.getElementById("domicile-detail");

      if (citySelect) citySelect.value = active.city;
      if (districtSelect) districtSelect.value = active.district;
      if (detailInput) detailInput.value = active.detail || "";

      if (domicileModal) domicileModal.classList.remove("hidden");
    }

    function closeDomicileModal() {
      if (domicileModal) domicileModal.classList.add("hidden");
    }

    if (btnOpenDomicile)
      btnOpenDomicile.addEventListener("click", openDomicileModal);
    if (btnDismissDomicile) {
      btnDismissDomicile.addEventListener("click", () => {
        closeDomicileModal();
        localStorage.removeItem("pilahki_is_new_user");
      });
    }

    triggerDomicileBtns.forEach((btn) => {
      btn.addEventListener("click", openDomicileModal);
    });

    if (domicileForm) {
      domicileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const city =
          document.getElementById("domicile-city")?.value || "Kota Makassar";
        const district =
          document.getElementById("domicile-district")?.value || "Panakkukang";
        const detail =
          document.getElementById("domicile-detail")?.value?.trim() || "";

        const newDomicile = { city, district, detail };
        window.setPilahkiDomicile(newDomicile);
        updateHeaderDomicileUI(newDomicile);
        closeDomicileModal();
      });
    }

    // 6. Progressive Profiling Pertama Kali (Jika User Baru Mendaftar)
    const isNewUser = localStorage.getItem("pilahki_is_new_user");
    if (isNewUser === "true" && domicileModal) {
      setTimeout(() => {
        openDomicileModal();
      }, 350);
    }

    // Re-render header domicile saat event triggered
    window.addEventListener("pilahki-domicile-changed", (e) => {
      updateHeaderDomicileUI(e.detail);
    });
  });
})();
