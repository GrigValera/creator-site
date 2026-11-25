import { formatEstimate } from './estimate.ts'

export const stepLabels = {
  goal: 'Цель', site: 'Сайт', project: 'Состав', extras: 'Опции', scope: 'Задача', result: 'Оценка',
}
export const siteFields = [
  { name: 'address', label: 'Адрес сайта', hint: 'Например, example.ru', maxLength: 300 },
  { name: 'problem', label: 'Что сейчас не устраивает?', hint: 'Например, на телефоне трудно оставить заявку', maxLength: 600 },
  { name: 'outcome', label: 'Какой результат нужен?', hint: 'Например, чтобы заявки с телефона приходили в CRM', maxLength: 600 },
]
export const scopeFields = [
  { name: 'workflow', label: 'Что должен уметь проект?', hint: 'Например, собирать заявки и назначать ответственного', maxLength: 300 },
  { name: 'systems', label: 'С какими системами и данными он будет работать?', hint: 'Например, сайт, CRM, каталог товаров или таблица', maxLength: 300 },
  { name: 'priority', label: 'Что нужно запустить в первую очередь?', hint: 'Например, передачу новых заявок из формы', maxLength: 300 },
]

function isSiteAddress(value) {
  if (!value || /\s/.test(value)) return false
  try {
    const address = new URL(value.includes('://') ? value : `https://${value}`)
    return ['http:', 'https:'].includes(address.protocol) && !address.username && !address.password
  } catch {
    return false
  }
}

export function findInvalidSiteField(site) {
  return siteFields.find(({ name }) => !site[name]?.trim() ||
    (name === 'address' && !isSiteAddress(site.address.trim())))?.name ?? ''
}

export function describeOption(item) {
  return `${item.name} — ${item.price ? formatEstimate(item.price) : 'оценивается отдельно'}`
}

export function createBrief({ route, result, site, scope, needsScope, projectTotal }) {
  const isRedesign = route.id === 'redesign'
  const content = [
    route.name,
    ...(isRedesign ? [
      `Адрес сайта: ${site.address.trim()}`,
      `Проблема: ${site.problem.trim()}`,
      `Желаемый результат: ${site.outcome.trim()}`,
    ] : []),
    describeOption(result.project),
    ...result.options.map(describeOption),
    ...(needsScope ? scopeFields.flatMap(({ name, label }) => scope[name]?.trim()
      ? [`${label} ${scope[name].trim()}`] : []) : []),
    `Ориентир: ${projectTotal}`,
    result.total ? 'Цена справочная. Стоимость уточняется после обсуждения задачи.' : '',
    result.total && result.separate.length ? 'Позиции без указанной цены оцениваются отдельно.' : '',
  ].filter(Boolean).join('\n')
  return { content, project: result.project.name, range: projectTotal }
}
