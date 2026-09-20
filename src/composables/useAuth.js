import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

const ACCOUNTS_KEY = 'pilahki_registered_accounts'
const CURRENT_USER_KEY = 'pilahki_user'

function getStoredAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {}
  return {}
}

function saveStoredAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch (e) {}
}

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
      let loggedInUser = null
      let loggedInSession = null

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
          loading.value = false
          authError.value = 'Kata sandi yang Anda masukkan salah. Silakan periksa kembali.'
          return { success: false, error: authError.value }
        }
      }

      if (!loggedInUser) {
        loading.value = false
        authError.value = 'Akun belum terdaftar. Silakan periksa kembali email Anda atau klik "Daftar" untuk membuat akun baru terlebih dahulu.'
        return { success: false, error: authError.value }
      }

      user.value = loggedInUser
      session.value = loggedInSession

      const finalName = loggedInUser.user_metadata?.name || loggedInUser.name || normalizedEmail.split('@')[0]
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        name: finalName,
        email: loggedInUser.email,
        id: loggedInUser.id
      }))

      accounts[normalizedEmail] = {
        id: loggedInUser.id,
        email: normalizedEmail,
        password: rawPassword,
        name: finalName
      }
      saveStoredAccounts(accounts)

      return { success: true, data: { user: loggedInUser, session: loggedInSession } }
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
      const accounts = getStoredAccounts()

      if (accounts[normalizedEmail]) {
        loading.value = false
        authError.value = 'Email ini sudah terdaftar. Silakan langsung masuk dengan akun Anda.'
        return { success: false, error: authError.value }
      }

      let registeredUser = null
      let registeredSession = null

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

      const newUserId = registeredUser?.id || 'usr_' + Date.now()
      registeredUser = {
        id: newUserId,
        email: normalizedEmail,
        name: resolvedName,
        user_metadata: { name: resolvedName }
      }
      registeredSession = registeredSession || { user: registeredUser }

      accounts[normalizedEmail] = {
        id: newUserId,
        email: normalizedEmail,
        password: rawPassword,
        name: resolvedName,
        createdAt: new Date().toISOString()
      }
      saveStoredAccounts(accounts)

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
