export const storage = {
list(key) { return JSON.parse(localStorage.getItem(key) || '[]') },
get(key) { return JSON.parse(localStorage.getItem(key) || 'null') },
set(key, val) { localStorage.setItem(key, JSON.stringify(val)) },
push(key, item) { const a = JSON.parse(localStorage.getItem(key) || '[]'); a.unshift(item); localStorage.setItem(key, JSON.stringify(a)); }
}