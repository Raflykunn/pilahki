<script setup>
import { ref, onMounted, onUnmounted, nextTick, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { sendChatMessageToPilahAI } from '../services/geminiService'
import { useAuth } from '../composables/useAuth'
import AuthModal from '../components/AuthModal.vue'

const emit = defineEmits(['navigate'])

// Router & Route
const instance = getCurrentInstance()
let router = null
let route = null
if (instance?.appContext?.config?.globalProperties?.$router) {
  router = instance.appContext.config.globalProperties.$router
  route = instance.appContext.config.globalProperties.$route
} else {
  try {
    router = useRouter()
    route = useRoute()
  } catch {
    router = null
    route = null
  }
}

const navigateTo = (path) => {
  emit('navigate', { path })
  if (router) {
    router.push(path).catch(() => {})
  }
}

// Auth State
const { isAuthenticated, userEmail, initAuth, signOut } = useAuth()
const userMenuRef = ref(null)
const isProfileDropdownOpen = ref(false)
const isAuthModalOpen = ref(false)

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

const handleClickOutside = (e) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    isProfileDropdownOpen.value = false
  }
}

// State Chat
const messages = ref([
  {
    id: 'm-1',
    role: 'model',
    text: 'Halo! Saya **PilahAI**, asisten cerdas Pilahki. Anda bisa menanyakan kategori sampah, mencari bank sampah/TPS terdekat, mengecek jadwal angkut wilayah, atau membaca tips pemilahan harian. Ada sampah yang sedang membingungkan Anda hari ini?',
    time: 'Baru saja'
  }
])

const userInput = ref('')
const isLoading = ref(false)
const chatScrollRef = ref(null)

// Auto-scroll ke bawah
const scrollToBottom = async () => {
  await nextTick()
  if (chatScrollRef.value) {
    chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight
  }
}

onMounted(() => {
  initAuth()
  document.addEventListener('click', handleClickOutside)

  // Semak jika ada soalan dari rute query ?q=...
  const queryParam = route?.query?.q
  if (queryParam && typeof queryParam === 'string') {
    userInput.value = queryParam
    handleSendMessage()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Hantar Mesej
const handleSendMessage = async (customText = null) => {
  const textToSend = (customText !== null ? customText : userInput.value).trim()
  if (!textToSend || isLoading.value) return

  const userMsgId = 'u-' + Date.now()
  messages.value.push({
    id: userMsgId,
    role: 'user',
    text: textToSend,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })

  userInput.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    const aiResponse = await sendChatMessageToPilahAI(messages.value)
    messages.value.push({
      id: 'ai-' + Date.now(),
      role: 'model',
      text: aiResponse.text || 'Terima kasih atas pertanyaannya.',
      toolUsed: aiResponse.toolUsed || null,
      toolData: aiResponse.toolData || null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  } catch (err) {
    messages.value.push({
      id: 'ai-err-' + Date.now(),
      role: 'model',
      text: 'Mohon maaf, terjadi gangguan sesaat pada sistem. Silakan tanyakan kembali atau buka menu navigasi manual di atas.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

// Reset Chat
const handleClearChat = () => {
  messages.value = [
    {
      id: 'm-init',
      role: 'model',
      text: 'Percakapan telah direset. Silakan tanyakan apa saja seputar pemilahan dan pengelolaan sampah rumah tangga!',
      time: 'Baru saja'
    }
  ]
}

// Prompt Cadangan Pantas
const samplePrompts = [
  'Baterai bekas harus diapakan dan dibawa ke mana?',
  'Kapan jadwal angkut sampah organik di Sukajadi?',
  'Bank sampah terdekat yang terima minyak jelantah',
  'Gimana cara mencuci botol plastik berminyak?'
]

// Format teks markdown ringkas (bold, italic, konversi tabel ke daftar rapi, line-break)
const formatMarkdown = (text) => {
  if (!text) return ''

  // 1. Jika ada format tabel markdown (| col 1 | col 2 |), ubah jadi daftar poin rapi
  const lines = text.split('\n')
  const cleanLines = []
  let isInsideTable = false
  let tableHeaders = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      // Abaikan baris pembatas seperti | :--- | :--- |
      if (/^\|[\s:-|]+\|$/.test(trimmed)) {
        continue
      }
      const rawCells = trimmed.split('|')
      const cells = rawCells.slice(1, rawCells.length - 1).map(c => c.trim())

      if (!isInsideTable) {
        tableHeaders = cells
        isInsideTable = true
      } else {
        // Baris data: ubah menjadi format kartu daftar ringkas
        if (cells.length >= 2) {
          const mainTitle = cells[0]
          const otherDetails = cells.slice(1).map((val, idx) => {
            const h = tableHeaders[idx + 1] ? `• ${tableHeaders[idx + 1]}: ` : '• '
            return `${h}${val}`
          }).join('\n')
          cleanLines.push(`**${mainTitle}**\n${otherDetails}\n`)
        } else if (cells.length === 1) {
          cleanLines.push(`• ${cells[0]}`)
        }
      }
    } else {
      isInsideTable = false
      tableHeaders = []
      cleanLines.push(line)
    }
  }

  let processed = cleanLines.join('\n')

  // Escape HTML dasar
  let res = processed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // bold: **teks**
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // italic: *teks*
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>')
  // line breaks
  res = res.replace(/\n/g, '<br />')

  return res
}
</script>

<template>
  <div class="pilahai-page">
    <!-- Navbar Ringkas -->
    <header class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <a href="/" class="brand-logo" @click.prevent="navigateTo('/')">
            <svg class="brand-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 7v10"/>
              <path d="m8 11 4-4 4 4"/>
            </svg>
            <span class="brand-text">
              <span class="brand-name">Pilahki</span>
              <span class="brand-tagline">PilahAI Chatbot</span>
            </span>
          </a>
        </div>

        <div class="nav-center-status">
          <span class="ai-status-indicator">
            <span class="status-dot"></span>
            PilahAI Aktif (Gemini Powered)
          </span>
        </div>

        <div class="nav-right">
          <button type="button" class="nav-link-btn" @click="navigateTo('/pilah')">
            <span>Pilah Sampah</span>
          </button>
          <button type="button" class="nav-link-btn" @click="navigateTo('/lokasi')">
            <span>Cari Lokasi</span>
          </button>
          <button type="button" class="nav-link-btn" @click="navigateTo('/jadwal')">
            <span>Jadwal</span>
          </button>

          <button type="button" class="back-home-btn" @click="navigateTo('/')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-svg">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Beranda</span>
          </button>

          <!-- Dropdown Akaun Jika Log Masuk -->
          <div v-if="isAuthenticated" ref="userMenuRef" class="user-menu-wrapper">
            <button
              type="button"
              class="user-account-btn"
              :class="{ 'user-account-active': isProfileDropdownOpen }"
              aria-label="Menu akun pengguna"
              @click="toggleProfileDropdown"
            >
              <span class="user-avatar-circle">
                {{ userEmail ? userEmail.charAt(0).toUpperCase() : 'U' }}
              </span>
              <span class="user-display-name">
                {{ userEmail ? userEmail.split('@')[0] : 'Akun' }}
              </span>
            </button>

            <div v-show="isProfileDropdownOpen" class="user-dropdown-card">
              <div class="dropdown-user-header">
                <strong>{{ userEmail }}</strong>
              </div>
              <div class="dropdown-divider"></div>
              <button type="button" class="dropdown-item dropdown-item-danger" @click="signOut">
                Keluar
              </button>
            </div>
          </div>
          <button v-else type="button" class="login-nav-btn" @click="isAuthModalOpen = true">
            Masuk
          </button>
        </div>
      </div>
    </header>

    <main class="chat-main-container">
      <!-- Header Info Singkat -->
      <section class="chat-header-banner">
        <div class="bot-profile-badge">
          <div class="bot-avatar-large" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="avatar-large-svg">
              <rect x="3" y="11" width="18" height="10" rx="2"/>
              <circle cx="12" cy="5" r="2"/>
              <path d="M12 7v4"/>
              <line x1="8" y1="16" x2="8.01" y2="16"/>
              <line x1="16" y1="16" x2="16.01" y2="16"/>
            </svg>
          </div>
          <div>
            <h1 class="chat-title">Tanya PilahAI</h1>
            <p class="chat-desc">
              Pusat percakapan cerdas yang terintegrasi langsung dengan 4 fitur Pilahki: Kategori Sampah, Cari Lokasi, Jadwal Angkut, dan Panduan.
            </p>
          </div>
        </div>
        <button type="button" class="clear-chat-btn" @click="handleClearChat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="clear-btn-svg">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          <span>Bersihkan Chat</span>
        </button>
      </section>

      <!-- Kotak Percakapan (Message Thread) -->
      <div class="chat-box-card">
        <div ref="chatScrollRef" class="messages-scroll-area">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message-row"
            :class="msg.role === 'user' ? 'message-user' : 'message-ai'"
          >
            <!-- Avatar -->
            <div class="msg-avatar" :class="msg.role === 'user' ? 'msg-avatar-user' : 'msg-avatar-ai'" aria-hidden="true">
              <svg v-if="msg.role === 'user'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="msg-avatar-svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="msg-avatar-svg">
                <rect x="3" y="11" width="18" height="10" rx="2"/>
                <circle cx="12" cy="5" r="2"/>
                <path d="M12 7v4"/>
                <line x1="8" y1="16" x2="8.01" y2="16"/>
                <line x1="16" y1="16" x2="16.01" y2="16"/>
              </svg>
            </div>

            <!-- Bubble Teks -->
            <div class="msg-bubble-wrap">
              <!-- Label Pengirim & Masa -->
              <div class="msg-meta">
                <span class="msg-sender">{{ msg.role === 'user' ? 'Anda' : 'PilahAI' }}</span>
                <span class="msg-time">{{ msg.time }}</span>
              </div>

              <!-- Tool Badge Jika Function Calling Dipanggil -->
              <div v-if="msg.toolUsed" class="tool-badge-pill">
                <span class="tool-badge-dot"></span>
                <span v-if="msg.toolUsed === 'cekKategoriSampah'">Database Kategori Sampah</span>
                <span v-else-if="msg.toolUsed === 'cariFasilitas'">Database Fasilitas &amp; Bank Sampah</span>
                <span v-else-if="msg.toolUsed === 'cekJadwal'">Database Jadwal Angkut Wilayah</span>
                <span v-else-if="msg.toolUsed === 'cariPanduan'">Modul Panduan Praktis</span>
              </div>

              <!-- Teks Kandungan (dengan Markdown Formatting) -->
              <div class="msg-content-text" v-html="formatMarkdown(msg.text)"></div>

              <!-- Shortcut Akses Langsung ke Fitur Terkait -->
              <div v-if="msg.toolUsed" class="tool-action-bar">
                <button
                  v-if="msg.toolUsed === 'cekKategoriSampah'"
                  type="button"
                  class="tool-shortcut-btn"
                  @click="navigateTo('/pilah')"
                >
                  <span>Buka Fitur Pilah Sampah</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
                <button
                  v-else-if="msg.toolUsed === 'cariFasilitas'"
                  type="button"
                  class="tool-shortcut-btn"
                  @click="navigateTo('/lokasi')"
                >
                  <span>Buka Peta &amp; Lokasi Bank Sampah</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
                <button
                  v-else-if="msg.toolUsed === 'cekJadwal'"
                  type="button"
                  class="tool-shortcut-btn"
                  @click="navigateTo('/jadwal')"
                >
                  <span>Lihat Jadwal Wilayah Lengkap</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
                <button
                  v-else-if="msg.toolUsed === 'cariPanduan'"
                  type="button"
                  class="tool-shortcut-btn"
                  @click="navigateTo('/panduan')"
                >
                  <span>Buka Panduan Edukasi Lengkap</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isLoading" class="message-row message-ai">
            <div class="msg-avatar msg-avatar-ai" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="msg-avatar-svg">
                <rect x="3" y="11" width="18" height="10" rx="2"/>
                <circle cx="12" cy="5" r="2"/>
                <path d="M12 7v4"/>
                <line x1="8" y1="16" x2="8.01" y2="16"/>
                <line x1="16" y1="16" x2="16.01" y2="16"/>
              </svg>
            </div>
            <div class="msg-bubble-wrap">
              <div class="typing-indicator">
                <span>PilahAI sedang mencari data dan mengetik...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Prompt Cadangan (Quick Suggestions) -->
        <div class="suggestions-bar">
          <span class="sugg-label">Coba tanyakan:</span>
          <div class="sugg-chips-wrap">
            <button
              v-for="prompt in samplePrompts"
              :key="prompt"
              type="button"
              class="sugg-chip-btn"
              :disabled="isLoading"
              @click="handleSendMessage(prompt)"
            >
              {{ prompt }}
            </button>
          </div>
        </div>

        <!-- Input Bar Interaktif -->
        <form class="chat-input-bar" @submit.prevent="handleSendMessage()">
          <input
            v-model="userInput"
            type="text"
            class="chat-text-input"
            placeholder="Ketik pertanyaan Anda (misal: 'Baterai bekas buang ke mana?' atau 'Jadwal di Coblong')..."
            aria-label="Ketik pertanyaan ke PilahAI"
            :disabled="isLoading"
          />
          <button
            type="submit"
            class="send-msg-btn"
            :disabled="isLoading || !userInput.trim()"
            aria-label="Kirim pesan"
          >
            <span>Kirim</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="send-icon">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </main>

    <!-- Footer Ringkas -->
    <footer class="page-footer">
      <div class="footer-container">
        <p>© 2024 Pilahki — Titik Akses Tunggal Percakapan Pemilahan Sampah (SDG 11 & SDG 13).</p>
      </div>
    </footer>

    <!-- Auth Modal jika Tetamu ingin log masuk -->
    <AuthModal
      :is-open="isAuthModalOpen"
      title="Masuk ke Pilahki"
      subtitle="Masuk untuk menyimpan riwayat percakapan Anda."
      @close="isAuthModalOpen = false"
    />
  </div>
</template>

<style scoped>
/* ==========================================================================
   Design Tokens & CSS PilahAiView
   ========================================================================== */
.pilahai-page {
  --pk-primary: #15803d;
  --pk-primary-hover: #166534;
  --pk-primary-light: #f0fdf4;
  --pk-primary-border: #bbf7d0;
  --pk-text-main: #0f172a;
  --pk-text-muted: #475569;
  --pk-text-subtle: #64748b;
  --pk-bg: #fafaf9;
  --pk-surface: #ffffff;
  --pk-border: #e2e8f0;
  --pk-border-subtle: #f1f5f9;
  --pk-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --pk-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
  --pk-radius-sm: 6px;
  --pk-radius-md: 10px;
  --pk-radius-lg: 14px;
  --pk-radius-full: 9999px;

  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--pk-text-main);
  background-color: var(--pk-bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  line-height: 1.5;
  text-align: left;
}

.pilahai-page *,
.pilahai-page *::before,
.pilahai-page *::after {
  box-sizing: inherit;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--pk-border);
}

.nav-content {
  max-width: 1140px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}

.brand-svg {
  width: 26px;
  height: 26px;
  color: var(--pk-primary);
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--pk-primary);
  line-height: 1.1;
}

.brand-tagline {
  font-size: 0.72rem;
  color: var(--pk-text-subtle);
  font-weight: 500;
}

.nav-center-status {
  display: flex;
  align-items: center;
}

.ai-status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #166534;
  background-color: #dcfce7;
  padding: 4px 10px;
  border-radius: var(--pk-radius-full);
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #16a34a;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.3);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-link-btn {
  background: none;
  border: none;
  color: var(--pk-text-muted);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: var(--pk-radius-sm);
  transition: color 0.15s;
}

.nav-link-btn:hover {
  color: var(--pk-primary);
}

.back-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid var(--pk-border);
  color: var(--pk-text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: var(--pk-radius-sm);
  cursor: pointer;
  transition: all 0.15s;
}

.back-home-btn:hover {
  background-color: var(--pk-border-subtle);
  color: var(--pk-text-main);
}

.btn-svg {
  width: 16px;
  height: 16px;
}

.login-nav-btn {
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: var(--pk-radius-sm);
  cursor: pointer;
}

/* User Menu */
.user-menu-wrapper {
  position: relative;
}

.user-account-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-full);
  padding: 4px 10px 4px 4px;
  cursor: pointer;
}

.user-avatar-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: var(--pk-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.user-display-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--pk-text-main);
}

.user-dropdown-card {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 180px;
  background-color: #ffffff;
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-md);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  padding: 8px;
  z-index: 50;
}

.dropdown-user-header {
  padding: 4px 8px;
  font-size: 0.8rem;
  color: var(--pk-text-muted);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--pk-border);
  margin: 6px 0;
}

.dropdown-item {
  width: 100%;
  padding: 6px 8px;
  border: none;
  background: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 4px;
  text-align: left;
}

.dropdown-item-danger {
  color: #dc2626;
}

.dropdown-item-danger:hover {
  background-color: #fef2f2;
}

/* ==========================================================================
   Chat Layout
   ========================================================================== */
.chat-main-container {
  max-width: 920px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;
}

.bot-profile-badge {
  display: flex;
  align-items: center;
  gap: 14px;
}

.bot-avatar-large {
  width: 48px;
  height: 48px;
  background-color: var(--pk-primary-light);
  border: 1px solid var(--pk-primary-border);
  border-radius: var(--pk-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-large-svg {
  width: 26px;
  height: 26px;
  color: var(--pk-primary);
}

.chat-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--pk-text-main);
  margin: 0 0 2px;
}

.chat-desc {
  font-size: 0.85rem;
  color: var(--pk-text-muted);
  margin: 0;
  max-width: 620px;
}

.clear-chat-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid var(--pk-border);
  padding: 6px 12px;
  border-radius: var(--pk-radius-sm);
  font-size: 0.82rem;
  color: var(--pk-text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.clear-btn-svg {
  width: 14px;
  height: 14px;
}

.clear-chat-btn:hover {
  background-color: var(--pk-border-subtle);
  color: var(--pk-text-main);
}

/* Chat Box Card */
.chat-box-card {
  background-color: var(--pk-surface);
  border: 1px solid var(--pk-border);
  border-radius: var(--pk-radius-lg);
  box-shadow: var(--pk-shadow-sm);
  display: flex;
  flex-direction: column;
  height: 620px;
  overflow: hidden;
}

.messages-scroll-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Message Rows */
.message-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 85%;
}

.message-ai {
  align-self: flex-start;
}

.message-user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 34px;
  height: 34px;
  border-radius: var(--pk-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: var(--pk-border-subtle);
}

.msg-avatar-svg {
  width: 18px;
  height: 18px;
}

.message-ai .msg-avatar {
  background-color: var(--pk-primary-light);
  border: 1px solid var(--pk-primary-border);
}

.message-ai .msg-avatar-svg {
  color: var(--pk-primary);
}

.message-user .msg-avatar {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
}

.message-user .msg-avatar-svg {
  color: #2563eb;
}

.msg-bubble-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.msg-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  color: var(--pk-text-subtle);
}

.message-user .msg-meta {
  justify-content: flex-end;
}

.msg-sender {
  font-weight: 700;
}

.tool-badge-pill {
  font-size: 0.72rem;
  font-weight: 600;
  color: #166534;
  background-color: #dcfce7;
  border: 1px solid #bbf7d0;
  padding: 3px 9px;
  border-radius: var(--pk-radius-full);
  margin-bottom: 6px;
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tool-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #16a34a;
}

.tool-action-bar {
  margin-top: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tool-shortcut-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--pk-primary);
  background-color: #ffffff;
  border: 1px solid var(--pk-primary-border);
  border-radius: var(--pk-radius-sm);
  padding: 5px 11px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.tool-shortcut-btn:hover {
  background-color: var(--pk-primary-light);
  border-color: var(--pk-primary);
  transform: translateY(-1px);
}

.msg-content-text {
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 0.92rem;
  line-height: 1.55;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.message-ai .msg-content-text {
  background-color: #f8fafc;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-top-left-radius: 2px;
}

.message-user .msg-content-text {
  background-color: var(--pk-primary);
  color: #ffffff;
  border-top-right-radius: 2px;
}

.typing-indicator {
  padding: 12px 16px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.85rem;
  color: var(--pk-text-muted);
  font-style: italic;
}

/* Suggestions Bar */
.suggestions-bar {
  padding: 10px 18px;
  background-color: #f8fafc;
  border-top: 1px solid var(--pk-border-subtle);
  border-bottom: 1px solid var(--pk-border-subtle);
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
}

.sugg-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--pk-text-subtle);
  white-space: nowrap;
}

.sugg-chips-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.sugg-chip-btn {
  background-color: #ffffff;
  border: 1px solid var(--pk-border);
  color: var(--pk-text-muted);
  font-size: 0.76rem;
  padding: 4px 10px;
  border-radius: var(--pk-radius-full);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.sugg-chip-btn:hover:not(:disabled) {
  border-color: var(--pk-primary);
  color: var(--pk-primary);
  background-color: var(--pk-primary-light);
}

/* Input Bar */
.chat-input-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 10px;
  background-color: #ffffff;
}

.chat-text-input {
  flex: 1;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: var(--pk-radius-md);
  font-size: 0.92rem;
  color: var(--pk-text-main);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.chat-text-input:focus {
  border-color: var(--pk-primary);
  box-shadow: 0 0 0 3px var(--pk-primary-border);
}

.send-msg-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: var(--pk-primary);
  color: #ffffff;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 12px 18px;
  border-radius: var(--pk-radius-md);
  cursor: pointer;
  transition: background-color 0.15s;
}

.send-msg-btn:hover:not(:disabled) {
  background-color: var(--pk-primary-hover);
}

.send-msg-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.send-icon {
  width: 16px;
  height: 16px;
}

/* Footer */
.page-footer {
  background-color: #ffffff;
  border-top: 1px solid var(--pk-border);
  padding: 20px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--pk-text-subtle);
}

/* Responsif Mobile */
@media (max-width: 768px) {
  .nav-center-status {
    display: none;
  }

  .chat-box-card {
    height: calc(100vh - 210px);
    min-height: 480px;
  }

  .message-row {
    max-width: 95%;
  }

  .chat-header-banner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
