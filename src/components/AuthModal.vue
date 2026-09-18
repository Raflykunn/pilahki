<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Masuk ke Pilahki'
  },
  subtitle: {
    type: String,
    default: 'Masuk dengan email dan kata sandi untuk mengakses fitur lengkap Pilahki.'
  }
})

const emit = defineEmits(['close', 'auth-success'])

const {
  loading,
  authError,
  signInWithEmail,
  signUpWithEmail
} = useAuth()

const isRegisterMode = ref(false)
const email = ref('')
const password = ref('')
const successMessage = ref('')

const resetForm = () => {
  email.value = ''
  password.value = ''
  successMessage.value = ''
}

const handleClose = () => {
  resetForm()
  emit('close')
}

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  successMessage.value = ''
}

const handleSubmit = async () => {
  successMessage.value = ''
  if (!email.value || !password.value) return

  if (isRegisterMode.value) {
    const res = await signUpWithEmail(email.value, password.value)
    if (res.success) {
      successMessage.value = 'Pendaftaran berhasil! Silakan periksa email Anda atau langsung masuk jika konfirmasi otomatis aktif.'
      setTimeout(() => {
        emit('auth-success')
        handleClose()
      }, 1500)
    }
  } else {
    const res = await signInWithEmail(email.value, password.value)
    if (res.success) {
      emit('auth-success')
      handleClose()
    }
  }
}
</script>

<template>
  <div v-if="isOpen" class="auth-modal-overlay" @click.self="handleClose">
    <div class="auth-modal-card" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <!-- Tombol Tutup -->
      <button type="button" class="modal-close-btn" aria-label="Tutup modal" @click="handleClose">
        &times;
      </button>

      <div class="modal-header">
        <div class="modal-icon-badge" aria-hidden="true">
          🌱
        </div>
        <h2 id="auth-modal-title" class="modal-title">
          {{ isRegisterMode ? 'Buat Akun Pilahki' : title }}
        </h2>
        <p class="modal-subtitle">
          {{ subtitle }}
        </p>
      </div>

      <!-- Notifikasi Ralat & Kejayaan -->
      <div v-if="authError" class="auth-alert auth-alert-error" role="alert">
        {{ authError }}
      </div>
      <div v-if="successMessage" class="auth-alert auth-alert-success" role="alert">
        {{ successMessage }}
      </div>

      <!-- Borang Email & Kata Laluan -->
      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="auth-email" class="form-label">Alamat Email</label>
          <input
            id="auth-email"
            v-model="email"
            type="email"
            required
            class="form-input"
            placeholder="nama@email.com"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="auth-password" class="form-label">Kata Sandi</label>
          <input
            id="auth-password"
            v-model="password"
            type="password"
            required
            minlength="6"
            class="form-input"
            placeholder="Minimal 6 karakter"
            :disabled="loading"
          />
        </div>

        <button type="submit" class="submit-auth-btn" :disabled="loading">
          <span v-if="!loading">
            {{ isRegisterMode ? 'Daftar Sekarang' : 'Masuk' }}
          </span>
          <span v-else>Memproses...</span>
        </button>
      </form>

      <!-- Toggle Mod Masuk / Daftar -->
      <div class="modal-footer-toggle">
        <span>{{ isRegisterMode ? 'Sudah punya akun?' : 'Belum punya akun?' }}</span>
        <button type="button" class="toggle-mode-btn" @click="toggleMode">
          {{ isRegisterMode ? 'Masuk di sini' : 'Daftar akun baru' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.auth-modal-card {
  position: relative;
  background-color: #ffffff;
  border-radius: 14px;
  width: 100%;
  max-width: 400px;
  padding: 32px 28px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.15s;
}

.modal-close-btn:hover {
  color: #0f172a;
}

.modal-header {
  text-align: center;
  margin-bottom: 22px;
}

.modal-icon-badge {
  font-size: 1.6rem;
  margin-bottom: 6px;
}

.modal-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
}

.modal-subtitle {
  font-size: 0.88rem;
  color: #64748b;
  margin: 0;
  line-height: 1.45;
}

.auth-alert {
  font-size: 0.85rem;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  line-height: 1.4;
}

.auth-alert-error {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.auth-alert-success {
  background-color: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.form-label {
  font-size: 0.84rem;
  font-weight: 600;
  color: #334155;
}

.form-input {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.92rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-input:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px #dcfce7;
}

.submit-auth-btn {
  margin-top: 4px;
  padding: 11px;
  background-color: #15803d;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
}

.submit-auth-btn:hover:not(:disabled) {
  background-color: #166534;
}

.submit-auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.modal-footer-toggle {
  margin-top: 20px;
  text-align: center;
  font-size: 0.85rem;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.toggle-mode-btn {
  background: none;
  border: none;
  color: #15803d;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
}

.toggle-mode-btn:hover {
  text-decoration: underline;
}
</style>
