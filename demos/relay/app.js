const key = 'creator-relay-v1'
const samples = [
  { name: 'Лида Романова', source: 'Форма сайта', subject: 'Подключить заявки с нового лендинга' },
  { name: 'Илья Лавров', source: 'Чат-бот', subject: 'Уточнить условия обслуживания' },
  { name: 'Алла Морозова', source: 'Электронная почта', subject: 'Запросить расчёт для магазина' },
]
const routes = { queue: 'Очередь заявок', rules: 'Маршрутизация', history: 'История событий' }
const queues = ['Продажи', 'Поддержка']
const view = document.querySelector('#view')
const status = document.querySelector('#status')
const heading = document.querySelector('#page-title')
const time = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' })
const initial = { next: 3, leads: samples.slice(0, 2).map((lead, index) => ({ ...lead, id: index + 1, queue: queues[index], done: false })), rules: Object.fromEntries(samples.map((lead, index) => [lead.source, queues[index % queues.length]])), events: [] }
let state = initial
try {
  const saved = JSON.parse(localStorage.getItem(key) || 'null')
  if (Array.isArray(saved?.leads) && Array.isArray(saved?.events) && saved?.rules && Number.isInteger(saved?.next)) state = saved
} catch { /* The default queue also works with empty local storage. */ }

function save(next, message) {
  state = next
  try { localStorage.setItem(key, JSON.stringify(state)) }
  catch { message += ' Сохранение в браузере недоступно.' }
  status.textContent = message
  render()
}

function element(tag, text, className) {
  const node = document.createElement(tag)
  if (text) node.textContent = text
  if (className) node.className = className
  return node
}

function renderQueue() {
  const active = state.leads.filter(lead => !lead.done)
  const summary = element('div', '', 'metrics')
  for (const [label, count] of [['В очереди', active.length], ['Передано в CRM', state.leads.length - active.length]]) {
    const tile = element('div', '', 'panel metric')
    tile.append(element('span', label), element('strong', String(count)))
    summary.append(tile)
  }
  view.append(summary)
  if (!active.length) return view.append(element('p', 'Очередь пуста. Получите тестовую заявку, чтобы продолжить.', 'panel empty'))
  const list = element('ul', '', 'queue')
  for (const lead of active) {
    const item = element('li', '', 'panel item')
    const details = element('div')
    details.append(element('p', `${lead.source} · ${lead.queue}`, 'metadata'), element('h2', lead.subject), element('p', lead.name, 'metadata'))
    const action = element('button', 'Передать в CRM', 'subtle')
    action.type = 'button'
    action.setAttribute('aria-label', `Передать в CRM: ${lead.subject}`)
    action.addEventListener('click', () => {
      const leads = state.leads.map(item => item.id === lead.id ? { ...item, done: true } : item)
      const events = [{ lead: lead.id, name: lead.name, text: `Передано · ${lead.queue}`, at: Date.now() }, ...state.events]
      save({ ...state, leads, events }, `Заявка №${lead.id} передана в демо-CRM.`)
      heading.focus()
    })
    item.append(details, action)
    list.append(item)
  }
  view.append(list)
}

function renderRules() {
  const panel = element('form', '', 'panel rules')
  panel.append(element('h2', 'Куда направлять новые заявки'), element('p', 'Выберите очередь для каждого источника. Правило применяется к следующим заявкам.', 'metadata'))
  for (const { source } of samples) {
    const label = element('label', source)
    const select = element('select')
    select.name = source
    select.append(...queues.map(queue => new Option(queue, queue)))
    select.value = state.rules[source]
    label.append(select)
    panel.append(label)
  }
  const submit = element('button', 'Сохранить правила')
  submit.type = 'submit'
  panel.append(submit)
  panel.addEventListener('submit', event => {
    event.preventDefault()
    const rules = Object.fromEntries(new FormData(panel))
    save({ ...state, rules }, 'Правила сохранены.')
    heading.focus()
  })
  view.append(panel)
}

function renderHistory() {
  if (!state.events.length) return view.append(element('p', 'Событий пока нет. Получите или передайте тестовую заявку.', 'panel empty'))
  const list = element('ul', '', 'queue')
  for (const event of state.events) {
    const item = element('li', '', 'panel item')
    item.append(element('strong', `№${event.lead} · ${event.name}`), element('span', event.text), element('time', time.format(event.at), 'metadata'))
    list.append(item)
  }
  view.append(list)
}

function render() {
  const slug = location.hash.slice(1)
  const page = Object.hasOwn(routes, slug) ? slug : 'queue'
  heading.textContent = routes[page]
  document.querySelectorAll('nav a').forEach(link => {
    if (link.hash === `#${page}`) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  })
  view.replaceChildren()
  const views = { queue: renderQueue, rules: renderRules, history: renderHistory }
  views[page]()
}

document.querySelector('#seed').addEventListener('click', () => {
  const sample = samples[(state.next - 1) % samples.length]
  const lead = { ...sample, id: state.next, queue: state.rules[sample.source], done: false }
  const events = [{ lead: lead.id, name: lead.name, text: `Получено · ${lead.source}`, at: Date.now() }, ...state.events]
  save({ ...state, next: state.next + 1, leads: [lead, ...state.leads], events }, `Заявка №${lead.id} поступила в очередь «${lead.queue}».`)
  if (location.hash !== '#queue') location.hash = 'queue'
})
heading.tabIndex = -1
window.addEventListener('hashchange', () => { render(); heading.focus() })
render()
