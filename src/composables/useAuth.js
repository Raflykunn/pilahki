import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

const user = ref(null)
const session = ref(null)
const loading = ref(true)
const authError = ref(null)

// Inisialisasi status sesi secara global
let isInitialized = false

export function useAuth() {
  const initAuth = async () => {
    if (isInitialized) return
    isInitialized = true
    loading.value = true

    try {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      user.value = data.session?.user || null
    } catch (err) {
      console.error('[useAuth] Ralat memuat sesi:', err)
      authError.value = err.message
    } finally {
      loading.value = false
    }

    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user || null
      loading.value = false
    })
  }

  // Log masuk menggunakan Email & Kata Laluan
  const signInWithEmail = async (email, password) => {
    loading.value = true
    authError.value = null
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      user.value = data.user
      session.value = data.session
      return { success: true, data }
    } catch (err) {
      authError.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Daftar akaun baharu menggunakan Email & Kata Laluan
  const signUpWithEmail = async (email, password) => {
    loading.value = true
    authError.value = null
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) throw error
      user.value = data.user
      session.value = data.session
      return { success: true, data }
    } catch (err) {
      authError.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Log masuk dengan Google (OAuth Supabase)
  const signInWithGoogle = async () => {
    loading.value = true
    authError.value = null
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
      return { success: true, data }
    } catch (err) {
      authError.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Log keluar
  const signOut = async () => {
    loading.value = true
    try {
      await supabase.auth.signOut()
      user.value = null
      session.value = null
    } catch (err) {
      console.error('[useAuth] Ralat log keluar:', err)
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
    initAuth,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut
  }
}
