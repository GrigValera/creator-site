import assert from 'node:assert/strict'
import { test } from 'node:test'
import { requestInquiry } from '../src/features/inquiry/inquiryClient.js'
import { formatBrief, validateInquiry } from '../src/features/inquiry/inquiryModel.js'

const submission = { contact: 'audit@example.test', task: 'Описание задачи', estimate: '' }

test('accepts either a task or an attached estimate and rejects missing contact', () => {
  assert.equal(validateInquiry({ ...submission, contact: 'a' }).name, 'contact')
  assert.equal(validateInquiry({ ...submission, task: '' }).name, 'task')
  assert.equal(validateInquiry(submission), null)
  assert.equal(validateInquiry({ ...submission, task: '', estimate: 'Расчёт лендинга' }), null)
})

test('formats a downloadable brief with all provided sections', () => {
  const text = formatBrief({ ...submission, brief: { content: 'Расчёт лендинга' } })
  assert.match(text, /Контакт\naudit@example\.test/)
  assert.match(text, /Расчёт\nРасчёт лендинга/)
  assert.match(text, /Задача\nОписание задачи/)
})

test('sends the same endpoint and preserves the delivery ID and receipt on retry', async t => {
  const attempt = { id: 'attempt-id', receipt: 'signed-receipt' }
  const mocked = t.mock.method(globalThis, 'fetch', async (_url, init) => {
    assert.equal(init.method, 'POST')
    assert.deepEqual(JSON.parse(init.body), { ...submission, deliveryId: attempt.id, deliveryReceipt: attempt.receipt })
    return Response.json({ ok: true, mode: 'delivered' })
  })

  assert.deepEqual(await requestInquiry(submission, attempt), { responseOk: true, result: { ok: true, mode: 'delivered' } })
  assert.equal(mocked.mock.calls[0].arguments[0], '/api/inquiries')
})
