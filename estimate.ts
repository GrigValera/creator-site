type Range = readonly [number, number]
type Option = { id: string; name: string; detail?: string; price?: Range; review?: boolean }
type Route = {
  id: string
  name: string
  detail: string
  projectLabel: string
  projects: readonly Option[]
  extras: readonly Option[]
}

const analytics: Option = { id: 'analytics', name: 'Расширенная аналитика', price: [12, 25] }
const content: Option = { id: 'content', name: 'Тексты и наполнение', price: [15, 45] }
const hosting: Option = { id: 'hosting', name: 'Домен, хостинг или поддержка' }
const crm: Option = { id: 'crm', name: 'Передача заявок в CRM', price: [20, 45] }
const bot: Option = { id: 'bot', name: 'Чат-бот или помощник', review: true }
const sync: Option = { id: 'market', name: 'Интеграция с Wildberries или Ozon', review: true }
const question: Option = { id: 'help', name: 'Нужна консультация', review: true }

export const routes: readonly Route[] = [
  {
    id: 'new', name: 'Создать сайт', detail: 'Лендинг, сайт услуг или магазин',
    projectLabel: 'Какой сайт вам нужен?',
    projects: [
      { id: 'landing', name: 'Лендинг', detail: 'Одна страница для услуги или продукта', price: [59, 95] },
      { id: 'services', name: 'Сайт услуг', detail: 'Несколько страниц, каталог или запись', price: [99, 180] },
      { id: 'shop', name: 'Интернет-магазин', detail: 'Каталог, корзина и оформление заказа', price: [159, 300] },
      question,
    ],
    extras: [crm, bot, sync, { id: 'payment', name: 'Подключение онлайн-оплаты', price: [20, 50] }, { id: 'delivery', name: 'Подключение доставки', price: [20, 50] }, analytics, content, hosting, question],
  },
  {
    id: 'redesign', name: 'Обновить сайт', detail: 'Редизайн, доработка или перенос',
    projectLabel: 'Что нужно изменить в первую очередь?',
    projects: [
      { id: 'refresh', name: 'Обновить дизайн', detail: 'Дизайн, мобильная версия и доработка страниц', price: [45, 120] },
      { id: 'speed', name: 'Ускорить и доработать', detail: 'Производительность, структура и формы', review: true },
      { id: 'migration', name: 'Перенести сайт', detail: 'Контент и данные на новую платформу', review: true },
      question,
    ],
    extras: [crm, bot, sync, analytics, content, hosting, question],
  },
  {
    id: 'automation', name: 'Автоматизировать работу', detail: 'Интеграции, боты и внутренние сервисы',
    projectLabel: 'Какую задачу хотите решить?',
    projects: [
      { id: 'integrate', name: 'Связать системы', detail: 'CRM, маркетплейсы, учёт или API', review: true },
      { id: 'app', name: 'Создать веб-приложение', detail: 'Мини-CRM, личный кабинет или рабочий инструмент', review: true },
      { id: 'process', name: 'Описать и оцифровать процессы', detail: 'Разобрать текущие задачи, роли и данные', review: true },
      question,
    ],
    extras: [
      { id: 'orders', name: 'Передавать заказы или заявки', review: true },
      { id: 'inventory', name: 'Обновлять остатки и цены', review: true },
      { id: 'database', name: 'Подключить или спроектировать базу данных', review: true },
      bot, hosting, question,
    ],
  },
]

export function estimate(route: Route, projectId: string, extras: readonly string[]) {
  const project = route.projects.find(item => item.id === projectId)
  const options = route.extras.filter(item => extras.includes(item.id))
  let total: Range | undefined = project?.price
  if (total) {
    for (const item of options) {
      if (item.price) total = [total[0] + item.price[0], total[1] + item.price[1]]
    }
  }
  const review = !total || options.some(item => item.review)
  return { project, options, total, review, recurring: options.some(item => item.id === 'hosting') }
}

const rubles = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })
export function formatEstimate(total?: Range) {
  return total ? `${rubles.format(total[0] * 1000)}–${rubles.format(total[1] * 1000)}` : 'Индивидуальная оценка'
}

export function formatFrom(route: Route, projectId: string) {
  const price = estimate(route, projectId, []).total?.[0]
  return price === undefined ? 'По задаче' : `от ${rubles.format(price * 1000)}`
}
