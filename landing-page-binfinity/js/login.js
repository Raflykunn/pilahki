/**
 * PilahKi' — Login Page Script (js/login.js)
 * Manages form interactions, password visibility, and Recovery PIN modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inisialisasi Ikon Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Toggle Lihat / Sembunyikan Kata Sandi Form Login
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

  // 3. Modal Lupa Kata Sandi (PIN Pemulihan)
  const openForgotModalBtn = document.getElementById('open-forgot-modal');
  const closeForgotModalBtn = document.getElementById('close-forgot-modal');
  const cancelForgotBtn = document.getElementById('cancel-forgot-btn');
  const forgotModal = document.getElementById('forgot-modal');
  const forgotForm = document.getElementById('forgot-form');
  const forgotAlert = document.getElementById('forgot-alert');
  const submitForgotBtn = document.getElementById('submit-forgot-btn');
  const recoveryPinInput = document.getElementById('recovery-pin');

  function openModal() {
    if (forgotForm) forgotForm.reset();
    if (forgotAlert) {
      forgotAlert.classList.add('hidden');
      forgotAlert.innerText = '';
    }
    if (forgotModal) {
      forgotModal.classList.remove('hidden');
    }
    if (recoveryPinInput) {
      setTimeout(() => recoveryPinInput.focus(), 50);
    }
  }

  function closeModal() {
    if (forgotModal) {
      forgotModal.classList.add('hidden');
    }
  }

  if (openForgotModalBtn) openForgotModalBtn.addEventListener('click', openModal);
  if (closeForgotModalBtn) closeForgotModalBtn.addEventListener('click', closeModal);
  if (cancelForgotBtn) cancelForgotBtn.addEventListener('click', closeModal);

  // Tutup jika klik area latar belakang modal atau tekan Escape
  if (forgotModal) {
    forgotModal.addEventListener('click', (e) => {
      if (e.target === forgotModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && forgotModal && !forgotModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // 4. Validasi Input PIN: HANYA BISA DIISI ANGKA (0-9)
  if (recoveryPinInput) {
    recoveryPinInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });

    recoveryPinInput.addEventListener('keydown', (e) => {
      // Tombol kontrol yang tetap diizinkan
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'];
      if (allowedKeys.includes(e.key)) {
        return;
      }
      // Cegah jika tombol yang ditekan bukan angka 0-9
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    });
  }

  // 5. Submit Form Pemulihan PIN
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pin = recoveryPinInput ? recoveryPinInput.value.trim() : '';
      const newPassInput = document.getElementById('new-password');
      const confirmNewPassInput = document.getElementById('confirm-new-password');
      const newPass = newPassInput ? newPassInput.value : '';
      const confirmNewPass = confirmNewPassInput ? confirmNewPassInput.value : '';

      if (pin.length < 4) {
        showForgotAlert('PIN pemulihan minimal terdiri dari 4-6 angka.');
        return;
      }

      if (newPass.length < 8) {
        showForgotAlert('Kata sandi baru minimal harus 8 karakter.');
        return;
      }

      if (newPass !== confirmNewPass) {
        showForgotAlert('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
        return;
      }

      if (submitForgotBtn) {
        submitForgotBtn.disabled = true;
        submitForgotBtn.innerText = 'Menyimpan...';
      }

      setTimeout(() => {
        if (submitForgotBtn) {
          submitForgotBtn.disabled = false;
          submitForgotBtn.innerText = 'Simpan Sandi Baru';
        }
        closeModal();

        // Tampilkan pesan sukses di halaman login
        const loginAlert = document.getElementById('login-alert');
        const loginAlertText = document.getElementById('login-alert-text');
        if (loginAlert && loginAlertText) {
          loginAlertText.innerText = 'Kata sandi baru Anda berhasil disimpan! Silakan masuk.';
          loginAlert.classList.remove('hidden');
        }
      }, 700);
    });
  }

  function showForgotAlert(message) {
    if (forgotAlert) {
      forgotAlert.innerText = message;
      forgotAlert.classList.remove('hidden');
    }
  }

  // 6. Simulasi Submit Form Login Utama
  const loginForm = document.getElementById('login-form');
  const loginAlert = document.getElementById('login-alert');
  const loginAlertText = document.getElementById('login-alert-text');
  const btnSubmit = document.getElementById('btn-submit');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!btnSubmit) return;

      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `
        <span class="inline-flex items-center gap-2">
          <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>Memproses...</span>
        </span>
      `;

      setTimeout(() => {
        if (loginAlert && loginAlertText) {
          loginAlertText.innerText = 'Login berhasil! Menghubungkan ke aplikasi...';
          loginAlert.classList.remove('hidden');
        }

        btnSubmit.innerHTML = `Berhasil Masuk`;
        btnSubmit.classList.remove('bg-brand-800', 'hover:bg-brand-700');
        btnSubmit.classList.add('bg-emerald-600');

        setTimeout(() => {
          const emailInput = document.getElementById('email');
          const emailVal = emailInput ? emailInput.value.trim() : 'warga@pilahki.id';
          const savedUser = JSON.parse(localStorage.getItem('pilahki_user') || '{}');
          const userName = savedUser.name || 'Warga PilahKi\'';
          localStorage.setItem('pilahki_user', JSON.stringify({ name: userName, email: emailVal }));
          window.location.href = 'App/index.html';
        }, 700);
      }, 700);
    });
  }
});
