// One two-stage product every three seconds, shared by map and detail consumers.
let nextSlot = 0
export const scheduleProduct = () => {
  const now = Date.now()
  const start = Math.max(now, nextSlot)
  nextSlot = start + 3000
  return new Promise(resolve => setTimeout(resolve, start - now))
}
