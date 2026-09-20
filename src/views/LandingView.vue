<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import {
  HelpCircle,
  MapPinOff,
  Clock,
  Compass,
  CheckCircle,
  ChevronDown
} from 'lucide-vue-next'

const { isAuthenticated } = useAuth()

const activeFaqIndex = ref(null)

const toggleFaq = (index) => {
  activeFaqIndex.value = activeFaqIndex.value === index ? null : index
}

const faqs = [
  {
    q: "Apakah PilahKi' memerlukan instalasi aplikasi di HP?",
    a: "Tidak perlu! PilahKi' berbasis web murni yang responsif. Anda dapat langsung membukanya dari browser Chrome, Safari, atau Firefox di smartphone maupun laptop tanpa membebani memori HP."
  },
  {
    q: "Bagaimana cara kerja chatbot PilahAI?",
    a: "PilahAI menggunakan teknologi LLM Gemini dengan Function Calling. Ketika Anda bertanya, AI secara otomatis mendeteksi kebutuhan data Anda (misal mengecek kategori sampah, mencari Bank Sampah terdekat, atau mencari jadwal angkut) dan memanggil database sistem untuk memberikan respon yang akurat."
  },
  {
    q: "Apakah data lokasi dan jadwal mencakup seluruh Indonesia?",
    a: "Untuk demonstrasi kompetisi lomba saat ini, data difokuskan pada wilayah pemukiman percontohan Kota Makassar. Namun arsitektur sistem dirancang fleksibel agar data wilayah lain dapat ditambahkan dengan mudah melalui panel pengelola."
  },
  {
    q: "Apakah saya harus mendaftar untuk mencoba PilahKi'?",
    a: "Anda dapat melihat informasi umum dan panduan di halaman beranda ini. Namun untuk menikmati semua fitur interaktif lengkap (asisten percakapan cerdas PilahAI, bookmark Bank Sampah, dan filter jadwal), Anda cukup membuat akun gratis melalui tombol Daftar."
  }
]
</script>

<template>
  <div class="relative w-full overflow-hidden bg-[#fafdfa]">
    
    <!-- ================= 1. HERO SECTION ================= -->
    <section id="tentang" class="relative overflow-hidden py-24 sm:py-32 lg:py-40 bg-[#fafdfa]">
      <!-- Background Image & Contrast Overlays -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img 
          src="/img/hero-sampah.jpg" 
          alt="Tumpukan sampah daur ulang" 
          class="w-full h-full object-cover object-right md:object-center opacity-75 lg:opacity-85 filter contrast-105"
        />
        <!-- Horizontal mask: Ensures left side text is 100% readable with smooth fade to the waste pile on right -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#fafdfa] via-[#fafdfa]/95 sm:via-[#fafdfa]/90 lg:via-[#fafdfa]/80 to-[#fafdfa]/60 lg:to-transparent"></div>
        <!-- Vertical edge blend: Seamless transitions from top navbar and into bottom section -->
        <div class="absolute inset-0 bg-gradient-to-b from-[#fafdfa] via-transparent to-[#fafdfa]"></div>
        <!-- Subtle atmospheric eco tint -->
        <div class="absolute inset-0 bg-emerald-950/10 mix-blend-multiply"></div>
      </div>

      <!-- Content (Left-aligned, ample breathing room) -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl text-left space-y-8">
          
          <!-- Headline Tagline -->
          <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-950 leading-[1.15]">
            Mulai dari Pilahan, <br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-800 via-brand-700 to-brand-500">
              Ciptakan Perubahan
            </span>
          </h1>

          <!-- Deskripsi -->
          <p class="text-base sm:text-lg lg:text-xl text-slate-700 max-w-2xl leading-relaxed font-normal">
            Hilangkan keraguan memilah sampah rumah tangga. Cek kategori secara instan, temukan bank sampah terdekat, pantau jadwal angkut, atau tanyakan langsung pada AI.
          </p>

          <!-- CTA Buttons -->
          <div class="pt-2 flex flex-wrap items-center gap-4">
            <router-link
              :to="isAuthenticated ? '/pilah' : '/register'"
              class="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white bg-brand-800 hover:bg-brand-700 shadow-md hover:shadow-lg transition-all duration-200 text-base"
            >
              <span>{{ isAuthenticated ? 'Buka Aplikasi PilahKi' : 'Mulai Pilah Sekarang' }}</span>
            </router-link>
          </div>

        </div>
      </div>
    </section>

    <!-- ================= 2. TANTANGAN / PROBLEM SECTION ================= -->
    <section id="masalah" class="py-16 bg-white border-y border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-3xl mx-auto mb-14">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-brand-950">
            Mengapa Mengelola Sampah Rumah Tangga Masih Terasa Sulit?
          </h2>
          <p class="text-slate-600 text-sm sm:text-base mt-3">
            Sebagian besar warga ingin berpartisipasi menjaga lingkungan, namun sering terbentur oleh 4 kendala utama ini:
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Problem 1 -->
          <div class="p-6 rounded-2xl bg-[#fafdfa] border border-slate-100 hover:border-brand-200 hover:shadow-card-hover transition-all duration-300 text-left">
            <div class="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center mb-4">
              <HelpCircle class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Bingung Memilah</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Tidak tahu kategori sampah (organik, anorganik, B3, atau residu) dan cara penanganan yang aman sebelum dibuang.
            </p>
          </div>

          <!-- Problem 2 -->
          <div class="p-6 rounded-2xl bg-[#fafdfa] border border-slate-100 hover:border-brand-200 hover:shadow-card-hover transition-all duration-300 text-left">
            <div class="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center mb-4">
              <MapPinOff class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Sulit Cari Lokasi</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Tidak mengetahui keberadaan Bank Sampah atau TPS terdekat, jam buka, dan jenis sampah yang mereka terima.
            </p>
          </div>

          <!-- Problem 3 -->
          <div class="p-6 rounded-2xl bg-[#fafdfa] border border-slate-100 hover:border-brand-200 hover:shadow-card-hover transition-all duration-300 text-left">
            <div class="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center mb-4">
              <Clock class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Jadwal Tidak Jelas</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Jadwal truk pengangkut sampah tidak transparan, menyebabkan sampah menumpuk di depan rumah dan berbau.
            </p>
          </div>

          <!-- Problem 4 -->
          <div class="p-6 rounded-2xl bg-[#fafdfa] border border-slate-100 hover:border-brand-200 hover:shadow-card-hover transition-all duration-300 text-left">
            <div class="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center mb-4">
              <Compass class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Bingung Penyaluran</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Setelah dipilah, warga bingung ke mana sampah bernilai harus disalurkan agar tidak kembali tercampur di TPA.
            </p>
          </div>

        </div>

        <!-- Solution Bridge Banner -->
        <div class="mt-12 bg-gradient-to-r from-brand-800 to-brand-700 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
          <div class="space-y-2 text-center md:text-left">
            <span class="text-xs uppercase font-bold tracking-wider text-accent-light">Jawaban Masalah</span>
            <h3 class="text-2xl sm:text-3xl font-extrabold">PilahKi' Hadir Menjawab Semua Masalah Tersebut</h3>
            <p class="text-brand-100 text-sm sm:text-base max-w-2xl">
              Semua kebutuhan informasi pemilahan, fasilitas terdekat, jadwal, dan asisten AI terangkum dalam satu pintu web yang ramah dan mudah diakses siapa saja.
            </p>
          </div>
          <router-link
            :to="isAuthenticated ? '/pilah' : { path: '/login', query: { redirect: '/pilah' } }"
            class="whitespace-nowrap px-6 py-3.5 rounded-xl bg-white text-brand-800 hover:bg-brand-50 font-bold text-sm shadow-md transition-all duration-200 cursor-pointer"
          >
            Coba Fitur
          </router-link>
        </div>

      </div>
    </section>

    <!-- ================= 3. 5 FITUR UTAMA SECTION ================= -->
    <section id="fitur" class="py-24 sm:py-32 bg-[#fafdfa]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-950 tracking-tight">
            5 Fitur Unggulan di Dalam PilahKi'
          </h2>
          <p class="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Dirancang spesifik untuk mendukung warga hidup bersih dan berkelanjutan, mulai dari pemilahan harian hingga bantuan kecerdasan buatan.
          </p>
        </div>

        <!-- Open Features Layout (Editorial - Informational Only) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 lg:gap-x-16 gap-y-12 lg:gap-y-16 text-left">
          
          <!-- Fitur 1: Pilah Sampah -->
          <div class="space-y-3">
            <span class="text-xs font-bold text-brand-600 tracking-wider uppercase">Fitur 01</span>
            <h3 class="text-xl font-bold text-brand-950">
              Pilah Sampah
            </h3>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Kenali kategori sampah rumah tangga dalam hitungan detik. Dapatkan panduan tepat apakah sampah termasuk <strong>Organik, Anorganik, B3, atau Residu</strong> beserta instruksi penanganannya yang aman sebelum dibuang.
            </p>
          </div>

          <!-- Fitur 2: Cari Lokasi -->
          <div class="space-y-3">
            <span class="text-xs font-bold text-brand-600 tracking-wider uppercase">Fitur 02</span>
            <h3 class="text-xl font-bold text-brand-950">
              Cari Lokasi Fasilitas
            </h3>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Temukan Bank Sampah, TPS 3R, dan TPA terdekat dari tempat tinggal Anda lewat GPS atau pemilihan wilayah manual, lengkap dengan jam operasional, petunjuk arah rute, dan jenis sampah yang diterima.
            </p>
          </div>

          <!-- Fitur 3: Jadwal Angkut -->
          <div class="space-y-3">
            <span class="text-xs font-bold text-brand-600 tracking-wider uppercase">Fitur 03</span>
            <h3 class="text-xl font-bold text-brand-950">
              Jadwal Angkut
            </h3>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Pantau jadwal penjemputan sampah rutin di lingkungan RT/RW tempat tinggal Anda. Tidak ada lagi tumpukan sampah berhari-hari di depan rumah karena jadwal pengangkutan yang transparan dan tepat waktu.
            </p>
          </div>

          <!-- Fitur 4: Panduan Edukasi -->
          <div class="space-y-3">
            <span class="text-xs font-bold text-brand-600 tracking-wider uppercase">Fitur 04</span>
            <h3 class="text-xl font-bold text-brand-950">
              Panduan Edukasi Warga
            </h3>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Akses artikel informatif, infografis praktis, dan tips gaya hidup minim sampah (<em>zero waste</em>). Pelajari teknik komposting mandiri dari sisa dapur hingga cara tepat mengisolasi limbah B3.
            </p>
          </div>

          <!-- Fitur 5: PilahAI -->
          <div class="space-y-3">
            <span class="text-xs font-bold text-brand-600 tracking-wider uppercase">Fitur 05</span>
            <h3 class="text-xl font-bold text-brand-950">
              PilahAI Asisten Cerdas
            </h3>
            <p class="text-sm sm:text-base text-slate-600 leading-relaxed">
              Tidak perlu berpindah-pindah menu secara manual. Cukup tanyakan langsung pada chatbot PilahAI yang terintegrasi dengan data pemilahan, fasilitas, dan jadwal di Makassar.
            </p>
          </div>

        </div>

      </div>
    </section>

    <!-- ================= 4. ALIGNMENT DENGAN SDG ================= -->
    <section id="sdg" class="py-20 bg-brand-950 text-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white">
            Komitmen Nyata PilahKi' untuk Keberlanjutan Lingkungan
          </h2>
          <p class="text-slate-300 text-sm sm:text-base mt-3">
            Setiap fitur di dalam platform terhubung langsung dengan target Tujuan Pembangunan Berkelanjutan (SDGs).
          </p>
        </div>

        <div class="max-w-3xl mx-auto text-left">
          <!-- SDG 11 -->
          <div class="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between shadow-glow">
            <div>
              <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-2xl mb-6 border border-emerald-500/30">
                11
              </div>
              <h3 class="text-2xl font-bold mb-3 text-white">Kota & Permukiman Berkelanjutan</h3>
              <p class="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                Fitur <strong>Cari Lokasi</strong>, <strong>Pilah Sampah</strong>, dan <strong>Jadwal Angkut</strong> mempermudah warga mengakses infrastruktur pengolahan sampah kota, mencegah timbulan sampah liar, dan menata sanitasi lingkungan pemukiman Kota Makassar secara terpadu.
              </p>
            </div>
            <div class="pt-5 border-t border-white/10 text-xs sm:text-sm font-medium text-emerald-300 flex items-center gap-2">
              <CheckCircle class="w-5 h-5 shrink-0 text-emerald-400" />
              <span>Mewujudkan kota bersih, sehat, dan permukiman berkelanjutan</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ================= 5. CARA KERJA / WORKFLOW SECTION ================= -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-brand-950">
            3 Langkah Mudah Menggunakan PilahKi'
          </h2>
          <p class="text-slate-600 text-sm sm:text-base mt-3">
            Hanya butuh beberapa menit untuk memulai kebiasaan baik menjaga lingkungan sekitar.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          <!-- Connecting Dashed Line between Step 1, 2, and 3 (Desktop) -->
          <div class="hidden md:block absolute top-14 left-[16.6%] right-[16.6%] border-t-2 border-dashed border-brand-200 z-0" aria-hidden="true"></div>

          <!-- Step 1 -->
          <div class="text-center p-6 space-y-4 relative">
            <div class="relative z-10 w-16 h-16 rounded-full bg-brand-100 text-brand-800 font-extrabold text-2xl mx-auto flex items-center justify-center border-4 border-white shadow-md">
              1
            </div>
            <h3 class="text-xl font-bold text-brand-950">Daftar & Pilih Wilayah</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Buat akun gratis dalam 30 detik dan tentukan domisili tempat tinggalmu agar sistem dapat menampilkan info yang relevan.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="text-center p-6 space-y-4 relative">
            <div class="relative z-10 w-16 h-16 rounded-full bg-brand-500 text-white font-extrabold text-2xl mx-auto flex items-center justify-center border-4 border-white shadow-md">
              2
            </div>
            <h3 class="text-xl font-bold text-brand-950">Kenali & Pilah Sampah</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Gunakan fitur cari kategori sampah untuk mengidentifikasi sampah organik, daur ulang anorganik, residu, maupun limbah B3.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="text-center p-6 space-y-4 relative">
            <div class="relative z-10 w-16 h-16 rounded-full bg-brand-800 text-white font-extrabold text-2xl mx-auto flex items-center justify-center border-4 border-white shadow-md">
              3
            </div>
            <h3 class="text-xl font-bold text-brand-950">Salurkan & Pantau Jadwal</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Kirim sampah ke Bank Sampah terdekat untuk ditukar manfaat atau siapkan di depan rumah saat jadwal angkut tiba.
            </p>
          </div>

        </div>

      </div>
    </section>

    <!-- ================= 6. FAQ SECTION ================= -->
    <section id="faq" class="py-20 bg-[#fafdfa] border-t border-slate-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-2xl mx-auto mb-14">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-brand-950">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p class="text-slate-600 text-sm sm:text-base mt-3">
            Seputar fungsionalitas aplikasi dan cara kerja platform PilahKi'.
          </p>
        </div>

        <div class="space-y-4">
          
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="bg-white border border-slate-200 rounded-2xl p-5 cursor-pointer transition-all hover:border-brand-300 shadow-2xs text-left"
            @click="toggleFaq(index)"
          >
            <div class="flex items-center justify-between font-bold text-brand-950 text-base sm:text-lg">
              <span>{{ faq.q }}</span>
              <ChevronDown 
                class="w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ml-4"
                :class="{ 'rotate-180 text-brand-600': activeFaqIndex === index }"
              />
            </div>
            <div 
              v-show="activeFaqIndex === index"
              class="text-slate-600 text-sm mt-3 pt-3 border-t border-slate-100 leading-relaxed animate-in fade-in duration-150"
            >
              {{ faq.a }}
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- ================= 7. FINAL CALL TO ACTION BANNER ================= -->
    <section class="py-20 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 text-white relative overflow-hidden">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">

        <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Siap Melangkah Menuju Lingkungan yang Lebih Bersih?
        </h2>

        <p class="text-base sm:text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
          Bergabunglah dengan ribuan warga yang telah merasakan kemudahan memilah sampah dari rumah dengan bantuan teknologi cerdas PilahKi'.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <template v-if="!isAuthenticated">
            <router-link
              to="/register"
              class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-brand-900 bg-white hover:bg-brand-50 shadow-lg hover:shadow-glow transition-all text-base"
            >
              Daftar Sekarang
            </router-link>
            <router-link
              to="/login"
              class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-base"
            >
              Masuk Sekarang
            </router-link>
          </template>
          <template v-else>
            <router-link
              to="/pilah"
              class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-brand-900 bg-white hover:bg-brand-50 shadow-lg hover:shadow-glow transition-all text-base"
            >
              Buka Katalog Pilah Sampah
            </router-link>
            <router-link
              to="/pilah-ai"
              class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-all text-base"
            >
              Tanya PilahAI
            </router-link>
          </template>
        </div>

      </div>
    </section>

  </div>
</template>
