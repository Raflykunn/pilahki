// Perkhidmatan Gemini AI dengan Function Calling untuk PilahKi' Makassar (PRD Seksyen 7.5 & 8)
import { wasteData, CATEGORY_THEMES, daftarSampah, kategoriConfig } from '../data/sampahData.js'
import { makassarFacilities, jenisFasilitasConfig, daftarFasilitas } from '../data/lokasiData.js'
import { MAKASSAR_DISTRICTS, schedulesDatabase, wilayahList, jadwalMaster } from '../data/jadwalData.js'
import { guidesData, kategoriEdukasiList, artikelPanduan, faqPanduan } from '../data/panduanData.js'

const GEMINI_PRIMARY_MODEL = 'gemini-2.5-flash'
const GEMINI_FALLBACK_MODEL = 'gemini-2.0-flash'

function getGeminiApiKey() {
  return import.meta.env.VITE_GEMINI_API_KEY || ''
}

function getGeminiEndpoint(modelName = GEMINI_PRIMARY_MODEL) {
  const key = getGeminiApiKey()
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`
}

// Fungsi pembersih karakter em-dash (—) dan en-dash (–) agar tidak terkesan kaku seperti robot AI
export function cleanDashes(text) {
  if (!text || typeof text !== 'string') return ''
  let cleaned = text
  // 1. Rentang angka/jam: 06.30 — 09.00 atau 5–10 -> "sampai"
  cleaned = cleaned.replace(/(\d+)\s*[—–]\s*(\d+)/g, '$1 sampai $2')
  // 2. Awal baris tanda strip -> bullet
  cleaned = cleaned.replace(/(^|\n)\s*[—–]\s*/g, '$1• ')
  // 3. Penghubung antar-klausa kata -> koma
  cleaned = cleaned.replace(/\s*[—–]\s*/g, ', ')
  // 4. Semua sisa em-dash atau en-dash
  cleaned = cleaned.replace(/[—–]/g, ', ')
  // 5. Rapikan koma berlebih
  cleaned = cleaned.replace(/,\s*,/g, ', ')
  cleaned = cleaned.replace(/,\s*([.?!:])/g, '$1')
  return cleaned
}

// Mendapatkan waktu dan hari saat ini di zona waktu Makassar (WITA, UTC+8)
export function getCurrentMakassarTime() {
  const now = new Date()
  let dayName = 'Senin'
  let timeString = '08.00 WITA'
  let fullDate = 'Hari ini'

  try {
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const witaDate = new Date(now.getTime() + (8 * 60 * 60 * 1000))
    dayName = dayNames[witaDate.getUTCDay()]
    
    const hours = String(witaDate.getUTCHours()).padStart(2, '0')
    const minutes = String(witaDate.getUTCMinutes()).padStart(2, '0')
    timeString = `${hours}.${minutes} WITA`

    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    fullDate = `${dayName}, ${witaDate.getUTCDate()} ${months[witaDate.getUTCMonth()]} ${witaDate.getUTCFullYear()}`
  } catch (e) {
    console.warn('[PilahAI] Error resolving time:', e)
  }

  return { dayName, timeString, fullDate, now }
}

// Mendapatkan domisili Makassar yang telah dipilih pengguna di sistem
export function getUserDomicile() {
  try {
    const raw = localStorage.getItem('pilahki_domicile')
    if (raw) {
      const d = JSON.parse(raw)
      return {
        city: d.city || 'Kota Makassar',
        district: d.district || 'Panakkukang',
        detail: d.detail || ''
      }
    }
  } catch (e) {}
  return { city: 'Kota Makassar', district: 'Panakkukang', detail: '' }
}

// Mendapatkan profil pengguna
export function getUserProfile() {
  try {
    const raw = localStorage.getItem('pilahki_user')
    if (raw) {
      const u = JSON.parse(raw)
      return { name: u.name || "Warga PilahKi'", email: u.email || '' }
    }
  } catch (e) {}
  return { name: "Warga PilahKi'", email: '' }
}

// ============================================================================
// 1. Fungsi-Fungsi Internal (Tools Execution)
// ============================================================================

// Fitur 1: Cek Kategori Sampah
export function toolCekKategoriSampah(args) {
  const query = (args?.namaSampah || '').toLowerCase().trim()
  if (!query) return { status: 'error', pesan: 'Nama sampah tidak boleh kosong.' }

  const match = wasteData.find(item => {
    const namaItem = item.name.toLowerCase()
    return namaItem.includes(query) ||
      query.includes(namaItem) ||
      (item.keywords && item.keywords.some(k => query.includes(k.toLowerCase()) || k.toLowerCase().includes(query)))
  })

  if (match) {
    return {
      status: 'found',
      nama: match.name,
      kategori: match.categoryName,
      nilaiEkonomis: match.recyclableValue,
      deskripsi: match.shortDesc,
      langkahPenanganan: match.steps,
      tempatPenyaluran: match.destination,
      pantangan: match.prohibitions
    }
  }

  return {
    status: 'not_found',
    pesan: `Sampah "${query}" belum tercatat spesifik di katalog 22 sampah umum Makassar, namun panduan umum: jika sisa makanan/organik masuk Organik (kompos/biopori), jika kardus/botol/plastik bersih masuk Anorganik (Bank Sampah), jika baterai/lampu/kimia memerlukan penanganan khusus, dan sachet kotor/popok/residu padat disalurkan ke TPA.`
  }
}

// Fitur 2: Cari Fasilitas Terdekat (Menggunakan Domisili Pengguna Secara Default)
export function toolCariFasilitas(args) {
  const domicile = getUserDomicile()
  let inputWilayah = (args?.wilayah || '').toLowerCase().trim()

  if (!inputWilayah || inputWilayah.includes('saya') || inputWilayah.includes('sini') || inputWilayah.includes('dekat')) {
    inputWilayah = domicile.district.toLowerCase()
  }

  const jenisSampah = (args?.jenisSampah || '').toLowerCase().trim()
  let rawJenis = (args?.jenisFasilitas || '').toLowerCase().trim().replace(/[\s_]+/g, '-')
  if (rawJenis === 'drop-box-b3' || rawJenis === 'b3') rawJenis = 'tpa'

  let list = makassarFacilities.filter(f => {
    const distMatch = f.district.toLowerCase().includes(inputWilayah) || inputWilayah.includes(f.district.toLowerCase())
    if (inputWilayah && !distMatch) {
      return false
    }
    if (rawJenis) {
      const fNorm = f.type.toLowerCase().replace(/_/g, '-')
      if (!fNorm.includes(rawJenis) && !rawJenis.includes(fNorm)) return false
    }
    if (jenisSampah) {
      const accepts = f.accepted.some(s => s.toLowerCase().includes(jenisSampah))
      if (!accepts) return false
    }
    return true
  })

  if (!list.length) {
    list = makassarFacilities.slice(0, 3)
  }

  return {
    status: 'success',
    wilayahAcuan: `Kecamatan ${domicile.district}, Kota Makassar`,
    total: list.length,
    fasilitas: list.map(f => ({
      nama: f.name,
      jenis: f.typeName,
      kecamatan: f.district,
      alamat: f.address,
      jamBuka: f.operatingHours,
      sampahDiterima: f.accepted,
      kontak: f.phone
    }))
  }
}

// Fitur 3: Cek Jadwal Angkut (Sadar Waktu & Domisili Makassar)
export function toolCekJadwal(args) {
  const domicile = getUserDomicile()
  const { dayName, fullDate, timeString } = getCurrentMakassarTime()
  let wilayahNama = (args?.wilayah || '').toLowerCase().trim()
  const jenisSampah = (args?.jenisSampah || '').toLowerCase().trim()

  if (!wilayahNama || wilayahNama.includes('saya') || wilayahNama.includes('sini') || wilayahNama.includes('daerah') || wilayahNama.includes('tempat')) {
    wilayahNama = domicile.district.toLowerCase()
  }

  let matchedDistrict = MAKASSAR_DISTRICTS.find(d => {
    return d.toLowerCase().includes(wilayahNama) || wilayahNama.includes(d.toLowerCase())
  })

  if (!matchedDistrict) {
    matchedDistrict = domicile.district || 'Panakkukang'
  }

  const rawJadwal = schedulesDatabase[matchedDistrict] || schedulesDatabase['Panakkukang'] || []
  let jadwal = rawJadwal

  if (jenisSampah) {
    const filtered = jadwal.filter(j => j.category.toLowerCase().includes(jenisSampah))
    if (filtered.length) jadwal = filtered
  }

  // Cari jadwal hari ini
  const hariIniJadwal = jadwal.find(j => j.day.toLowerCase() === dayName.toLowerCase())

  // Cari jadwal penjemputan aktif berikutnya (selain hari ini jika hari ini libur, atau jadwal besok/lusa)
  const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
  const todayIdx = dayOrder.findIndex(d => d.toLowerCase() === dayName.toLowerCase())
  let nextPickup = null

  for (let i = 1; i <= 7; i++) {
    const nextDayName = dayOrder[(todayIdx + i) % 7]
    const found = jadwal.find(j => j.day.toLowerCase() === nextDayName.toLowerCase() && j.status === 'Ada Penjemputan')
    if (found) {
      nextPickup = found
      break
    }
  }

  return {
    status: 'success',
    hariIni: dayName,
    tanggalHariIni: fullDate,
    waktuSekarang: timeString,
    kecamatan: matchedDistrict,
    wilayahLengkap: `Kecamatan ${matchedDistrict}, Kota Makassar`,
    jadwalHariIni: hariIniJadwal || null,
    penjemputanTerdekat: nextPickup || null,
    jadwalLengkap: jadwal.map(j => ({
      hari: j.day,
      status: j.status,
      waktu: j.time,
      kategoriSampah: j.category,
      armada: j.vehicle,
      catatan: j.notes
    }))
  }
}

// Fitur 4: Cari Panduan Edukasi
export function toolCariPanduan(args) {
  const topik = (args?.topik || '').toLowerCase().trim()

  const match = guidesData.find(g => {
    return g.title.toLowerCase().includes(topik) ||
      g.category.toLowerCase().includes(topik) ||
      g.summary.toLowerCase().includes(topik)
  })

  if (match) {
    return {
      status: 'success',
      judul: match.title,
      kategori: match.category,
      ringkasan: match.summary,
      waktuBaca: match.readTime
    }
  }

  return {
    status: 'success',
    judul: 'Prinsip Pemilahan Sampah Mandiri di Rumah',
    ringkasan: 'Selalu pisahkan sampah dari sumbernya: sampah organik dapur ditiriskan airnya untuk kompos/biopori, sampah anorganik (plastik/kardus/kaleng) dicuci dan dipipihkan untuk disetor ke Bank Sampah, limbah B3 (baterai/lampu) disendirikan dalam kotak tertutup, dan sampah residu dibuang ke armada angkut umum.'
  }
}

// ============================================================================
// 2. Definisi Tools untuk Gemini Function Calling
// ============================================================================
const toolsDefinition = [
  {
    functionDeclarations: [
      {
        name: 'cekKategoriSampah',
        description: 'Mengecek kategori sampah (Organik, Anorganik, B3, Residu), langkah penanganan, tempat penyaluran, dan pantangan.',
        parameters: {
          type: 'OBJECT',
          properties: {
            namaSampah: {
              type: 'STRING',
              description: 'Nama barang atau sampah yang ditanyakan warga (misal: botol plastik, baterai, sachet kopi, minyak jelantah, duri ikan).'
            }
          },
          required: ['namaSampah']
        }
      },
      {
        name: 'cariFasilitas',
        description: 'Mencari lokasi Bank Sampah, TPS 3R, atau TPA di Kota Makassar. Otomatis memprioritaskan domisili pengguna saat ini.',
        parameters: {
          type: 'OBJECT',
          properties: {
            wilayah: {
              type: 'STRING',
              description: 'Kecamatan di Makassar (misal: Panakkukang, Rappocini, Tamalanrea, Bontoala, dsb). Jika pengguna tidak menyebut kecamatan lain, kosongkan atau isi wilayah domisili pengguna.'
            },
            jenisSampah: {
              type: 'STRING',
              description: 'Jenis sampah yang ingin disetor (misal: botol, kardus, jelantah, baterai, residu).'
            },
            jenisFasilitas: {
              type: 'STRING',
              description: 'Tipe: bank-sampah, tps-3r, atau tpa.'
            }
          }
        }
      },
      {
        name: 'cekJadwal',
        description: 'Mengecek jadwal pengangkutan armada kebersihan di kecamatan Kota Makassar. Otomatis memprioritaskan domisili pengguna dan waktu saat ini (hari ini / sekarang).',
        parameters: {
          type: 'OBJECT',
          properties: {
            wilayah: {
              type: 'STRING',
              description: 'Kecamatan di Makassar (misal: Panakkukang, Rappocini, Tamalanrea). Jika pengguna menanyakan jadwal "di wilayah saya", gunakan domisili pengguna saat ini.'
            },
            hari: {
              type: 'STRING',
              description: 'Waktu atau hari spesifik: sekarang, hari ini, besok, atau nama hari tertentu.'
            },
            jenisSampah: {
              type: 'STRING',
              description: 'Kategori sampah: organik, anorganik, residu.'
            }
          }
        }
      },
      {
        name: 'cariPanduan',
        description: 'Mencari panduan praktis pengolahan sampah (Kompos Takakura, Lubang Biopori, Kode Plastik 1-7, Kotak Aman B3).',
        parameters: {
          type: 'OBJECT',
          properties: {
            topik: {
              type: 'STRING',
              description: 'Topik panduan (misal: biopori, kompos, takakura, kode plastik, baterai).'
            }
          }
        }
      }
    ]
  }
]

// Membangun System Instruction dinamis dengan konteks waktu dan domisili
function buildSystemInstruction() {
  const dom = getUserDomicile()
  const user = getUserProfile()
  const { dayName, fullDate, timeString } = getCurrentMakassarTime()

  return `Anda adalah "PilahAI", asisten cerdas resmi dari platform PilahKi' Kota Makassar untuk membantu warga memilah dan mengelola sampah rumah tangga dengan bahasa santun, ramah, bersahabat, ringkas, dan to-the-point.

WAKTU & TANGGAL REAL-TIME DI MAKASSAR (WITA):
- Hari & Tanggal: ${fullDate} (Hari ${dayName})
- Jam Saat Ini: ${timeString}

KONTEKS PENGGUNA TERVERIFIKASI:
- Nama Warga: ${user.name}
- Domisili Terpilih di Aplikasi: Kecamatan ${dom.district}, ${dom.city}${dom.detail ? ` (${dom.detail})` : ''}

ATURAN PENTING MENGENAI JADWAL ANGKUT (SANGAT KETAT):
1. JIKA PENGGUNA BERTANYA JADWAL "SEKARANG", "HARI INI", ATAU "TERDEKAT" (contoh: "kapan angkut sampah sekarang?", "hari ini angkut apa?", "jadwal hari ini apa?", "kapan sampah dijemput?", "besok angkut apa?"):
   - DILARANG MENYEBUTKAN SEMUA HARI DARI SENIN SAMPAI MINGGU! Jangan pernah mencetak daftar panjang 7 hari jika pengguna hanya menanyakan sekarang/hari ini.
   - FOKUSKAN HANYA PADA HARI INI (Hari ${dayName}) dan pengangkutan terdekat berikutnya (misal: besok atau jadwal armada terdekat).
   - Jelaskan status hari ini: apakah armada beroperasi menjemput sampah hari ini, ada layanan Bank Sampah, atau libur operasional. Lalu infokan jadwal pengangkutan terdekat berikutnya.
2. HANYA jika pengguna secara eksplisit meminta jadwal seminggu penuh (contoh: "jadwal seminggu", "jadwal lengkap", "semua hari"), baru Anda sebutkan seluruh hari Senin hingga Minggu.
3. Otomatis gunakan jadwal untuk domisili pengguna di Kecamatan ${dom.district} tanpa perlu bertanya lagi di mana wilayah pengguna.

ATURAN DOMAIN & FORMAT KETAT:
1. Anda HANYA membantu seputar pemilahan sampah, 4 kategori sampah (Organik, Anorganik, B3, Residu), lokasi fasilitas di Makassar, jadwal armada kecamatan, dan panduan edukasi.
2. DILARANG MENGGUNAKAN FORMAT TABEL (| kolom 1 | kolom 2 |). Tabel rusak di tampilan bubble chat mobile.
3. Untuk jadwal atau daftar fasilitas, WAJIB gunakan daftar poin berjarak (bullet points • atau angka 1, 2, 3) yang rapi.
4. Tolak dengan sopan jika pertanyaan di luar topik pengelolaan sampah.
5. DILARANG KERAS MENGGUNAKAN EMOJI SPAM. Tulis dalam bahasa Indonesia bersih, santun, dan profesional.
6. DILARANG MENGGUNAKAN TANDA HUBUNG PANJANG EM-DASH ("—" atau "–"). Gunakan tanda baca alami seperti koma, titik dua (:), atau tanda kurung.`
}

// ============================================================================
// 3. Penghantaran Pesan ke Gemini API
// ============================================================================
export async function sendChatMessageToPilahAI(messagesHistory) {
  const apiKey = getGeminiApiKey()

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return handleLocalSmartAssistant(messagesHistory)
  }

  try {
    const validHistory = messagesHistory
      .filter(msg => msg.text && typeof msg.text === 'string')
      .slice(-8)

    const contents = validHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))

    const systemInstruction = buildSystemInstruction()
    let endpoint = getGeminiEndpoint(GEMINI_PRIMARY_MODEL)

    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents,
      tools: toolsDefinition
    }

    let response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok && (response.status === 429 || response.status === 503 || response.status === 404)) {
      endpoint = getGeminiEndpoint(GEMINI_FALLBACK_MODEL)
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    }

    if (!response.ok) {
      return handleLocalSmartAssistant(messagesHistory)
    }

    const result = await response.json()
    const candidate = result?.candidates?.[0]
    const modelPart = candidate?.content?.parts?.[0]

    // Jika Gemini melakukan Function Calling
    if (modelPart?.functionCall) {
      const call = modelPart.functionCall
      let functionResult = null

      if (call.name === 'cekKategoriSampah') {
        functionResult = toolCekKategoriSampah(call.args)
      } else if (call.name === 'cariFasilitas') {
        functionResult = toolCariFasilitas(call.args)
      } else if (call.name === 'cekJadwal') {
        functionResult = toolCekJadwal(call.args)
      } else if (call.name === 'cariPanduan') {
        functionResult = toolCariPanduan(call.args)
      } else {
        functionResult = { status: 'success' }
      }

      const followUpContents = [
        ...contents,
        {
          role: 'model',
          parts: [modelPart]
        },
        {
          role: 'user',
          parts: [
            {
              functionResponse: {
                name: call.name,
                response: typeof functionResult === 'object' && functionResult !== null ? functionResult : { result: functionResult }
              }
            }
          ]
        }
      ]

      const followUpResponse = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: followUpContents,
          tools: toolsDefinition
        })
      })

      if (followUpResponse.ok) {
        const followResult = await followUpResponse.json()
        const textAnswer = followResult?.candidates?.[0]?.content?.parts?.[0]?.text
        if (textAnswer) {
          return {
            text: cleanDashes(textAnswer),
            toolUsed: call.name,
            toolData: functionResult
          }
        }
      }

      return {
        text: cleanDashes(formatFunctionResultAsText(call.name, functionResult)),
        toolUsed: call.name,
        toolData: functionResult
      }
    }

    if (modelPart?.text) {
      return { text: cleanDashes(modelPart.text) }
    }

    return handleLocalSmartAssistant(messagesHistory)
  } catch (err) {
    console.error('[PilahAI] Error chat:', err)
    return handleLocalSmartAssistant(messagesHistory)
  }
}

// Format hasil fungsi jika dipanggil sebagai teks langsung
function formatFunctionResultAsText(funcName, res) {
  if (funcName === 'cekKategoriSampah') {
    if (res.status === 'found') {
      return `Sampah **${res.nama}** masuk ke dalam kategori **${res.kategori.toUpperCase()}**.\n\n` +
        `**Nilai Daur Ulang:** ${res.nilaiEkonomis}\n\n` +
        `**Langkah Penanganan:**\n${res.langkahPenanganan.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n` +
        `**Tujuan Penyaluran:** ${res.tempatPenyaluran}\n\n` +
        `*Pantangan:* ${res.pantangan ? res.pantangan.join(' ') : 'Jangan dicampur dengan sampah lain.'}`
    }
    return res.pesan
  }

  if (funcName === 'cariFasilitas') {
    return `Berikut fasilitas pengelolaan sampah terdekat di Makassar:\n\n` +
      res.fasilitas.map(f => `• **${f.nama}** (${f.jenis})\n  Alamat: ${f.alamat} (Kecamatan ${f.kecamatan})\n  Jam Operasional: ${f.jamBuka}\n  Menerima: ${f.sampahDiterima.join(', ')}\n  Kontak: ${f.kontak}`).join('\n\n')
  }

  if (funcName === 'cekJadwal') {
    let text = `Jadwal pengangkutan armada kebersihan untuk **${res.wilayahLengkap}**:\n\n`
    if (res.jadwalHariIni) {
      text += `📅 **Hari Ini (${res.hariIni}, ${res.waktuSekarang}):**\n` +
        `• **Status:** ${res.jadwalHariIni.status}\n` +
        `• **Waktu:** ${res.jadwalHariIni.waktu}\n` +
        `• **Kategori:** ${res.jadwalHariIni.kategoriSampah}\n` +
        `• **Armada:** ${res.jadwalHariIni.armada}\n` +
        `• *Catatan:* ${res.jadwalHariIni.catatan}\n\n`
    }
    if (res.penjemputanTerdekat) {
      text += `🚚 **Pengangkutan Terdekat Berikutnya:**\n` +
        `• **${res.penjemputanTerdekat.hari}** (${res.penjemputanTerdekat.waktu})\n` +
        `• **Kategori:** ${res.penjemputanTerdekat.kategoriSampah}\n` +
        `• **Armada:** ${res.penjemputanTerdekat.armada}\n` +
        `• *Catatan:* ${res.penjemputanTerdekat.catatan}`
    }
    return text
  }

  if (funcName === 'cariPanduan') {
    return `**${res.judul}**\n\n${res.ringkasan}`
  }

  return 'Informasi telah ditemukan di sistem PilahKi Makassar.'
}

// ============================================================================
// 4. Asisten Lokal Cerdas (Sadar Waktu Hari Ini & Domisili Makassar)
// ============================================================================
function handleLocalSmartAssistant(messagesHistory) {
  const latestMessage = messagesHistory[messagesHistory.length - 1]?.text || ''
  const lower = latestMessage.toLowerCase()
  const domicile = getUserDomicile()

  // 1. Cek topik di luar sampah
  const offTopic = ['politik', 'presiden', 'pemilu', 'koding', 'javascript', 'resep martabak', 'sepak bola']
  if (offTopic.some(w => lower.includes(w))) {
    return {
      text: 'Mohon maaf, saya adalah PilahAI yang khusus dilatih untuk membantu warga seputar pemilahan sampah, fasilitas Bank Sampah di Makassar, jadwal armada pengangkut, dan panduan edukasi rumah tangga. Ada yang bisa saya bantu terkait sampah di rumah Anda?'
    }
  }

  // 2. Permintaan Jadwal (Sadar Hari Ini & Waktu Real-Time)
  if (lower.includes('jadwal') || lower.includes('kapan') || lower.includes('diangkut') || lower.includes('hari apa') || lower.includes('truk') || lower.includes('jemput') || lower.includes('ambil')) {
    let targetDistrict = domicile.district

    for (const d of MAKASSAR_DISTRICTS) {
      if (lower.includes(d.toLowerCase())) {
        targetDistrict = d
        break
      }
    }

    const res = toolCekJadwal({ wilayah: targetDistrict })
    const isAskingBesok = lower.includes('besok')
    const isAskingAll = lower.includes('semua') || lower.includes('lengkap') || lower.includes('seminggu') || lower.includes('1 minggu') || lower.includes('sepekan')
    const isAskingNow = lower.includes('sekarang') || lower.includes('hari ini') || lower.includes('saat ini') || lower.includes('terdekat') || lower.includes('berikutnya') || lower.includes('kapan')

    // Jika pengguna menanyakan jadwal sekarang / hari ini / besok / terdekat (TIDAK minta seminggu penuh)
    if (!isAskingAll && (isAskingNow || isAskingBesok)) {
      let responseText = `Untuk wilayah domisili Anda di **${res.wilayahLengkap}**:\n\n`

      if (isAskingBesok) {
        const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
        const todayIdx = dayOrder.findIndex(d => d.toLowerCase() === res.hariIni.toLowerCase())
        const tomorrowDay = dayOrder[(todayIdx + 1) % 7]
        const tomorrowJadwal = res.jadwalLengkap.find(j => j.hari.toLowerCase() === tomorrowDay.toLowerCase())

        if (tomorrowJadwal) {
          responseText += `📅 **Jadwal Besok (${tomorrowDay}):**\n` +
            `• **Status:** ${tomorrowJadwal.status}\n` +
            `• **Waktu:** ${tomorrowJadwal.waktu}\n` +
            `• **Kategori:** ${tomorrowJadwal.kategoriSampah}\n` +
            `• **Armada:** ${tomorrowJadwal.armada}\n` +
            `• *Catatan:* ${tomorrowJadwal.catatan}`
        }
      } else {
        // Hari ini
        responseText += `📅 **Jadwal Hari Ini (${res.hariIni}, ${res.tanggalHariIni}):**\n`
        if (res.jadwalHariIni) {
          responseText += `• **Status:** ${res.jadwalHariIni.status}\n` +
            `• **Waktu:** ${res.jadwalHariIni.waktu}\n` +
            `• **Kategori:** ${res.jadwalHariIni.kategoriSampah}\n` +
            `• **Armada:** ${res.jadwalHariIni.armada}\n` +
            `• *Catatan:* ${res.jadwalHariIni.catatan}\n\n`
        }

        if (res.penjemputanTerdekat) {
          responseText += `🚚 **Pengangkutan Terdekat Berikutnya:**\n` +
            `• **${res.penjemputanTerdekat.hari}** (${res.penjemputanTerdekat.waktu})\n` +
            `• **Kategori:** ${res.penjemputanTerdekat.kategoriSampah}\n` +
            `• **Armada:** ${res.penjemputanTerdekat.armada}\n` +
            `• *Catatan:* ${res.penjemputanTerdekat.catatan}`
        }
      }

      responseText += `\n\n*Catatan:* Jika ingin melihat jadwal lengkap seminggu penuh, Anda bisa mengetik *"jadwal seminggu"* atau membuka menu **Jadwal Angkut**.`
      return {
        text: responseText,
        toolUsed: 'cekJadwal',
        toolData: res
      }
    }

    // Jika pengguna meminta jadwal seminggu penuh
    return {
      text: `Berdasarkan wilayah domisili Anda di **${res.wilayahLengkap}**, berikut agenda jadwal pengangkutan mingguan:\n\n` +
        res.jadwalLengkap.map(j => `• **${j.hari}** (${j.waktu})\n  - **Status:** ${j.status}\n  - **Kategori:** ${j.kategoriSampah}\n  - **Armada:** ${j.armada}\n  - *Catatan:* ${j.catatan}`).join('\n\n') +
        `\n\n*Tips:* Letakkan tempat sampah terpilah di depan pagar sebelum jadwal armada tiba.`,
      toolUsed: 'cekJadwal',
      toolData: res
    }
  }

  // 3. Permintaan Lokasi Fasilitas / Bank Sampah
  if (lower.includes('lokasi') || lower.includes('bank sampah') || lower.includes('tps') || lower.includes('tpa') || lower.includes('tamangapa') || lower.includes('antang') || lower.includes('buang ke mana') || lower.includes('di mana') || lower.includes('setor') || lower.includes('jual sampah')) {
    let targetDistrict = domicile.district

    for (const d of MAKASSAR_DISTRICTS) {
      if (lower.includes(d.toLowerCase())) {
        targetDistrict = d
        break
      }
    }

    let jenisF = ''
    if (lower.includes('bank sampah')) jenisF = 'bank_sampah'
    if (lower.includes('tpa') || lower.includes('antang') || lower.includes('tamangapa') || lower.includes('residu')) jenisF = 'tpa'
    if (lower.includes('tps 3r') || lower.includes('kompos')) jenisF = 'tps_3r'

    const res = toolCariFasilitas({ wilayah: targetDistrict, jenisFasilitas: jenisF })
    return {
      text: `Berdasarkan domisili Anda di **Kecamatan ${domicile.district}, Kota Makassar**, berikut fasilitas pengelolaan sampah terdekat yang direkomendasikan:\n\n` +
        res.fasilitas.slice(0, 3).map(f => `• **${f.nama}** (${f.jenis})\n  - **Alamat:** ${f.alamat} (Kecamatan ${f.kecamatan})\n  - **Jam Operasional:** ${f.jamBuka}\n  - **Menerima:** ${f.sampahDiterima.join(', ')}\n  - **Kontak:** ${f.kontak}`).join('\n\n') +
        `\n\nBuka menu **Cari Lokasi** untuk petunjuk arah langsung dan peta interaktif.`,
      toolUsed: 'cariFasilitas',
      toolData: res
    }
  }

  // 4. Kategori Sampah
  let cleanItemName = latestMessage
    .replace(/(bagaimana|cara|buang|kategori|masuk|apa|ke mana|apakah|bisa|saya|punya|tolong|cek|tanya)/gi, '')
    .trim()

  const kategoriResult = toolCekKategoriSampah({ namaSampah: cleanItemName || latestMessage })
  if (kategoriResult.status === 'found') {
    return {
      text: `Sampah **${kategoriResult.nama}** masuk kategori **${kategoriResult.kategori.toUpperCase()}**.\n\n` +
        `**Nilai Daur Ulang:** ${kategoriResult.nilaiEkonomis}\n\n` +
        `**Langkah Penanganan Praktis:**\n` +
        kategoriResult.langkahPenanganan.map((step, idx) => `${idx + 1}. ${step}`).join('\n') +
        `\n\n**Tujuan Penyaluran:** ${kategoriResult.tempatPenyaluran}\n\n` +
        `*Pantangan:* ${kategoriResult.pantangan ? kategoriResult.pantangan.join(' ') : 'Jangan dicampur dengan sampah lain.'}`,
      toolUsed: 'cekKategoriSampah',
      toolData: kategoriResult
    }
  }

  // 5. Panduan Edukasi
  const panduanRes = toolCariPanduan({ topik: lower })
  if (lower.includes('panduan') || lower.includes('kompos') || lower.includes('biopori') || lower.includes('takakura') || lower.includes('plastik') || lower.includes('b3') || lower.includes('cara')) {
    return {
      text: `**${panduanRes.judul}**\n\n${panduanRes.ringkasan}\n\nAnda dapat membaca panduan selengkapnya dengan membuka menu **Panduan** di navigasi utama.`,
      toolUsed: 'cariPanduan',
      toolData: panduanRes
    }
  }

  // Default sapaan ramah sadar domisili
  return {
    text: `Halo! Saya PilahAI. Domisili Anda terhubung di **Kecamatan ${domicile.district}, Makassar**.\n\nAnda bisa menanyakan seputar:\n` +
      `1. *"Kapan jadwal truk sampah sekarang?"*\n` +
      `2. *"Di mana Bank Sampah terdekat?"*\n` +
      `3. *"Botol minyak bekas masuk kategori apa?"*\n` +
      `4. *"Bagaimana cara membuat kompos Takakura?"*\n\n` +
      `Ada yang bisa saya bantu hari ini?`
  }
}

// Wrapper fungsi untuk kemudahan pemanggilan komponen
export async function sendMessageToGemini(prompt) {
  const reply = await sendChatMessageToPilahAI([{ role: 'user', text: prompt }])
  if (reply && typeof reply.text === 'string') {
    reply.text = cleanDashes(reply.text)
  }
  return reply
}
