import { supabase } from '@/lib/supabase'

const CURRENT_SESSION_KEY = 'pilahki_chat_session_id'
const LOCAL_SESSIONS_LIST_KEY = 'pilahki_known_session_ids'

/**
 * Simpan ID sesi ke daftar lokal untuk isolasi sesi guest
 */
function saveLocalSessionId(sessionId) {
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_LIST_KEY)
    const list = raw ? JSON.parse(raw) : []
    if (!list.includes(sessionId)) {
      list.unshift(sessionId)
      localStorage.setItem(LOCAL_SESSIONS_LIST_KEY, JSON.stringify(list.slice(0, 50)))
    }
  } catch {}
}

/**
 * Hapus ID sesi dari daftar lokal
 */
function removeLocalSessionId(sessionId) {
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_LIST_KEY)
    const list = raw ? JSON.parse(raw) : []
    const updated = list.filter(id => id !== sessionId)
    localStorage.setItem(LOCAL_SESSIONS_LIST_KEY, JSON.stringify(updated))
  } catch {}
}

/**
 * Ambil daftar ID sesi lokal
 */
function getLocalSessionIds() {
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_LIST_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Dapatkan atau buat Session ID aktif
 */
export function getOrCreateSessionId() {
  try {
    let sessionId = localStorage.getItem(CURRENT_SESSION_KEY)
    if (!sessionId) {
      sessionId = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
      localStorage.setItem(CURRENT_SESSION_KEY, sessionId)
      saveLocalSessionId(sessionId)
    }
    return sessionId
  } catch {
    return 'fallback_session_' + Date.now()
  }
}

/**
 * Buat sesi obrolan baru (+ Percakapan Baru)
 */
export function startNewSession() {
  try {
    const newId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
    localStorage.setItem(CURRENT_SESSION_KEY, newId)
    saveLocalSessionId(newId)
    return newId
  } catch {
    return 'sess_' + Date.now()
  }
}

/**
 * Set sesi aktif
 */
export function setActiveSessionId(sessionId) {
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, sessionId)
    saveLocalSessionId(sessionId)
  } catch {}
}

/**
 * Muat daftar semua sesi percakapan dari Supabase
 */
export async function fetchUserSessions(userId = null) {
  if (!supabase) return { data: [], error: 'Supabase tidak terhubung' }

  try {
    let query = supabase
      .from('chat_messages')
      .select('id, session_id, role, content, created_at')
      .order('created_at', { ascending: true })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.warn('[chatService] Gagal memuat daftar sesi dari Supabase:', error.message)
      return { data: [], error }
    }

    // Kelompokkan pesan berdasarkan session_id
    const sessionsMap = new Map()
    for (const msg of (data || [])) {
      if (!sessionsMap.has(msg.session_id)) {
        sessionsMap.set(msg.session_id, {
          id: msg.session_id,
          title: msg.role === 'user' ? truncateText(msg.content, 40) : 'Obrolan Pilahki',
          createdAt: msg.created_at,
          updatedAt: msg.created_at,
          lastMessage: msg.content,
          messagesCount: 1
        })
      } else {
        const sess = sessionsMap.get(msg.session_id)
        sess.updatedAt = msg.created_at
        sess.lastMessage = msg.content
        sess.messagesCount += 1
        if ((!sess.title || sess.title === 'Obrolan Pilahki') && msg.role === 'user') {
          sess.title = truncateText(msg.content, 40)
        }
      }
    }

    let list = Array.from(sessionsMap.values())

    // Jika guest, filter dengan ID lokal yang pernah dibuat
    if (!userId) {
      const localIds = getLocalSessionIds()
      if (localIds.length > 0) {
        list = list.filter(s => localIds.includes(s.id))
      }
    }

    // Urutkan berdasarkan waktu pesan terbaru
    list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

    return { data: list, error: null }
  } catch (err) {
    console.error('[chatService] Error fetchUserSessions:', err)
    return { data: [], error: err }
  }
}

/**
 * Muat pesan spesifik untuk satu session_id tertentu dari Supabase
 */
export async function fetchChatMessages(sessionId) {
  if (!supabase || !sessionId) return { data: [], error: null }

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) {
      console.warn('[chatService] Tidak dapat memuat pesan sesi dari Supabase:', error.message)
      return { data: [], error }
    }

    const mapped = (data || []).map(row => ({
      id: row.id,
      role: row.role,
      text: row.content,
      toolUsed: row.tool_used || null,
      toolData: row.tool_data || null,
      time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: row.created_at
    }))

    return { data: mapped, error: null }
  } catch (err) {
    console.error('[chatService] Error fetchChatMessages:', err)
    return { data: [], error: err }
  }
}

/**
 * Simpan pesan tunggal ke dalam tabel chat_messages di Supabase
 */
export async function saveChatMessage({
  sessionId,
  userId = null,
  role,
  content,
  toolUsed = null,
  toolData = null
}) {
  if (!supabase) return { data: null, error: 'Supabase client tidak tersedia' }

  try {
    saveLocalSessionId(sessionId)

    const payload = {
      session_id: sessionId,
      user_id: userId || null,
      role,
      content,
      tool_used: toolUsed || null,
      tool_data: toolData || null
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.warn('[chatService] Gagal menyimpan pesan ke Supabase:', error.message)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('[chatService] Gagal memproses penyimpanan pesan:', err)
    return { data: null, error: err }
  }
}

/**
 * Hapus seluruh pesan dalam satu session_id dari Supabase
 */
export async function deleteSession(sessionId) {
  if (!supabase || !sessionId) return { success: false }

  try {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('session_id', sessionId)

    removeLocalSessionId(sessionId)

    if (error) {
      console.warn('[chatService] Gagal menghapus sesi di Supabase:', error.message)
      return { success: false, error }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error('[chatService] Error deleteSession:', err)
    return { success: false, error: err }
  }
}

function truncateText(str, maxLen = 35) {
  if (!str) return 'Percakapan'
  const clean = str.replace(/\n/g, ' ').trim()
  return clean.length > maxLen ? clean.slice(0, maxLen) + '...' : clean
}
