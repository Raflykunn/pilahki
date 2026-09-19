// Perkhidmatan Gemini AI dengan Function Calling untuk 4 Fitur Utama Pilahki (PRD Seksyen 7.5 & 8)
import { daftarSampah, kategoriConfig } from '../data/sampahData.js'
import { daftarFasilitas, jenisFasilitasConfig } from '../data/lokasiData.js'
import { wilayahList, jadwalMaster } from '../data/jadwalData.js'
import { kategoriEdukasiList, artikelPanduan, faqPanduan } from '../data/panduanData.js'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_PRIMARY_MODEL = 'gemini-3.5-flash-lite'
const GEMINI_FALLBACK_MODEL = 'gemini-3.5-flash'

function getGeminiApiKey() {
  return import.meta.env.VITE_GEMINI_API_KEY || ''
}

function getGeminiEndpoint(modelName = GEMINI_PRIMARY_MODEL) {
  const key = getGeminiApiKey()
  return `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`
}

// ============================================================================
// 1. Fungsi-Fungsi Dalaman (Internal Tools)
// ============================================================================

// Fitur 1: Semak Kategori Sampah
export function toolCekKategoriSampah(args) {
  const query = (args?.namaSampah || '').toLowerCase().trim()
  if (!query) return { status: 'error', pesan: 'Nama sampah tidak boleh kosong.' }

  const match = daftarSampah.find(item => {
    const namaItem = item.nama.toLowerCase()
    return namaItem.includes(query) ||
      query.includes(namaItem) ||
      item.alias.some(a => {
        const aliasLower = a.toLowerCase()
        return aliasLower.includes(query) || query.includes(aliasLower)
      })
  })

  if (match) {
    return {
      status: 'found',
      nama: match.nama,
      kategori: match.kategori,
      kategoriLabel: kategoriConfig[match.kategori]?.label || match.kategori,
      penanganan: match.penanganan,
      tujuanPenyaluran: match.tujuanPenyaluran,
      tipsPraktis: match.tipsPraktis
    }
  }

  return {
    status: 'not_found',
    pesan: `Sampah "${query}" belum tercatat spesifik di database cepat, namun umumnya: jika mudah membusuk masuk Organik, jika kemasan kering (kardus/plastik/kaca/kaleng) masuk Anorganik, jika sachet berlaminasi/kotor masuk Residu, dan jika baterai/bohlam/kimia masuk B3.`
  }
}

// Fitur 2: Cari Fasiliti Terdekat
export function toolCariFasilitas(args) {
  const wilayah = (args?.wilayah || '').toLowerCase().trim()
  const jenisSampah = (args?.jenisSampah || '').toLowerCase().trim()
  const rawJenisFasilitas = (args?.jenisFasilitas || '').toLowerCase().trim().replace(/[\s_]+/g, '-')

  let list = daftarFasilitas.filter(f => {
    if (wilayah && !f.wilayah.toLowerCase().includes(wilayah) && !f.kecamatan.toLowerCase().includes(wilayah)) {
      return false
    }
    if (rawJenisFasilitas) {
      const fJenisNorm = f.jenis.toLowerCase()
      if (!fJenisNorm.includes(rawJenisFasilitas) && !rawJenisFasilitas.includes(fJenisNorm)) {
        return false
      }
    }
    if (jenisSampah) {
      const accepts = f.sampahDiterima.some(s => s.toLowerCase().includes(jenisSampah))
      if (!accepts) return false
    }
    return true
  })

  // Jika terlalu sempit, pulangkan fasiliti terdekat yang ada
  if (!list.length) {
    list = daftarFasilitas.slice(0, 3)
  }

  return {
    status: 'success',
    total: list.length,
    fasilitas: list.map(f => ({
      nama: f.nama,
      jenis: jenisFasilitasConfig[f.jenis]?.label || f.jenis,
      alamat: f.alamat,
      jarak: `${f.jarakMeter} meter`,
      jamBuka: f.jamOperasional,
      sampahDiterima: f.sampahDiterima,
      kontak: f.kontakWa,
      catatan: f.catatan
    }))
  }
}

// Fitur 3: Semak Jadual Angkut Wilayah
export function toolCekJadwal(args) {
  const wilayahNama = (args?.wilayah || '').toLowerCase().trim()
  const jenisSampah = (args?.jenisSampah || '').toLowerCase().trim()

  // Cari ID wilayah yang sepadan
  let matchedWilayah = wilayahList.find(w => {
    return w.kecamatan.toLowerCase().includes(wilayahNama) ||
      w.kelurahan.toLowerCase().includes(wilayahNama) ||
      w.rw.toLowerCase().includes(wilayahNama)
  })

  if (!matchedWilayah) {
    const words = wilayahNama.split(/\s+/)
    matchedWilayah = wilayahList.find(w => {
      return words.some(word => word.length > 2 && (w.kecamatan.toLowerCase().includes(word) || w.kelurahan.toLowerCase().includes(word)))
    }) || wilayahList[0] // fallback ke Sukajadi default
  }

  let jadwal = jadwalMaster[matchedWilayah.id] || []
  if (jenisSampah) {
    const filtered = jadwal.filter(j => j.kategori.includes(jenisSampah) || j.jenisSampah.toLowerCase().includes(jenisSampah))
    if (filtered.length) jadwal = filtered
  }

  return {
    status: 'success',
    wilayah: `${matchedWilayah.kecamatan} - ${matchedWilayah.kelurahan} (${matchedWilayah.rw})`,
    tpsTerdekat: matchedWilayah.tpsTerdekat,
    jadwal: jadwal.map(j => ({
      hari: j.hari,
      waktu: j.waktu,
      jenisSampah: j.jenisSampah,
      kategori: j.kategori,
      catatan: j.catatan
    }))
  }
}

// Fitur 4: Cari Panduan Edukasi
export function toolCariPanduan(args) {
  const topik = (args?.topik || '').toLowerCase().trim()

  const isOrganik = topik.includes('organik')
  const isAnorganik = topik.includes('anorganik') || topik.includes('nonorganik') || topik.includes('non-organik')

  // Panduan komparatif organik vs anorganik
  if (isOrganik && isAnorganik) {
    return {
      status: 'success',
      ringkasanEdukasi: `Membedakan sampah organik dan anorganik (non-organik) itu sangat mudah, kuncinya ada pada **sumbernya** dan **bisa membusuk atau tidak**:\n\n` +
        `**1. Sampah Organik (Bisa Membusuk)**\n` +
        `• **Asal:** Sisa makhluk hidup (tumbuhan, hewan, dapur).\n` +
        `• **Ciri:** Mudah hancur secara alami dalam hitungan hari/minggu dan berbau bila dibiarkan lembap.\n` +
        `• **Contoh:** Sisa sayur & buah, sisa makanan/nasi, daun rontok, kulit telur, ampas kopi/teh, tulang ayam/ikan.\n` +
        `• **Pengelolaan:** Tiriskan airnya, simpan di wadah tertutup, bisa diolah jadi kompos atau pakan maggot.\n\n` +
        `**2. Sampah Non-Organik / Anorganik (Tidak Bisa Membusuk)**\n` +
        `• **Asal:** Buatan manusia atau proses industri sintetis.\n` +
        `• **Ciri:** Kering, awet, butuh puluhan hingga ratusan tahun untuk terurai di alam.\n` +
        `• **Contoh:** Botol plastik, kantong kresek, kardus, kaleng minuman, wadah kaca, styrofoam.\n` +
        `• **Pengelolaan:** Cuci bilas bersih dari minyak/sisa isi, keringkan, remas/lipat agar ringkas, lalu kumpulkan untuk disetor ke Bank Sampah terdekat.\n\n` +
        `*Rumus Cepat:* Tanyakan ke diri sendiri: *"Apakah benda ini bakal membusuk dan hancur sendiri dalam 1-2 minggu?"*\n` +
        `• Kalau **Iya** &rarr; Masuk **Organik**\n` +
        `• Kalau **Tidak** &rarr; Masuk **Anorganik**`
    }
  }

  const words = topik.split(/\s+/).filter(w => w.length > 2)
  const kategori = kategoriEdukasiList.find(k => {
    return words.some(w => k.id.includes(w) || k.nama.toLowerCase().includes(w) || k.contoh.some(c => c.toLowerCase().includes(w)))
  })

  const artikel = artikelPanduan.find(a => {
    return words.some(w => a.judul.toLowerCase().includes(w) || a.ringkasan.toLowerCase().includes(w))
  })

  return {
    status: 'success',
    panduanKategori: kategori ? {
      nama: kategori.nama,
      ringkasan: kategori.ringkasan,
      langkah: kategori.langkahPraktis,
      tips: kategori.tipsRina
    } : null,
    artikel: artikel ? {
      judul: artikel.judul,
      ringkasan: artikel.ringkasan,
      langkah: artikel.isi
    } : null
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
        description: 'Mengecek kategori sampah (Organik, Anorganik, B3, Residu), cara penanganan aman, dan tujuan penyaluran.',
        parameters: {
          type: 'OBJECT',
          properties: {
            namaSampah: {
              type: 'STRING',
              description: 'Nama barang atau sampah yang ditanyakan warga (misal: baterai, minyak jelantah, botol plastik, popok, sachet).'
            }
          },
          required: ['namaSampah']
        }
      },
      {
        name: 'cariFasilitas',
        description: 'Mencari lokasi Bank Sampah, TPS 3R, Drop Box B3, atau TPS terdekat di wilayah kota beserta jam operasional.',
        parameters: {
          type: 'OBJECT',
          properties: {
            wilayah: {
              type: 'STRING',
              description: 'Nama kecamatan atau kelurahan (misal: Sukajadi, Coblong, Lengkong, Cicendo, Dago, Pasteur).'
            },
            jenisSampah: {
              type: 'STRING',
              description: 'Jenis sampah yang ingin disetor (misal: jelantah, baterai, kardus, plastik).'
            },
            jenisFasilitas: {
              type: 'STRING',
              description: 'Tipe fasilitas: bank-sampah, tps-3r, dropbox-b3, atau tps.'
            }
          }
        }
      },
      {
        name: 'cekJadwal',
        description: 'Mengecek jadwal hari dan jam pengangkutan sampah rutin armada kebersihan berdasarkan wilayah perumahan warga.',
        parameters: {
          type: 'OBJECT',
          properties: {
            wilayah: {
              type: 'STRING',
              description: 'Nama wilayah/kecamatan/kelurahan tempat tinggal warga (misal: Sukajadi, Coblong, Dago, Malabar).'
            },
            jenisSampah: {
              type: 'STRING',
              description: 'Jenis sampah spesifik: organik, anorganik, residu.'
            }
          }
        }
      },
      {
        name: 'cariPanduan',
        description: 'Mencari tips dan artikel edukasi pemilahan sampah praktis untuk dapur dan rumah tangga.',
        parameters: {
          type: 'OBJECT',
          properties: {
            topik: {
              type: 'STRING',
              description: 'Topik panduan (misal: bau sampah dapur, mencuci botol, wadah baterai, sachet).'
            }
          }
        }
      }
    ]
  }
]

// System Instruction rasmi mengikut PRD Seksyen 7.5
const SYSTEM_INSTRUCTION = `Anda adalah "PilahAI", asisten cerdas resmi dari platform Pilahki untuk membantu warga Indonesia (terutama ibu rumah tangga dan masyarakat awam) memilah dan mengelola sampah rumah tangga dengan bahasa santun, ramah, bersahabat, dan ringkas.

ATURAN DOMAIN & FORMAT KETAT:
1. Anda HANYA membantu seputar pemilahan sampah, kategori sampah (Organik, Anorganik, B3, Residu), fasilitas penerima (Bank Sampah, TPS 3R, Drop Box B3), jadwal angkut, dan panduan edukasi sampah rumah tangga.
2. JANGAN PERNAH MENGGUNAKAN FORMAT TABEL (| kolom 1 | kolom 2 |). Tabel terlihat sangat buruk di bubble chat.
3. Untuk menyampaikan jadwal angkut atau daftar fasilitas, WAJIB gunakan format daftar poin ringkas berjarak (bullet points • atau angka 1, 2, 3) yang jelas dan bersih tanpa menggunakan spam emoji.
   Contoh format jadwal yang benar:
   • **Senin** (06:30 - 08:30 WIB)
   - Jenis: Organik (Sisa Makanan)
   - Catatan: Taruh di depan pagar sebelum jam 06:30.
4. Jika pengguna bertanya di luar topik sampah (misalnya politik, sains rumit, kode pemrograman, resep masak umum), tolak dengan sangat sopan bahwa Anda hanya bisa membantu seputar pemilahan dan pengelolaan sampah rumah tangga.
5. Selalu gunakan perkakas fungsi (function calling) yang disediakan (cekKategoriSampah, cariFasilitas, cekJadwal, cariPanduan) saat pengguna bertanya hal yang relevan untuk memberikan informasi akurat dari database Pilahki.
6. Jangan gunakan istilah teknis rumit. Gunakan bahasa yang mudah dipahami warga biasa, to-the-point, dan ramah.
7. DILARANG KERAS MENGGUNAKAN EMOJI. Jangan pernah menyisipkan emoji apapun (seperti 🌱, 🤖, 💡, 📍, 📦, 🍃, 🗑️, dsb). Tulis semua respon dalam teks bahasa Indonesia yang bersih, formal-santun, dan profesional.
8. DILARANG KERAS MENGGUNAKAN TANDA HUBUNG PANJANG / EM-DASH ("—" atau "–"). Tanda strip panjang tersebut membuat kalimat terkesan kaku seperti robot AI. Gunakan tanda baca alami manusia seperti koma (,), titik (.), titik dua (:), atau tanda kurung bila memberikan penjelasan.`

// ============================================================================
// 3. Penghantaran Mesej ke Gemini API
// ============================================================================
export async function sendChatMessageToPilahAI(messagesHistory) {
  const apiKey = getGeminiApiKey()

  // Jika API Key tidak dimasukkan atau default placeholder, gunakan pembantu tempatan cerdas
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return handleLocalSmartAssistant(messagesHistory)
  }

  try {
    // Siapkan riwayat percakapan terkini (maksimal 8 pesan terakhir)
    const validHistory = messagesHistory
      .filter(msg => msg.text && typeof msg.text === 'string')
      .slice(-8)

    const contents = validHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))

    // Kirim dengan gemini-3.5-flash utama, jika kena 429/503 fallback ke gemini-3.5-flash-lite
    let endpoint = getGeminiEndpoint(GEMINI_PRIMARY_MODEL)
    const payload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
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
      console.warn(`[PilahAI] Model ${GEMINI_PRIMARY_MODEL} (${response.status}), mencoba model fallback ${GEMINI_FALLBACK_MODEL}...`)
      endpoint = getGeminiEndpoint(GEMINI_FALLBACK_MODEL)
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.warn(`[PilahAI] Gemini API response not ok (${response.status}):`, errorText)
      return handleLocalSmartAssistant(messagesHistory)
    }

    const result = await response.json()
    const candidate = result?.candidates?.[0]
    const modelPart = candidate?.content?.parts?.[0]

    // Jika Gemini mencadangkan pemanggilan fungsi (Function Call)
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

      // Hantar semula hasil fungsi ke Gemini untuk rumusan perbualan akhir
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
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: followUpContents,
          tools: toolsDefinition
        })
      })

      if (followUpResponse.ok) {
        const followResult = await followUpResponse.json()
        const textAnswer = followResult?.candidates?.[0]?.content?.parts?.[0]?.text
        if (textAnswer) {
          return {
            text: textAnswer,
            toolUsed: call.name,
            toolData: functionResult
          }
        }
      } else {
        const followUpErr = await followUpResponse.text().catch(() => '')
        console.warn('[PilahAI] Follow-up function call error:', followUpErr)
      }

      // Fallback format jika susulan tamat atau kuota habis
      return {
        text: formatFunctionResultAsText(call.name, functionResult),
        toolUsed: call.name,
        toolData: functionResult
      }
    }

    if (modelPart?.text) {
      return { text: modelPart.text.replace(/—/g, ', ').replace(/–/g, ' - ') }
    }

    return handleLocalSmartAssistant(messagesHistory)
  } catch (err) {
    console.error('[PilahAI] Ralat penghantaran chat:', err)
    return handleLocalSmartAssistant(messagesHistory)
  }
}

// Formatkan hasil fungsi jika model belum membalas susulan
function formatFunctionResultAsText(funcName, res) {
  if (funcName === 'cekKategoriSampah') {
    if (res.status === 'found') {
      return `Sampah **${res.nama}** masuk ke dalam kategori **${res.kategoriLabel}**.\n\n**Langkah Penanganan:**\n${res.penanganan.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n**Tujuan Penyaluran:** ${res.tujuanPenyaluran}\n*Tips: ${res.tipsPraktis}*`
    }
    return res.pesan
  }

  if (funcName === 'cariFasilitas') {
    return `Berikut fasilitas terdekat yang tersedia:\n\n` + res.fasilitas.map(f => `• **${f.nama}** (${f.jenis})\nAlamat: ${f.alamat} (${f.jarak})\nJam Buka: ${f.jamBuka}\nSampah diterima: ${f.sampahDiterima.join(', ')}`).join('\n\n')
  }

  if (funcName === 'cekJadwal') {
    return `Jadwal pengangkutan sampah di **${res.wilayah}**:\n\n` + res.jadwal.map(j => `• **${j.hari}** (${j.waktu})\nJenis: ${j.jenisSampah}\nCatatan: ${j.catatan}`).join('\n\n')
  }

  if (funcName === 'cariPanduan') {
    if (res?.ringkasanEdukasi) {
      return res.ringkasanEdukasi
    }
    if (res?.panduanKategori) {
      return `Berikut panduan pemilahan untuk **${res.panduanKategori.nama}**:\n\n` +
        `*${res.panduanKategori.ringkasan}*\n\n` +
        `**Langkah Praktis:**\n` +
        res.panduanKategori.langkah.map((l, i) => `${i + 1}. ${l}`).join('\n') +
        `\n\n*Tips Praktis:* ${res.panduanKategori.tips}`
    }
    if (res?.artikel) {
      return `Berikut panduan praktis dari Pilahki:\n\n**${res.artikel.judul}**\n\n` +
        res.artikel.langkah.map((l, i) => `${i + 1}. ${l}`).join('\n')
    }
    return `Kunci pemilahan sampah di rumah tangga:\n\n` +
      `• **Organik (Mudah Membusuk):** Sisa makanan, sayur, buah, daun. Kumpulkan terpisah tanpa plastik dan tiriskan airnya.\n\n` +
      `• **Anorganik (Daur Ulang):** Botol plastik, kardus, kaleng, kaca. Cuci bilas hingga bersih dan keringkan.\n\n` +
      `• **B3 (Berbahaya):** Baterai bekas, bohlam, obat kadaluarsa. Pisahkan khusus untuk Drop Box B3.\n\n` +
      `• **Residu:** Popok, pembalut, sachet kotor. Buang ke tempat sampah umum/TPS.`
  }

  return 'Informasi telah ditemukan di sistem Pilahki.'
}

// ============================================================================
// 4. Pembantu Tempatan Cerdas (Local Smart Fallback)
// Berfungsi penuh walaupun tanpa API Key Gemini dengan memanfaatkan fungsi 4 fitur
// ============================================================================
function handleLocalSmartAssistant(messagesHistory) {
  const latestMessage = messagesHistory[messagesHistory.length - 1]?.text || ''
  const lower = latestMessage.toLowerCase()

  // 1. Semak Soalan Di Luar Domain (PRD Seksyen 7.5 Aturan Ketat)
  const offTopicKeywords = ['politik', 'presiden', 'koding', 'javascript', 'resep martabak', 'asal usul kamu', 'siapa yang buat', 'kenapa aplikasi ini dibuat']
  if (offTopicKeywords.some(w => lower.includes(w))) {
    return {
      text: 'Mohon maaf, saya adalah PilahAI yang khusus dilatih untuk membantu warga seputar pemilahan dan pengelolaan sampah rumah tangga (kategori sampah, fasilitas bank sampah, jadwal angkut, dan panduan edukasi). Ada yang bisa saya bantu terkait sampah di rumah Anda?'
    }
  }

  // 2. Semak Permintaan Jadwal
  if (lower.includes('jadwal') || lower.includes('kapan') || lower.includes('diangkut') || lower.includes('hari apa')) {
    let targetWilayah = 'Sukajadi'
    if (lower.includes('coblong') || lower.includes('dago')) targetWilayah = 'Coblong'
    if (lower.includes('lengkong') || lower.includes('malabar')) targetWilayah = 'Lengkong'
    if (lower.includes('cicendo') || lower.includes('pasirkaliki')) targetWilayah = 'Cicendo'

    const res = toolCekJadwal({ wilayah: targetWilayah })
    return {
      text: `Halo! Berdasarkan data jadwal wilayah **${res.wilayah}**:\n\n` +
        res.jadwal.map(j => `• **${j.hari}** (${j.waktu})\n• **${j.jenisSampah}**\n• *Catatan:* ${j.catatan}`).join('\n\n') +
        `\n\n*TPS Terdekat:* ${res.tpsTerdekat}\nJangan lupa taruh wadah di depan pagar sebelum jam pengangkutan ya!`,
      toolUsed: 'cekJadwal',
      toolData: res
    }
  }

  // 3. Semak Permintaan Lokasi Fasiliti / Bank Sampah
  if (lower.includes('lokasi') || lower.includes('bank sampah') || lower.includes('tps') || lower.includes('dropbox') || lower.includes('buang ke mana') || lower.includes('di mana')) {
    let jenisF = ''
    if (lower.includes('bank sampah')) jenisF = 'bank-sampah'
    if (lower.includes('b3') || lower.includes('baterai') || lower.includes('lampu')) jenisF = 'dropbox-b3'

    const res = toolCariFasilitas({ jenisFasilitas: jenisF })
    return {
      text: `Berikut rekomendasi tempat penyaluran terdekat di wilayah percontohan:\n\n` +
        res.fasilitas.slice(0, 2).map(f => `• **${f.nama}** (${f.jenis})\n  Alamat: ${f.alamat} (sekitar ${f.jarak})\n  Jam Buka: ${f.jamBuka}\n  Menerima: ${f.sampahDiterima.join(', ')}\n  Catatan: ${f.catatan}`).join('\n\n') +
        `\n\nAnda juga bisa membuka menu **Cari Lokasi** untuk petunjuk arah langsung via Google Maps.`,
      toolUsed: 'cariFasilitas',
      toolData: res
    }
  }

  // 4. Semak Kategori Sampah
  // Ekstrak kata nama sampah
  let cleanItemName = latestMessage
    .replace(/(bagaimana|cara|buang|kategori|masuk|apa|ke mana|apakah|bisa|saya|punya|tolong|cek)/gi, '')
    .trim()

  const kategoriResult = toolCekKategoriSampah({ namaSampah: cleanItemName || latestMessage })
  if (kategoriResult.status === 'found') {
    return {
      text: `Untuk **${kategoriResult.nama}**, barang ini masuk kategori **${kategoriResult.kategoriLabel.toUpperCase()}**.\n\n**Langkah Penanganan Praktis:**\n` +
        kategoriResult.penanganan.map((step, idx) => `${idx + 1}. ${step}`).join('\n') +
        `\n\n**Tujuan Penyaluran:** ${kategoriResult.tujuanPenyaluran}\n*Tips Tambahan:* ${kategoriResult.tipsPraktis}`,
      toolUsed: 'cekKategoriSampah',
      toolData: kategoriResult
    }
  }

  // 5. Semak Panduan & Pemilahan Edukasi
  const isOrganik = lower.includes('organik')
  const isAnorganik = lower.includes('anorganik') || lower.includes('nonorganik') || lower.includes('non-organik')
  const isMembedakan = lower.includes('beda') || lower.includes('membedakan') || lower.includes('bedakan')

  if ((isOrganik && isAnorganik) || (isMembedakan && (isOrganik || isAnorganik))) {
    const panduanRes = toolCariPanduan({ topik: 'organik anorganik' })
    return {
      text: panduanRes.ringkasanEdukasi,
      toolUsed: 'cariPanduan',
      toolData: panduanRes
    }
  }

  if (lower.includes('panduan') || lower.includes('tips') || lower.includes('dapur') || lower.includes('bau') || lower.includes('cara')) {
    const panduanRes = toolCariPanduan({ topik: lower })
    let answerText = ''
    if (panduanRes.ringkasanEdukasi) {
      answerText = panduanRes.ringkasanEdukasi
    } else if (panduanRes.artikel) {
      answerText = `**${panduanRes.artikel.judul}**\n\n` + panduanRes.artikel.langkah.map((l, i) => `${i + 1}. ${l}`).join('\n')
    } else if (panduanRes.panduanKategori) {
      answerText = `Berikut panduan pemilahan untuk **${panduanRes.panduanKategori.nama}**:\n\n` +
        `*${panduanRes.panduanKategori.ringkasan}*\n\n` +
        `**Langkah Praktis:**\n` +
        panduanRes.panduanKategori.langkah.map((l, i) => `${i + 1}. ${l}`).join('\n') +
        `\n\n*Tips Praktis:* ${panduanRes.panduanKategori.tips}`
    } else {
      answerText = `Kuncinya di rumah tangga adalah selalu memisahkan sampah basah organik dan sampah kering anorganik. Tiriskan air sisa makanan agar tempat sampah tidak mudah berbau, dan bilas botol/wadah plastik sebelum dikumpulkan!`
    }

    return {
      text: answerText,
      toolUsed: 'cariPanduan',
      toolData: panduanRes
    }
  }

  // Jawapan Laluan Umum Ramah
  return {
    text: `Halo! Saya PilahAI. Anda bisa tanyakan apa saja seputar sampah rumah tangga, misalnya:\n\n` +
      `1. *"Baterai bekas masuk kategori apa dan cara buangnya gimana?"*\n` +
      `2. *"Kapan jadwal truk sampah organik di Sukajadi?"*\n` +
      `3. *"Di mana bank sampah terdekat yang menerima minyak jelantah?"*\n` +
      `4. *"Gimana cara mencuci botol plastik berminyak?"*\n\n` +
      `Silakan ketik pertanyaan Anda!`
  }
}
