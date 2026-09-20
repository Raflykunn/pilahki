import { ref } from 'vue'

const defaultDomicile = {
  city: 'Kota Makassar',
  district: 'Panakkukang',
  detail: ''
}

function loadSavedDomicile() {
  try {
    const raw = localStorage.getItem('pilahki_domicile')
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        city: parsed.city || defaultDomicile.city,
        district: parsed.district || defaultDomicile.district,
        detail: parsed.detail || ''
      }
    }
  } catch (e) {}
  return { ...defaultDomicile }
}

const currentDomicile = ref(loadSavedDomicile())

export function useDomicile() {
  const setDomicile = (newDomicile) => {
    currentDomicile.value = {
      ...currentDomicile.value,
      ...newDomicile
    }
    localStorage.setItem('pilahki_domicile', JSON.stringify(currentDomicile.value))
    localStorage.removeItem('pilahki_is_new_user')
    window.dispatchEvent(new CustomEvent('pilahki-domicile-changed', { detail: currentDomicile.value }))
  }

  return {
    domicile: currentDomicile,
    setDomicile
  }
}
