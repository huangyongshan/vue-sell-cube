import storage from 'good-storage'

const SELLER_KEY = '__seller__'

export function saveTolocal (id, key, val) {
  const seller = storage.get(SELLER_KEY, {})
  if (!seller[id]) {
    seller[id] = {}
  }
  seller[id][key] = val
  storage.set(SELLER_KEY, seller)
}

export function loadFromLocal (id, key, def) {
  const seller = storage.get(SELLER_KEY, {})
  return seller[id] ? (seller[id][key] || def) : def
}
