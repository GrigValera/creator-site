import assert from 'node:assert/strict'
import { test } from 'node:test'
import { estimate, formatEstimate, routes } from '../src/features/estimate/estimate.ts'
import { createBrief, findInvalidSiteField } from '../src/features/estimate/wizardModel.js'

const existingSite = { address: 'example.test', problem: 'Форма трудна на телефоне', outcome: 'Быстрая заявка' }

test('adds priced options and excludes options for a different project', () => {
  const route = routes.find(item => item.id === 'new')
  const result = estimate(route, 'landing', ['payment', 'analytics', 'hosting'])

  assert.deepEqual(result.total, [71, 120])
  assert.equal(formatEstimate(result.total).replaceAll(/\s/g, ' '), 'от 71 000 ₽')
  assert.deepEqual(result.options.map(item => item.id), ['analytics', 'hosting'])
  assert.equal(result.recurring, true)
  assert.deepEqual(result.separate.map(item => item.id), ['hosting'])
})

test('validates redesign fields and transfers them into the inquiry brief', () => {
  assert.equal(findInvalidSiteField({ ...existingSite, address: 'ftp://example.test' }), 'address')
  assert.equal(findInvalidSiteField({ ...existingSite, problem: ' ' }), 'problem')
  assert.equal(findInvalidSiteField(existingSite), '')

  const route = routes.find(item => item.id === 'redesign')
  const result = estimate(route, 'refresh', [])
  const brief = createBrief({ route, result, site: existingSite, scope: {}, needsScope: false, projectTotal: formatEstimate(result.total) })

  assert.match(brief.content, /Адрес сайта: example\.test/)
  assert.ok(brief.content.includes(existingSite.outcome))
  assert.equal(brief.project, 'Обновить дизайн')
  assert.match(brief.content, /Ориентир: от 45\s000\s₽/)
})

test('keeps individually priced automation and includes only filled scope fields', () => {
  const route = routes.find(item => item.id === 'automation')
  const result = estimate(route, 'integrate', ['crm'])
  const brief = createBrief({ route, result, site: {}, scope: { workflow: ' Передавать заявки ', priority: ' ' }, needsScope: true, projectTotal: formatEstimate(result.total) })

  assert.equal(brief.range, 'Индивидуальная оценка')
  assert.match(brief.content, /Что должен уметь проект\? Передавать заявки/)
  assert.doesNotMatch(brief.content, /Что нужно запустить в первую очередь/)
})
