/**
 * PilahKi' — Registration Page Script (js/register.js)
 * Handles citizen registration form validation, password visibility toggle, and submission simulation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inisialisasi Ikon Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Toggle Lihat / Sembunyikan Kata Sandi
  const togglePassBtn = document.getElementById('toggle-password');
  const passInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eye-icon');

  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passInput.getAttribute('type') === 'password';
      passInput.setAttribute('type', isPassword ? 'text' : 'password');
      if (eyeIcon) {
        eyeIcon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  // 3. Elemen Form Register
  const regForm = document.getElementById('register-form');
  const regAlert = document.getElementById('register-alert');
  const regAlertText = document.getElementById('register-alert-text');
  const btnSubmit = document.getElementById('btn-register-submit');
  const confirmPass = document.getElementById('confirm-password');

  // 4. Handle Submit Form
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validasi Panjang Sandi
      if (passInput && passInput.value.length < 8) {
        alert('Kata sandi minimal harus terdiri dari 8 karakter.');
        passInput.focus();
        return;
      }

      // Validasi Kecocokan Sandi
      if (passInput && confirmPass && passInput.value !== confirmPass.value) {
        alert('Kata sandi dan konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
        confirmPass.focus();
        return;
      }

      // Animasi Tombol Submit
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `
          <span class="inline-flex items-center gap-2">
            <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Mendaftarkan...</span>
          </span>
        `;
      }

      setTimeout(() => {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const userName = nameInput ? nameInput.value.trim() : 'Warga Baru';
        const userEmail = emailInput ? emailInput.value.trim() : 'warga@pilahki.id';

        localStorage.setItem('pilahki_user', JSON.stringify({ name: userName, email: userEmail }));
        localStorage.setItem('pilahki_is_new_user', 'true');

        if (regAlert) {
          if (regAlertText) {
            regAlertText.innerText = 'Pendaftaran berhasil! Mengalihkan ke aplikasi PilahKi\'...';
          }
          regAlert.classList.remove('hidden');
        }

        if (btnSubmit) {
          btnSubmit.innerHTML = `Pendaftaran Sukses!`;
          btnSubmit.classList.remove('bg-brand-800', 'hover:bg-brand-700');
          btnSubmit.classList.add('bg-emerald-600');
        }

        setTimeout(() => {
          // Redirect ke halaman aplikasi utama
          window.location.href = 'App/index.html';
        }, 800);
      }, 700);
    });
  }
});
