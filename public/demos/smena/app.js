const lessons = {
  cup: { name: 'Первая чашка', dates: [[1, '12:00'], [3, '16:30']] },
  wheel: { name: 'Гончарный круг', dates: [[2, '14:00'], [5, '18:30']] },
  evening: { name: 'Вечер лепки', dates: [[3, '19:00'], [6, '19:00']] },
}
const storageKey = 'creator-smena-reservations'
const form = document.querySelector('#booking-form')
const lesson = document.querySelector('#lesson')
const session = document.querySelector('#session')
const guest = document.querySelector('#guest')
const status = document.querySelector('#booking-status')
const reservations = document.querySelector('#reservations')
const dateLabel = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', month: 'long', day: 'numeric' })
let bookings = []
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
  if (Array.isArray(saved)) bookings = saved.filter(item => typeof item?.slot === 'string' && typeof item?.label === 'string' && typeof item?.guest === 'string')
} catch { /* Start with an empty schedule if browser storage is unavailable. */ }

const schedule = Object.fromEntries(Object.entries(lessons).map(([key, item]) => [key, item.dates.map(([offset, time]) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return { slot: `${key}-${date.toDateString()}-${time}`, label: `${dateLabel.format(date)} · ${time}` }
})]))

function save(next) {
  try { localStorage.setItem(storageKey, JSON.stringify(next)) }
  catch { status.textContent = 'Браузер не разрешил сохранить запись.'; return false }
  bookings = next
  return true
}

function render() {
  const currentSlot = session.value
  const remaining = schedule[lesson.value].filter(item => !bookings.some(booking => booking.slot === item.slot))
  session.replaceChildren(...remaining.map(item => new Option(item.label, item.slot)))
  if (remaining.some(item => item.slot === currentSlot)) session.value = currentSlot
  if (!remaining.length) session.add(new Option('Свободных мест нет', ''))
  form.querySelector('[type=submit]').disabled = !remaining.length
  reservations.replaceChildren()
  for (const booking of bookings) {
    const row = document.createElement('div')
    const text = document.createElement('p')
    const cancel = document.createElement('button')
    text.textContent = `${booking.guest} · ${booking.label}`
    cancel.type = 'button'
    cancel.textContent = 'Отменить'
    cancel.setAttribute('aria-label', `Отменить запись: ${booking.label}`)
    cancel.addEventListener('click', () => {
      if (!save(bookings.filter(item => item.slot !== booking.slot))) return
      status.textContent = 'Запись отменена.'
      render()
      session.focus()
    })
    row.append(text, cancel)
    reservations.append(row)
  }
}

document.querySelectorAll('[data-class]').forEach(link => link.addEventListener('click', () => {
  lesson.value = link.dataset.class
  render()
  lesson.focus({ preventScroll: true })
}))
lesson.addEventListener('change', render)
form.addEventListener('submit', event => {
  event.preventDefault()
  const selected = schedule[lesson.value].find(item => item.slot === session.value)
  const name = guest.value.trim()
  if (!name || !selected || bookings.some(item => item.slot === selected.slot)) {
    status.textContent = 'Введите имя и выберите свободное время.'
    return
  }
  if (!save([...bookings, { slot: selected.slot, label: `${lessons[lesson.value].name}, ${selected.label}`, guest: name }])) return
  status.textContent = `Вы записаны. ${lessons[lesson.value].name}, ${selected.label}.`
  guest.value = ''
  render()
})
render()
