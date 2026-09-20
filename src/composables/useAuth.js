import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

const CURRENT_USER_KEY = 'pilahki_user'

// Bersihkan data akun plaintext lokal lama demi keamanan
try {
  localStorage.removeItem('pilahki_registered_accounts')
} catch {}

function getInitialUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && (parsed.email || parsed.id)) {
        return {
          id: parsed.id || 'usr_' + Date.now(),
          email: parsed.email || '',
          name: parsed.name || parsed.user_metadata?.name || "Warga PilahKi'",
          user_metadata: { name: parsed.name || parsed.user_metadata?.name || "Warga PilahKi'" }
        }
      }
    }
  } catch (e) {
    console.warn('[useAuth] Error parsing initial user session:', e)
  }
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
            const name = newSession.user.user_metadata?.name || newSession.user.email?.split('@')[0]
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
              name,
              email: newSession.user.email,
              id: newSession.user.id
            }))
          } else if (_event === 'SIGNED_OUT') {
            session.value = null
            user.value = null
            localStorage.removeItem(CURRENT_USER_KEY)
          }
        })
      }
    } catch (e) {}
  }

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
      if (!supabase) {
        throw new Error('Koneksi Supabase belum terkonfigurasi.')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: rawPassword
      })

      if (error) {
        let msg = error.message
        if (msg?.toLowerCase().includes('invalid login credentials')) {
          msg = 'Email atau kata sandi yang Anda masukkan salah.'
        }
        authError.value = msg
        return { success: false, error: msg }
      }

      user.value = data.user
      session.value = data.session

      const finalName = data.user?.user_metadata?.name || normalizedEmail.split('@')[0]
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        name: finalName,
        email: data.user?.email,
        id: data.user?.id
      }))

      return { success: true, data }
    } catch (err) {
      authError.value = err.message || 'Gagal masuk. Silakan periksa email dan kata sandi Anda.'
      return { success: false, error: authError.value }
    } finally {
      loading.value = false
    }
  }

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
      if (!supabase) {
        throw new Error('Koneksi Supabase belum terkonfigurasi.')
      }

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: rawPassword,
        options: {
          data: { name: resolvedName }
        }
      })

      if (error) {
        console.error('[useAuth] Supabase signup error:', error)
        let msg = error.message
        if (msg && msg.toLowerCase().includes('already registered')) {
          msg = 'Email ini sudah terdaftar di sistem. Silakan langsung masuk.'
        } else if (error.status === 429 || (msg && msg.toLowerCase().includes('rate limit'))) {
          msg = 'Batas pengiriman email tercapai. Silakan coba beberapa saat lagi.'
        }
        authError.value = msg
        return { success: false, error: msg }
      }

      user.value = data.user
      session.value = data.session

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        name: resolvedName,
        email: normalizedEmail,
        id: data.user?.id
      }))

      return { success: true, data }
    } catch (err) {
      authError.value = err.message || 'Gagal mendaftar. Silakan coba beberapa saat lagi.'
      return { success: false, error: authError.value }
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email) => {
    const normalizedEmail = (email || '').trim().toLowerCase()
    if (!normalizedEmail) return false
    try {
      if (supabase && typeof supabase.auth?.resetPasswordForEmail === 'function') {
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail)
        return !error
      }
    } catch {}
    return false
  }

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

  const signOut = async () => {
    loading.value = true
    try {
      if (supabase && typeof supabase.auth?.signOut === 'function') {
        await supabase.auth.signOut().catch(() => {})
      }
      user.value = null
      session.value = null
      localStorage.removeItem(CURRENT_USER_KEY)
      localStorage.removeItem('pilahki_chat_session_id')
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
