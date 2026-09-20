<script setup>
import { ref, onMounted } from 'vue'
import { X, MapPin, Check } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'domicile-updated'])

const districts = [
  "Panakkukang",
  "Rappocini",
  "Ujung Pandang",
  "Tamalanrea",
  "Bontoala",
  "Mariso",
  "Manggala",
  "Tamalate"
]

const city = ref('Kota Makassar')
const selectedDistrict = ref('Panakkukang')
const detailAddress = ref('')

onMounted(() => {
  try {
    const raw = localStorage.getItem('pilahki_domicile')
    if (raw) {
      const d = JSON.parse(raw)
      city.value = d.city || 'Kota Makassar'
      selectedDistrict.value = d.district || 'Panakkukang'
      detailAddress.value = d.detail || ''
    }
  } catch (e) {}
})

const handleSave = () => {
  const newDomicile = {
    city: city.value,
    district: selectedDistrict.value,
    detail: detailAddress.value.trim()
  }
  localStorage.setItem('pilahki_domicile', JSON.stringify(newDomicile))
  localStorage.removeItem('pilahki_is_new_user')
  emit('domicile-updated', newDomicile)
  emit('close')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-150 border border-slate-100">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div class="flex items-center gap-2 text-brand-900 font-extrabold text-lg">
          <MapPin class="w-5 h-5 text-brand-600" />
          <span>Atur Domisili Makassar</span>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <p class="text-xs text-slate-500 leading-relaxed">
        Pilih kecamatan tempat tinggal Anda di Kota Makassar agar jadwal pengangkutan dan rekomendasi Bank Sampah terdekat dapat ditampilkan secara akurat.
      </p>

      <form @submit.prevent="handleSave" class="space-y-4 text-left">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Kota</label>
          <input
            v-model="city"
            type="text"
            readonly
            class="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Kecamatan</label>
          <select
            v-model="selectedDistrict"
            class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option v-for="d in districts" :key="d" :value="d">Kecamatan {{ d }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Detail Kelurahan / RT / RW (Opsional)</label>
          <input
            v-model="detailAddress"
            type="text"
            placeholder="Contoh: Kelurahan Pandang, RT 02 / RW 04"
            class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div class="pt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold shadow-sm cursor-pointer"
          >
            Simpan Domisili
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
