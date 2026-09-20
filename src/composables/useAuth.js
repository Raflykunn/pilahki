import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

const ACCOUNTS_KEY = 'pilahki_registered_accounts'
const CURRENT_USER_KEY = 'pilahki_user'

// Helper untuk membaca daftar akun yang telah terdaftar
function getStoredAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  return {}
}

// Helper untuk menyimpan daftar akun ke localStorage
function saveStoredAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch (e) {}
}

// Restore session pengguna dari localStorage HANYA jika akun valid dan terdaftar
function getInitialUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.email) {
        const normalized = parsed.email.trim().toLowerCase()
        const accounts = getStoredAccounts()
        // Pastikan akun tersebut benar-benar ada di daftar akun terdaftar
        if (accounts[normalized]) {
          const acc = accounts[normalized]
          return {
            id: acc.id,
            email: acc.email,
            name: acc.name || parsed.name || "Warga PilahKi'",
            user_metadata: { name: acc.name || parsed.name || "Warga PilahKi'" }
          }
        }
      }
    }
  } catch (e) {}
  // Jika tidak terdaftar, bersihkan sisa login palsu sebelumnya
  try {
    localStorage.removeItem(CURRENT_USER_KEY)
  } catch (e) {}
  return null
}

const initialUser = getInitialUser()
const user = ref(initialUser)
const session = ref(initialUser ? { user: initialUser } : null)
const loading = ref(false)
const authError = ref(null)

let isInitialized = false

export function useAuth() {
  const initAuth = async () => {
    if (isInitialized) return
    isInitialized = true

    try {
      if (supabase && typeof supabase.auth?.getSession === 'function') {
        const { data, error } = await supabase.auth.getSession()
        if (!error && data?.session?.user) {
          session.value = data.session
          user.value = data.session.user
          const name = data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0]
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
            name,
            email: data.session.user.email,
            id: data.session.user.id
          }))
        }
      }
    } catch (err) {
      console.warn('[useAuth] Supabase session check:', err)
    }

    try {
      if (supabase && typeof supabase.auth?.onAuthStateChange === 'function') {
        supabase.auth.onAuthStateChange((_event, newSession) => {
          if (newSession?.user) {
            session.value = newSession
            user.value = newSession.user
          }
        })
      }
    } catch (e) {}
  }

  // Masuk menggunakan Email & Kata Sandi
  const signInWithEmail = async (email, password) => {
    loading.value = true
    authError.value = null

    const normalizedEmail = (email || '').trim().toLowerCase()
    const rawPassword = password || ''

    if (!normalizedEmail || !rawPassword) {
      loading.value = false
      authError.value = 'Email dan kata sandi wajib diisi.'
      return { success: false, error: authError.value }
    }

    try {
      let loggedInUser = null
      let loggedInSession = null

      // 1. Coba verifikasi dengan Supabase Auth jika online
      if (supabase && typeof supabase.auth?.signInWithPassword === 'function') {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password: rawPassword
          })
          if (!error && data?.user) {
            loggedInUser = data.user
            loggedInSession = data.session
          }
        } catch (sbErr) {
          console.warn('[useAuth] Supabase signIn attempt:', sbErr)
        }
      }

      // 2. Jika Supabase belum mengonfirmasi, cek dari daftar akun lokal yang pernah terdaftar
      const accounts = getStoredAccounts()
      const localAcc = accounts[normalizedEmail]

      if (!loggedInUser && localAcc) {
        if (localAcc.password === rawPassword) {
          loggedInUser = {
            id: localAcc.id,
            email: localAcc.email,
            name: localAcc.name,
            user_metadata: { name: localAcc.name }
          }
          loggedInSession = { user: loggedInUser }
        } else {
          // Email ditemukan di database, tapi kata sandinya salah!
          loading.value = false
          authError.value = 'Kata sandi yang Anda masukkan salah. Silakan periksa kembali.'
          return { success: false, error: authError.value }
        }
      }

      // 3. JIKA AKUN TIDAK DITEMUKAN (TIDAK PERNAH REGISTRASI)
      // JANGAN PERNAH LOGINKAN USER PALSU SECARA OTOMATIS!
      if (!loggedInUser) {
        loading.value = false
        authError.value = 'Akun belum terdaftar. Silakan periksa kembali email Anda atau klik "Daftar" untuk membuat akun baru terlebih dahulu.'
        return { success: false, error: authError.value }
      }

      // 4. Kredensial valid: set user aktif
      user.value = loggedInUser
      session.value = loggedInSession

      const finalName = loggedInUser.user_metadata?.name || loggedInUser.name || normalizedEmail.split('@')[0]
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        name: finalName,
        email: loggedInUser.email,
        id: loggedInUser.id
      }))

      return { success: true, data: { user: loggedInUser, session: loggedInSession } }
    } catch (err) {
      authError.value = err.message || 'Gagal masuk. Silakan periksa email dan kata sandi Anda.'
      return { success: false, error: authError.value }
    } finally {
      loading.value = false
    }
  }

  // Daftar akun baru
  const signUpWithEmail = async (email, password, displayName = '') => {
    loading.value = true
    authError.value = null

    const normalizedEmail = (email || '').trim().toLowerCase()
    const rawPassword = password || ''
    const resolvedName = (displayName || '').trim() || normalizedEmail.split('@')[0]

    if (!normalizedEmail || !rawPassword) {
      loading.value = false
      authError.value = 'Email dan kata sandi wajib diisi.'
      return { success: false, error: authError.value }
    }

    if (rawPassword.length < 6) {
      loading.value = false
      authError.value = 'Kata sandi minimal harus 6 karakter.'
      return { success: false, error: authError.value }
    }

    try {
      const accounts = getStoredAccounts()

      // Cek apakah email sudah terdaftar sebelumnya
      if (accounts[normalizedEmail]) {
        loading.value = false
        authError.value = 'Email ini sudah terdaftar. Silakan langsung masuk dengan akun Anda.'
        return { success: false, error: authError.value }
      }

      let registeredUser = null
      let registeredSession = null

      // 1. Coba daftarkan ke Supabase
      if (supabase && typeof supabase.auth?.signUp === 'function') {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: normalizedEmail,
            password: rawPassword,
            options: {
              data: { name: resolvedName }
            }
          })
          if (error) {
            if (error.message && error.message.toLowerCase().includes('already registered')) {
              loading.value = false
              authError.value = 'Email ini sudah terdaftar di sistem. Silakan langsung masuk.'
              return { success: false, error: authError.value }
            }
          } else if (data?.user) {
            registeredUser = data.user
            registeredSession = data.session
          }
        } catch (sbErr) {
          console.warn('[useAuth] Supabase signup exception:', sbErr)
        }
      }

      // 2. Buat ID akun jika belum ada dari Supabase
      const newUserId = registeredUser?.id || 'usr_' + Date.now()
      registeredUser = {
        id: newUserId,
        email: normalizedEmail,
        name: resolvedName,
        user_metadata: { name: resolvedName }
      }
      registeredSession = registeredSession || { user: registeredUser }

      // 3. Simpan akun ke database akun lokal terdaftar
      accounts[normalizedEmail] = {
        id: newUserId,
        email: normalizedEmail,
        password: rawPassword,
        name: resolvedName,
        createdAt: new Date().toISOString()
      }
      saveStoredAccounts(accounts)

      // 4. Loginkan pengguna yang baru terdaftar
      user.value = registeredUser
      session.value = registeredSession

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        name: resolvedName,
        email: normalizedEmail,
        id: newUserId
      }))

      return { success: true, data: { user: registeredUser, session: registeredSession } }
    } catch (err) {
      authError.value = err.message || 'Gagal mendaftar. Silakan coba beberapa saat lagi.'
      return { success: false, error: authError.value }
    } finally {
      loading.value = false
    }
  }

  // Reset kata sandi lokal (jika user menggunakan modal Lupa Kata Sandi)
  const resetPassword = (email, newPassword) => {
    const normalizedEmail = (email || '').trim().toLowerCase()
    const accounts = getStoredAccounts()
    if (accounts[normalizedEmail]) {
      accounts[normalizedEmail].password = newPassword
      saveStoredAccounts(accounts)
      return true
    }
    return false
  }

  // Masuk dengan Google OAuth
  const signInWithGoogle = async () => {
    loading.value = true
    authError.value = null
    try {
      if (supabase && typeof supabase.auth?.signInWithOAuth === 'function') {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        })
        if (error) throw error
        return { success: true, data }
      }
      return { success: true }
    } catch (err) {
      authError.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Keluar dari akun
  const signOut = async () => {
    loading.value = true
    try {
      if (supabase && typeof supabase.auth?.signOut === 'function') {
        await supabase.auth.signOut().catch(() => {})
      }
      user.value = null
      session.value = null
      localStorage.removeItem(CURRENT_USER_KEY)
    } catch (err) {
      console.error('[useAuth] Gagal keluar:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    session,
    loading,
    authError,
    isAuthenticated: computed(() => !!user.value),
    userEmail: computed(() => user.value?.email || ''),
    userName: computed(() => user.value?.user_metadata?.name || user.value?.name || "Warga PilahKi'"),
    initAuth,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signInWithGoogle,
    signOut
  }
}
