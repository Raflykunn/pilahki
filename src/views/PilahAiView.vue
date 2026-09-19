<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { sendChatMessageToPilahAI } from '@/services/geminiService'
import {
  startNewSession,
  setActiveSessionId,
  fetchUserSessions,
  fetchChatMessages,
  saveChatMessage,
  deleteSession
} from '@/services/chatService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Send,
  Trash2,
  Loader2,
  Bot,
  Database,
  Plus,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  Clock,
  ChevronRight,
  HelpCircle,
  X
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { user, isAuthenticated, initAuth } = useAuth()

// Template Pesan Awal Bersih
const defaultWelcomeMessage = {
  id: 'm-default-welcome',
  role: 'model',
  text: 'Halo! Saya **PilahAI**, asisten cerdas Pilahki. Anda bisa menanyakan kategori sampah (Organik, Anorganik, B3, Residu), mencari bank sampah/TPS terdekat di Makassar, mengecek jadwal angkut wilayah, atau panduan pengolahan. Ada yang bisa saya bantu hari ini?',
  time: 'Baru saja'
}

const sessionId = ref('')
const sessionsList = ref([])
const isSidebarOpen = ref(true)
const isMobileSidebarOpen = ref(false)
const isLoadingSessions = ref(false)

const messages = ref([defaultWelcomeMessage])
const userInput = ref('')
const isLoading = ref(false)
const isFetchingHistory = ref(false)
const chatScrollRef = ref(null)

const samplePrompts = [
  'Baterai bekas harus diapakan dan dibawa ke mana?',
  'Kapan jadwal angkut sampah organik di Tamalanrea?',
  'Bank sampah terdekat yang terima kardus & botol plastik',
  'Gimana cara mencuci botol plastik minyak sebelum disetor?'
]

const scrollToBottom = async () => {
  await nextTick()
  if (chatScrollRef.value) {
    chatScrollRef.value.scrollTop = chatScrollRef.value.scrollHeight
  }
}

// Muat daftar sesi obrolan yang tersimpan di Supabase untuk sidebar
const loadSessionsList = async () => {
  isLoadingSessions.value = true
  try {
    const { data } = await fetchUserSessions(user.value?.id)
    sessionsList.value = data || []
  } catch (err) {
    console.warn('[PilahAI] Gagal memuat daftar sesi:', err)
  } finally {
    isLoadingSessions.value = false
  }
}

// Pilih dan muat obrolan lama dari sidebar riwayat
const selectSession = async (id) => {
  if (sessionId.value === id && messages.value.length > 1) {
    isMobileSidebarOpen.value = false
    return
  }

  sessionId.value = id
  setActiveSessionId(id)
  isMobileSidebarOpen.value = false
  isFetchingHistory.value = true

  try {
    const { data } = await fetchChatMessages(id)
    if (data && data.length > 0) {
      messages.value = data
    } else {
      messages.value = [defaultWelcomeMessage]
    }
  } catch (err) {
    console.warn('[PilahAI] Gagal memuat pesan sesi:', err)
  } finally {
    isFetchingHistory.value = false
    await scrollToBottom()
  }
}

// Mulai percakapan baru (bersihkan layar chat, buat sesi baru)
const handleStartNewChat = () => {
  const newId = startNewSession()
  sessionId.value = newId
  messages.value = [
    {
      id: 'm-new-' + Date.now(),
      role: 'model',
      text: 'Halo! Sesi percakapan baru telah dimulai. Silakan ajukan pertanyaan seputar pemilahan dan pengelolaan sampah di Kota Makassar.',
      time: 'Baru saja'
    }
  ]
  isMobileSidebarOpen.value = false
  userInput.value = ''
  scrollToBottom()
}

// Hapus satu sesi dari Supabase
const handleDeleteSession = async (id, event) => {
  if (event) event.stopPropagation()

  if (confirm('Hapus riwayat obrolan ini dari Supabase?')) {
    await deleteSession(id)
    sessionsList.value = sessionsList.value.filter(s => s.id !== id)

    // Jika sesi yang dihapus adalah yang sedang dibuka, reset ke chat baru
    if (sessionId.value === id) {
      handleStartNewChat()
    }
  }
}

// Inisialisasi: Setiap kali halaman PilahAI dibuka kembali, SELALU buat obrolan baru
onMounted(async () => {
  await initAuth()

  // 1. Mulai sesi obrolan baru otomatis (seperti ChatGPT / Claude)
  handleStartNewChat()

  // 2. Muat seluruh riwayat lama ke sidebar agar pengguna tetap bisa membukanya
  await loadSessionsList()

  // 3. Jika ada query parameter ?q=... (misal dari pencarian beranda atau katalog sampah)
  const queryParam = route?.query?.q
  if (queryParam && typeof queryParam === 'string') {
    userInput.value = queryParam
    handleSendMessage()
  }

  await scrollToBottom()
})

// Pantau jika user berpindah rute atau mengklik tombol PilahAI lagi dengan parameter query baru
watch(
  () => route.query.q,
  (newQ) => {
    if (newQ && typeof newQ === 'string' && route.path === '/pilah-ai') {
      handleStartNewChat()
      userInput.value = newQ
      handleSendMessage()
    }
  }
)

// Pantau perubahan user login
watch(() => user.value?.id, async () => {
  await loadSessionsList()
})

const handleSendMessage = async (customText = null) => {
  const textToSend = (customText !== null ? customText : userInput.value).trim()
  if (!textToSend || isLoading.value) return

  const userMsgId = 'u-' + Date.now()
  const userMsg = {
    id: userMsgId,
    role: 'user',
    text: textToSend,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  messages.value.push(userMsg)
  userInput.value = ''
  isLoading.value = true
  await scrollToBottom()

  // 1. Simpan pesan user ke Supabase
  saveChatMessage({
    sessionId: sessionId.value,
    userId: user.value?.id || null,
    role: 'user',
    content: textToSend
  }).then(() => {
    // Perbarui sidebar riwayat agar sesi baru langsung muncul
    loadSessionsList()
  }).catch(e => console.warn('[PilahAI] Gagal simpan pesan user:', e))

  try {
    // 2. Kirim ke Gemini API
    const aiResponse = await sendChatMessageToPilahAI(messages.value)
    const botText = aiResponse.text || 'Terima kasih atas pertanyaannya.'
    const toolUsed = aiResponse.toolUsed || null
    const toolData = aiResponse.toolData || null

    const botMsg = {
      id: 'ai-' + Date.now(),
      role: 'model',
      text: botText,
      toolUsed,
      toolData,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    messages.value.push(botMsg)

    // 3. Simpan respons bot ke Supabase
    saveChatMessage({
      sessionId: sessionId.value,
      userId: user.value?.id || null,
      role: 'model',
      content: botText,
      toolUsed,
      toolData
    }).then(() => {
      loadSessionsList()
    }).catch(e => console.warn('[PilahAI] Gagal simpan respons bot:', e))

  } catch (err) {
    console.error('[PilahAI] Error chat:', err)
    messages.value.push({
      id: 'ai-err-' + Date.now(),
      role: 'model',
      text: 'Mohon maaf, terjadi kendala saat memproses jawaban. Silakan coba sesaat lagi.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

const formatRelativeTime = (isoString) => {
  if (!isoString) return ''
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} mnt lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    if (diffDays === 1) return 'Kemarin'
    if (diffDays < 7) return `${diffDays} hari lalu`
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' })
  } catch {
    return ''
  }
}

const formatMarkdown = (text) => {
  if (!text) return ''
  let res = text
  // Bersihkan tanda strip panjang em-dash agar bahasa mengalir natural tanpa kesan kaku AI
  res = res.replace(/—/g, ', ').replace(/–/g, ' - ')
  res = res.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>')
  res = res.replace(/\n/g, '<br />')
  return res
}
</script>

<template>
  <div class="h-[calc(100vh-4rem)] flex bg-zinc-50/60 overflow-hidden relative">
    <!-- ========================================================================= -->
    <!-- 1. SIDEBAR RIWAYAT CHAT (DESKTOP & DRAWER MOBILE) -->
    <!-- ========================================================================= -->
    <aside
      :class="[
        'border-r border-zinc-200/80 bg-white flex flex-col transition-all duration-300 z-30 shrink-0',
        // Desktop
        isSidebarOpen ? 'hidden md:flex md:w-72 lg:w-80' : 'hidden',
        // Mobile Drawer
        isMobileSidebarOpen ? 'fixed inset-y-0 left-0 w-80 shadow-2xl flex md:hidden' : 'hidden md:flex'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="p-3.5 border-b border-zinc-100 flex items-center justify-between gap-2">
        <Button
          class="flex-1 justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs text-xs font-semibold h-9"
          @click="handleStartNewChat"
        >
          <Plus class="h-4 w-4" />
          <span>Obrolan Baru</span>
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          class="text-zinc-500 hover:text-zinc-900 md:hidden"
          @click="isMobileSidebarOpen = false"
          aria-label="Tutup Riwayat"
        >
          <X class="h-4 w-4" />
        </Button>
      </div>

      <!-- Riwayat Obrolan List -->
      <div class="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-none">
        <div class="px-2 py-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          <span>Riwayat Obrolan</span>
          <span v-if="sessionsList.length" class="text-zinc-500">({{ sessionsList.length }})</span>
        </div>

        <!-- Loading state -->
        <div v-if="isLoadingSessions" class="flex items-center justify-center gap-2 py-8 text-xs text-zinc-400">
          <Loader2 class="h-4 w-4 animate-spin text-emerald-600" />
          <span>Memuat riwayat...</span>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="sessionsList.length === 0"
          class="rounded-xl border border-dashed border-zinc-200 p-6 text-center text-xs text-zinc-400 space-y-2"
        >
          <MessageSquare class="mx-auto h-6 w-6 text-zinc-300" />
          <p>Belum ada riwayat tersimpan.</p>
          <p class="text-[10px] text-zinc-400">Tanyakan sesuatu dan obrolan Anda akan otomatis tersimpan di Supabase!</p>
        </div>

        <!-- Session Item Cards -->
        <div
          v-for="sess in sessionsList"
          :key="sess.id"
          :class="[
            'group relative flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs transition-all cursor-pointer select-none',
            sessionId === sess.id
              ? 'bg-emerald-50/90 text-emerald-900 font-semibold border border-emerald-200/80 shadow-2xs'
              : 'text-zinc-700 hover:bg-zinc-100/80 border border-transparent'
          ]"
          @click="selectSession(sess.id)"
        >
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <MessageSquare
              class="h-3.5 w-3.5 shrink-0"
              :class="sessionId === sess.id ? 'text-emerald-600' : 'text-zinc-400 group-hover:text-zinc-600'"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs leading-tight" :title="sess.title">
                {{ sess.title }}
              </p>
              <span class="text-[10px] text-zinc-400 font-normal">
                {{ formatRelativeTime(sess.updatedAt) }}
              </span>
            </div>
          </div>

          <!-- Tombol Hapus Sesi -->
          <button
            type="button"
            class="opacity-0 group-hover:opacity-100 rounded p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer shrink-0"
            title="Hapus riwayat obrolan ini"
            @click.stop="handleDeleteSession(sess.id, $event)"
          >
            <Trash2 class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <!-- Sidebar Footer Status -->
      <div class="p-3 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-[11px] text-zinc-500">
        <span class="flex items-center gap-1.5 font-medium text-emerald-800">
          <Database class="h-3 w-3 text-emerald-600" />
          <span>Supabase Sync</span>
        </span>
        <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
      </div>
    </aside>

    <!-- Mobile Backdrop -->
    <div
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 z-20 bg-black/40 backdrop-blur-2xs md:hidden"
      @click="isMobileSidebarOpen = false"
    />

    <!-- ========================================================================= -->
    <!-- 2. AREA UTAMA CHAT (HEADER, THREAD, INPUT) -->
    <!-- ========================================================================= -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Chat Header Sub-bar -->
      <div class="border-b border-zinc-200/80 bg-white px-4 py-3 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
        <div class="flex items-center gap-3">
          <!-- Toggle Sidebar Button (Desktop & Mobile) -->
          <Button
            variant="outline"
            size="icon-sm"
            class="border-zinc-200 text-zinc-600 hover:bg-zinc-100 hidden md:flex"
            :title="isSidebarOpen ? 'Sembunyikan Riwayat' : 'Buka Riwayat'"
            @click="isSidebarOpen = !isSidebarOpen"
          >
            <PanelLeftClose v-if="isSidebarOpen" class="h-4 w-4" />
            <PanelLeft v-else class="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            class="border-zinc-200 text-zinc-600 hover:bg-zinc-100 md:hidden gap-1.5 text-xs px-2.5"
            @click="isMobileSidebarOpen = true"
          >
            <MessageSquare class="h-3.5 w-3.5 text-emerald-600" />
            <span>Riwayat ({{ sessionsList.length }})</span>
          </Button>

          <!-- Bot Avatar & Info -->
          <div class="flex items-center gap-2.5">
            <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-xs">
              <Bot class="h-4 w-4" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-sm font-bold text-zinc-900 leading-tight">PilahAI</h2>
                <Badge variant="organik" class="text-[10px] uppercase font-bold py-0">
                  Gemini
                </Badge>
              </div>
              <p class="text-[11px] text-zinc-400 hidden sm:block">
                Asisten pemilahan sampah, fasilitas & jadwal Makassar
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- New Chat Action -->
          <Button
            variant="outline"
            size="sm"
            class="text-xs gap-1.5 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hidden sm:flex"
            @click="handleStartNewChat"
          >
            <Plus class="h-3.5 w-3.5" />
            <span>Obrolan Baru</span>
          </Button>

          <!-- Clear Current Chat -->
          <Button
            variant="ghost"
            size="sm"
            class="text-xs text-zinc-500 hover:text-red-600 hover:bg-red-50 gap-1.5"
            @click="handleDeleteSession(sessionId)"
            title="Hapus obrolan ini"
          >
            <Trash2 class="h-3.5 w-3.5" />
            <span class="hidden lg:inline">Hapus Obrolan</span>
          </Button>
        </div>
      </div>

      <!-- Messages Scroll Area -->
      <div ref="chatScrollRef" class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div class="max-w-3xl mx-auto space-y-6">
          <!-- Loader jika sedang mengambil dari Supabase -->
          <div v-if="isFetchingHistory" class="flex items-center justify-center gap-2 text-xs text-zinc-400 py-6">
            <Loader2 class="h-4 w-4 animate-spin text-emerald-600" />
            <span>Memuat pesan dari Supabase...</span>
          </div>

          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'flex gap-3',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            ]"
          >
            <!-- Bot Avatar -->
            <div
              v-if="msg.role === 'model'"
              class="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold mt-1 shadow-2xs"
            >
              AI
            </div>

            <!-- Bubble Content -->
            <div class="max-w-[85%] sm:max-w-[78%] space-y-2">
              <div class="flex items-center gap-2 px-1 text-[11px] text-zinc-400 font-medium">
                <span>{{ msg.role === 'user' ? (isAuthenticated ? (user?.email?.split('@')[0] || 'Anda') : 'Anda') : 'PilahAI' }}</span>
                <span>&bull;</span>
                <span>{{ msg.time }}</span>
              </div>

              <!-- Card Tool Calling jika ada -->
              <div
                v-if="msg.toolUsed"
                class="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-emerald-900 space-y-2 shadow-2xs"
              >
                <div class="flex items-center gap-1.5 font-bold text-emerald-800 uppercase tracking-wider text-[10px]">
                  <Sparkles class="h-3.5 w-3.5 text-emerald-600" />
                  <span>Terhubung ke Data Pilahki ({{ msg.toolUsed }})</span>
                </div>

                <div v-if="msg.toolData" class="space-y-1.5 text-zinc-700 bg-white/90 rounded-lg p-2.5 border border-emerald-200/60">
                  <div v-if="msg.toolData.nama" class="flex items-center gap-2 font-bold text-zinc-900">
                    <span>{{ msg.toolData.nama }}</span>
                    <Badge variant="outline" class="text-[10px] uppercase font-semibold">
                      {{ msg.toolData.kategori || 'Info' }}
                    </Badge>
                  </div>
                  <p v-if="msg.toolData.penanganan" class="text-[11px] text-zinc-600">
                    <strong>Penanganan:</strong> {{ msg.toolData.penanganan }}
                  </p>
                  <p v-if="msg.toolData.tujuanPenyaluran" class="text-[11px] text-zinc-600">
                    <strong>Penyaluran:</strong> {{ msg.toolData.tujuanPenyaluran }}
                  </p>
                </div>
              </div>

              <!-- Main Message Bubble -->
              <div
                :class="[
                  'rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs',
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white text-zinc-900 border border-zinc-200/80 rounded-tl-none'
                ]"
              >
                <div v-html="formatMarkdown(msg.text)" class="prose prose-sm max-w-none break-words" />
              </div>
            </div>

            <!-- User Avatar -->
            <div
              v-if="msg.role === 'user'"
              class="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-zinc-900 text-white text-xs font-bold mt-1 shadow-2xs"
            >
              U
            </div>
          </div>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="flex items-center gap-3 justify-start">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold shadow-2xs">
              AI
            </div>
            <div class="rounded-2xl rounded-tl-none bg-white border border-zinc-200 px-4 py-3 shadow-2xs flex items-center gap-2 text-xs text-zinc-500">
              <Loader2 class="h-4 w-4 animate-spin text-emerald-600" />
              <span>PilahAI sedang mencari data dan memformulasikan jawaban...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Suggestions & Input Bar Bottom -->
      <div class="border-t border-zinc-200/80 bg-white p-4 sm:p-5 shrink-0">
        <div class="max-w-3xl mx-auto space-y-3">
          <!-- Suggestion Chips -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span class="text-zinc-400 font-medium shrink-0">Saran:</span>
            <button
              v-for="prompt in samplePrompts"
              :key="prompt"
              type="button"
              class="shrink-0 rounded-full bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-zinc-200/60 px-3 py-1 text-zinc-600 transition-colors cursor-pointer"
              @click="handleSendMessage(prompt)"
            >
              {{ prompt }}
            </button>
          </div>

          <!-- Chat Input Form -->
          <form @submit.prevent="handleSendMessage()" class="flex items-center gap-2">
            <Input
              v-model="userInput"
              type="text"
              placeholder="Tanyakan sampah apa saja, jadwal angkut, atau lokasi bank sampah..."
              class="h-11 text-sm bg-zinc-50/50 border-zinc-200 focus:bg-white"
              :disabled="isLoading"
            />
            <Button
              type="submit"
              size="lg"
              class="h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 font-semibold gap-2 shadow-xs"
              :disabled="!userInput.trim() || isLoading"
            >
              <Send class="h-4 w-4" />
              <span class="hidden sm:inline">Kirim</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
