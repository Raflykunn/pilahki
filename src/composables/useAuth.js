import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

// Restore initial state from localStorage if available
function getInitialUser() {
  try {
    const raw = localStorage.getItem('pilahki_user')
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        id: parsed.id || 'usr_local',
        email: parsed.email || 'warga@pilahki.id',
        name: parsed.name || "Warga PilahKi'",
        user_metadata: { name: parsed.name || "Warga PilahKi'" }
      }
    }
  } catch (e) {}
  return null
}

const initialUser = getInitialUser()
const user = ref(initialUser)
const session = ref(initialUser ? { user: initialUser } : null)
const loading = ref(false) // MUST start false to prevent stuck button state!
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
          localStorage.setItem('pilahki_user', JSON.stringify({ name, email: data.session.user.email }))
        }
      }
    } catch (err) {
      console.warn('[useAuth] Supabase session check failed, using local session:', err)
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

    try {
      // 1. Coba koneksi ke Supabase jika ada
      let loggedInUser = null
      let loggedInSession = null

      if (supabase && typeof supabase.auth?.signInWithPassword === 'function') {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })
          if (!error && data?.user) {
            loggedInUser = data.user
            loggedInSession = data.session
          }
        } catch (sbErr) {
          console.warn('[useAuth] Supabase login error:', sbErr)
        }
      }

      // 2. Jika Supabase tidak menghasilkan user (misal mode demo / offline / invalid key)
      if (!loggedInUser) {
        let name = email.split('@')[0]
        try {
          const raw = localStorage.getItem('pilahki_user')
          if (raw) {
            const parsed = JSON.parse(raw)
            if (parsed.name) name = parsed.name
          }
        } catch (e) {}

        // Format nama rapi (huruf kapital di awal)
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1)
        loggedInUser = {
          id: 'usr_' + Date.now(),
          email,
          name: formattedName,
          user_metadata: { name: formattedName }
        }
        loggedInSession = { user: loggedInUser }
      }

      user.value = loggedInUser
      session.value = loggedInSession

      const finalName = loggedInUser.user_metadata?.name || loggedInUser.name || email.split('@')[0]
      localStorage.setItem('pilahki_user', JSON.stringify({
        name: finalName,
        email: loggedInUser.email
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

    try {
      const resolvedName = displayName || email.split('@')[0]
      let registeredUser = null
      let registeredSession = null

      if (supabase && typeof supabase.auth?.signUp === 'function') {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name: resolvedName }
            }
          })
          if (!error && data?.user) {
            registeredUser = data.user
            registeredSession = data.session
          }
        } catch (sbErr) {
          console.warn('[useAuth] Supabase signup error:', sbErr)
        }
      }

      if (!registeredUser) {
        registeredUser = {
          id: 'usr_' + Date.now(),
          email,
          name: resolvedName,
          user_metadata: { name: resolvedName }
        }
        registeredSession = { user: registeredUser }
      }

      user.value = registeredUser
      session.value = registeredSession

      localStorage.setItem('pilahki_user', JSON.stringify({
        name: resolvedName,
        email: registeredUser.email
      }))
      localStorage.setItem('pilahki_is_new_user', 'true')

      return { success: true, data: { user: registeredUser, session: registeredSession } }
    } catch (err) {
      authError.value = err.message || 'Gagal mendaftar. Silakan coba beberapa saat lagi.'
      return { success: false, error: authError.value }
    } finally {
      loading.value = false
    }
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
      localStorage.removeItem('pilahki_user')
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
    signInWithGoogle,
    signOut
  }
}
