<script setup>
import { ref, watch } from 'vue'
import { X, MapPin } from 'lucide-vue-next'
import { useDomicile } from '@/composables/useDomicile'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'domicile-updated'])
const { domicile, setDomicile } = useDomicile()

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

const city = ref(domicile.value.city)
const selectedDistrict = ref(domicile.value.district)
const detailAddress = ref(domicile.value.detail)

watch(() => props.isOpen, (open) => {
  if (open) {
    city.value = domicile.value.city || 'Kota Makassar'
    selectedDistrict.value = domicile.value.district || 'Panakkukang'
    detailAddress.value = domicile.value.detail || ''
  }
})

const handleSave = () => {
  const newDomicile = {
    city: city.value,
    district: selectedDistrict.value,
    detail: detailAddress.value.trim()
  }
  setDomicile(newDomicile)
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
