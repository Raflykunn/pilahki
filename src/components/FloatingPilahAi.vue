<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDomicile } from '@/composables/useDomicile'
import { sendMessageToGemini, cleanDashes } from '@/services/geminiService'
import {
  Bot,
  X,
  Send,
  Sparkles,
  BatteryCharging,
  Truck,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  Award,
  Loader2,
  Lock
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { userEmail, isAuthenticated } = useAuth()
const { domicile } = useDomicile()

const isInAppRoute = computed(() => ['/pilah', '/lokasi', '/jadwal', '/panduan'].some(p => route.path.startsWith(p)))

const isOpen = ref(false)
const inputQuery = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)

const userDistrict = computed(() => domicile.value.district || 'Panakkukang')

const userName = computed(() => {
  try {
    const raw = localStorage.getItem('pilahki_user')
    if (raw) {
      const u = JSON.parse(raw)
      return u.name ? u.name.split(' ')[0] : 'Warga'
    }
  } catch (e) {}
  return userEmail.value ? userEmail.value.split('@')[0] : 'Warga'
})

const getWelcomeMessage = () => ({
  role: 'model',
  text: `Halo <strong>${userName.value}</strong>! Saya <strong>PilahAI</strong>. Domisili Anda terhubung di <strong>Kecamatan ${userDistrict.value}, Makassar</strong>.\n\nTanyakan apa saja tentang pemilahan sampah, jadwal armada angkut hari ini, atau Bank Sampah terdekat!`
})

const messages = ref([getWelcomeMessage()])

const promptChips = computed(() => [
  { text: `Kapan jadwal truk angkut sampah sekarang?`, label: `Jadwal Sekarang`, icon: Truck, color: 'text-teal-600' },
  { text: `Di mana Bank Sampah terdekat dari ${userDistrict.value}?`, label: 'Bank Sampah Terdekat', icon: MapPin, color: 'text-emerald-600' },
  { text: 'Baterai bekas harus diapakan dan disetor ke mana?', label: 'Baterai Bekas B3', icon: BatteryCharging, color: 'text-amber-600' }
])

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    scrollToBottom()
  }
}

const clearChat = () => {
  messages.value = [getWelcomeMessage()]
}

const handleSend = async (customQuery = null) => {
  if (!isAuthenticated.value) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  const query = (customQuery || inputQuery.value).trim()
  if (!query || isLoading.value) return

  inputQuery.value = ''
  messages.value.push({ role: 'user', text: query })
  isLoading.value = true
  scrollToBottom()

  try {
    const reply = await sendMessageToGemini(query)
    messages.value.push({
      role: 'model',
      text: reply.text || reply,
      toolUsed: reply.toolUsed,
      toolData: reply.toolData
    })
  } catch (error) {
    messages.value.push({
      role: 'model',
      text: 'Maaf, terjadi kendala saat menghubungi asisten PilahAI. Pastikan koneksi internet stabil atau coba beberapa saat lagi.'
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const formatBotResponse = (text) => {
  if (!text) return ''
  let html = cleanDashes(text)

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em class="text-slate-600 font-medium">$1</em>')

  const lines = html.split('\n')
  const formatted = lines.map(line => {
    const trimmed = line.trim()
    if (!trimmed) return '<div class="h-2"></div>'

    if (trimmed.startsWith('📅') || trimmed.startsWith('🚚') || trimmed.startsWith('📍') || trimmed.startsWith('💡')) {
      return `<div class="font-bold text-brand-900 text-xs sm:text-sm mt-3 mb-1.5 flex items-center gap-1.5 bg-brand-50/70 border border-brand-100/80 px-2.5 py-1 rounded-lg">${trimmed}</div>`
    }

    if (trimmed.startsWith('•')) {
      const content = trimmed.substring(1).trim()
      return `<div class="flex items-start gap-2 my-1 pl-1 text-slate-700 text-xs sm:text-[13px] leading-relaxed">
        <span class="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0"></span>
        <div class="flex-1">${content}</div>
      </div>`
    }

    if (trimmed.startsWith('-')) {
      const content = trimmed.substring(1).trim()
      return `<div class="flex items-start gap-2 my-0.5 pl-4 text-slate-600 text-[11.5px] sm:text-xs leading-relaxed">
        <span class="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
        <div class="flex-1">${content}</div>
      </div>`
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/)
    if (numMatch) {
      return `<div class="flex items-start gap-2 my-1 pl-1 text-slate-700 text-xs sm:text-[13px] leading-relaxed">
        <span class="w-4 h-4 rounded-md bg-brand-100/70 text-brand-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">${numMatch[1]}</span>
        <div class="flex-1">${numMatch[2]}</div>
      </div>`
    }

    return `<p class="my-1 text-slate-700 text-xs sm:text-[13px] leading-relaxed">${trimmed}</p>`
  })

  return formatted.join('')
}

defineExpose({
  openWithQuery: (q) => {
    if (!isAuthenticated.value) {
      router.push({ path: '/login', query: { redirect: route.fullPath } })
      return
    }
    isOpen.value = true
    handleSend(q)
  }
})
</script>

<template>
  <div
    v-if="route.path !== '/pilah-ai'"
    :class="[
      'fixed z-50 flex flex-col items-end pointer-events-none transition-all duration-300',
      isInAppRoute
        ? 'bottom-24 md:bottom-6 right-4 sm:right-6'
        : 'bottom-4 sm:bottom-6 right-4 sm:right-6'
    ]"
  >
    
    <div
      v-if="isOpen"
      id="pilahai-chat-window"
      :class="[
        'mb-3 w-[calc(100vw-2rem)] sm:w-[440px] h-[520px] sm:h-[560px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 pointer-events-auto',
        isInAppRoute
          ? 'max-h-[calc(100dvh-11.5rem)] sm:max-h-[80vh]'
          : 'max-h-[calc(100dvh-6.5rem)] sm:max-h-[80vh]'
      ]"
    >
      
      <div class="bg-gradient-to-r from-brand-900 via-brand-800 to-[#0b2216] text-white px-5 py-4 flex items-center justify-between shadow-xs shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-xs">
            <Bot class="w-5 h-5 text-accent-light" />
          </div>
          <div>
            <h3 class="text-sm font-bold leading-tight tracking-tight">PilahAI Companion</h3>
            <div class="flex items-center gap-1.5 text-[11px] text-emerald-200 font-medium mt-0.5">
              <template v-if="isAuthenticated">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Terhubung ke Kec. {{ userDistrict }}</span>
              </template>
              <template v-else>
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span class="text-amber-200 font-semibold">Akses Terbatas</span>
              </template>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1.5">
          <button 
            v-if="isAuthenticated"
            type="button" 
            @click="clearChat"
            class="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Bersihkan Percakapan"
          >
            Reset
          </button>
          <button 
            type="button" 
            @click="isOpen = false"
            class="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Tutup Chat"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div v-if="!isAuthenticated" class="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/70">
        <div class="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-xs">
          <Lock class="w-7 h-7" />
        </div>
        <div class="space-y-1.5 max-w-xs">
          <h4 class="text-base font-bold text-slate-900">Akses Khusus Warga Terdaftar</h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            Asisten cerdas PilahAI hanya dapat diakses oleh warga yang telah masuk ke akun PilahKi' agar rekomendasi pemilahan dan jadwal angkut disesuaikan dengan domisili Anda.
          </p>
        </div>
        <div class="w-full pt-2 flex flex-col gap-2 max-w-xs">
          <router-link
            :to="{ path: '/login', query: { redirect: route.fullPath } }"
            class="w-full py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition-all text-center cursor-pointer"
            @click="isOpen = false"
          >
            Masuk
          </router-link>
          <router-link
            :to="{ path: '/register', query: { redirect: route.fullPath } }"
            class="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition-all text-center cursor-pointer"
            @click="isOpen = false"
          >
            Daftar
          </router-link>
        </div>
      </div>

      <template v-else>
        
        <div ref="messagesContainer" class="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70">
          <div 
            v-for="(msg, i) in messages" 
            :key="i"
            class="flex items-start gap-2.5"
            :class="msg.role === 'user' ? 'justify-end' : ''"
          >
            
            <div
              v-if="msg.role === 'model'"
              class="w-7 h-7 rounded-xl bg-brand-800 text-white flex items-center justify-center shrink-0 shadow-2xs mt-1"
            >
              <Bot class="w-4 h-4 text-accent-light" />
            </div>

            <div
              :class="[
                'max-w-[88%] rounded-2xl shadow-xs transition-all',
                msg.role === 'user'
                  ? 'bg-brand-800 text-white rounded-tr-xs px-4 py-3 text-xs sm:text-[13px] font-medium leading-relaxed'
                  : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs p-3.5 sm:p-4'
              ]"
            >
              
              <div
                v-if="msg.toolUsed === 'cekJadwal' && msg.toolData"
                class="mb-3 rounded-2xl border border-brand-100 bg-brand-50/50 p-3.5 space-y-2.5 text-left"
              >
                <div class="flex items-center justify-between pb-2 border-b border-brand-100">
                  <div class="flex items-center gap-1.5 text-xs font-extrabold text-brand-900">
                    <Calendar class="w-4 h-4 text-brand-600" />
                    <span>Jadwal {{ msg.toolData.kecamatan }}</span>
                  </div>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-brand-800 border border-brand-200/70">
                    {{ msg.toolData.hariIni }}
                  </span>
                </div>

                <div v-if="msg.toolData.jadwalHariIni" class="bg-white rounded-xl p-2.5 border border-brand-100 shadow-2xs space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Hari Ini</span>
                    <span
                      :class="[
                        'px-2 py-0.5 rounded-full text-[9.5px] font-bold',
                        msg.toolData.jadwalHariIni.status === 'Ada Penjemputan'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : (msg.toolData.jadwalHariIni.status.includes('Bank Sampah')
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200')
                      ]"
                    >
                      {{ msg.toolData.jadwalHariIni.status }}
                    </span>
                  </div>
                  <p class="text-xs font-bold text-slate-900 flex items-center gap-1.5 pt-0.5">
                    <Truck class="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>{{ msg.toolData.jadwalHariIni.kategoriSampah || msg.toolData.jadwalHariIni.category }}</span>
                  </p>
                  <p class="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock class="w-3 h-3 text-slate-400" />
                    <span>{{ msg.toolData.jadwalHariIni.waktu || msg.toolData.jadwalHariIni.time }}</span>
                  </p>
                </div>

                <div v-if="msg.toolData.penjemputanTerdekat" class="bg-white/90 rounded-xl p-2.5 border border-slate-200/70 text-[11px] space-y-0.5">
                  <div class="flex items-center justify-between text-slate-700">
                    <span class="font-bold flex items-center gap-1 text-brand-900">
                      <ArrowRight class="w-3 h-3 text-brand-600" />
                      Berikutnya: {{ msg.toolData.penjemputanTerdekat.hari }}
                    </span>
                    <span class="font-bold text-slate-600">{{ msg.toolData.penjemputanTerdekat.waktu }}</span>
                  </div>
                  <p class="text-[10.5px] text-slate-500 truncate">{{ msg.toolData.penjemputanTerdekat.kategoriSampah }}</p>
                </div>
              </div>

              <div
                v-else-if="msg.toolUsed === 'cariFasilitas' && msg.toolData?.fasilitas?.length"
                class="mb-3 rounded-2xl border border-teal-100 bg-teal-50/40 p-3 space-y-2 text-left"
              >
                <div class="flex items-center justify-between pb-1.5 border-b border-teal-100">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                    <MapPin class="w-3.5 h-3.5 text-teal-600" />
                    <span>Bank Sampah / TPS Terdekat</span>
                  </div>
                  <span class="text-[10px] text-teal-700 font-semibold">Kec. {{ userDistrict }}</span>
                </div>
                <div
                  v-for="(fac, fIdx) in msg.toolData.fasilitas.slice(0, 2)"
                  :key="fIdx"
                  class="bg-white rounded-xl p-2.5 border border-teal-100 shadow-2xs space-y-1"
                >
                  <div class="flex items-center justify-between gap-1">
                    <h4 class="text-xs font-bold text-slate-900 truncate">{{ fac.nama }}</h4>
                    <span class="text-[9.5px] px-1.5 py-0.5 rounded-md font-bold bg-teal-50 text-teal-800 shrink-0">{{ fac.jenis }}</span>
                  </div>
                  <p class="text-[11px] text-slate-500 truncate">{{ fac.alamat }}</p>
                  <p class="text-[10.5px] text-slate-600 flex items-center gap-1">
                    <Clock class="w-3 h-3 text-slate-400" />
                    <span>{{ fac.jamBuka }}</span>
                  </p>
                </div>
              </div>

              <div
                v-else-if="msg.toolUsed === 'cekKategoriSampah' && msg.toolData?.nama"
                class="mb-3 rounded-2xl border border-brand-100 bg-brand-50/50 p-3 space-y-2 text-left"
              >
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold text-slate-900">{{ msg.toolData.nama }}</span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase',
                      msg.toolData.kategori?.toLowerCase() === 'organik' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      msg.toolData.kategori?.toLowerCase() === 'anorganik' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      msg.toolData.kategori?.toLowerCase() === 'b3' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    ]"
                  >
                    {{ msg.toolData.kategori }}
                  </span>
                </div>
                <div v-if="msg.toolData.nilaiEkonomis" class="text-[11px] text-slate-700 bg-white rounded-lg p-2 border border-brand-100/70 flex items-center gap-1.5">
                  <Award class="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>{{ msg.toolData.nilaiEkonomis }}</span>
                </div>
              </div>

              <div
                v-if="msg.role === 'model'"
                class="space-y-1 text-left"
                v-html="formatBotResponse(msg.text)"
              ></div>
              <div v-else>
                {{ msg.text }}
              </div>
            </div>
          </div>

          <div v-if="isLoading" class="flex items-start gap-2.5">
            <div class="w-7 h-7 rounded-xl bg-brand-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Bot class="w-4 h-4 text-accent-light" />
            </div>
            <div class="bg-white border border-slate-200/80 px-4 py-3 rounded-2xl rounded-tl-xs shadow-2xs">
              <div class="flex items-center gap-1.5 py-0.5">
                <span class="w-2 h-2 rounded-full bg-brand-600 animate-bounce"></span>
                <span class="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
          <button
            v-for="chip in promptChips"
            :key="chip.label"
            type="button"
            @click="handleSend(chip.text)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-brand-50 hover:text-brand-800 text-slate-700 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            <component :is="chip.icon" class="w-3.5 h-3.5" :class="chip.color" />
            <span>{{ chip.label }}</span>
          </button>
        </div>

        <form @submit.prevent="handleSend()" class="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0">
          <input 
            v-model="inputQuery"
            type="text" 
            placeholder="Tanya PilahAI seputar sampah Makassar..." 
            class="flex-1 px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 placeholder:text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
            :disabled="isLoading"
          />
          <button 
            type="submit" 
            :disabled="isLoading || !inputQuery.trim()"
            class="w-11 h-11 rounded-xl bg-brand-800 hover:bg-brand-700 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Send class="w-4 h-4" />
          </button>
        </form>
      </template>
    </div>

    <button 
      type="button" 
      id="btn-toggle-pilahai"
      @click="toggleChat"
      class="w-14 h-14 sm:w-auto sm:h-auto p-3 sm:px-5 sm:py-3.5 rounded-2xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-sm shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 group pointer-events-auto"
      :title="isAuthenticated ? 'Buka Chat PilahAI' : 'Masuk untuk Akses PilahAI'"
    >
      <div class="w-7 h-7 sm:w-6 sm:h-6 rounded-lg bg-white/10 flex items-center justify-center">
        <Bot class="w-5 h-5 sm:w-4 sm:h-4 text-accent-light" />
      </div>
      <span class="hidden sm:inline">Tanya PilahAI</span>
      <span v-if="isAuthenticated" class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:inline"></span>
      <Lock v-else class="w-3.5 h-3.5 text-amber-300 hidden sm:inline" />
    </button>
  </div>
</template>
