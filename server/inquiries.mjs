const MAX_BODY = 16_384

function response(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(body))
}

async function readSubmission(req) {
  if (req.body && typeof req.body === 'object') return req.body
  let body = ''
  for await (const chunk of req) {
    body += chunk
    if (Buffer.byteLength(body) > MAX_BODY) return null
  }
  return JSON.parse(body)
}

function validatedSubmission(payload) {
  if (!payload || Array.isArray(payload) || typeof payload !== 'object') return null
  const { contact, task, estimate } = payload
  if ([contact, task, estimate].some(value => typeof value !== 'string')) return null
  const lead = { contact: contact.trim(), task: task.trim(), estimate: estimate.trim() }
  if (lead.contact.length < 3 || lead.contact.length > 180 || lead.task.length > 2500 || lead.estimate.length > 4200) return null
  if (!lead.task && !lead.estimate) return null
  return lead
}

export function createInquiryHandler({ webhook, demo = false } = {}) {
  return async function handleInquiry(req, res) {
    if (req.method !== 'POST') return response(res, 405, { error: 'Метод не поддерживается.' })
    if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) {
      return response(res, 415, { error: 'Ожидается заявка в формате JSON.' })
    }

    let lead
    try {
      lead = validatedSubmission(await readSubmission(req))
    } catch {
      return response(res, 400, { error: 'Не удалось прочитать заявку.' })
    }
    if (!lead) return response(res, 400, { error: 'Проверьте контакт и описание задачи.' })
    if (!webhook) {
      return demo
        ? response(res, 200, { ok: true, mode: 'demo' })
        : response(res, 503, { error: 'Онлайн-отправка пока недоступна. Скачайте бриф.' })
    }

    try {
      const target = new URL(webhook)
      if (target.protocol !== 'https:') throw new Error('Expected HTTPS')
      const delivery = await fetch(target, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(7000),
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead),
      })
      if (delivery.ok) return response(res, 200, { ok: true, mode: 'delivered' })
    } catch {
      // A failed delivery leaves the visitor's input in the form for retry or download.
    }
    return response(res, 502, { error: 'Заявка не доставлена. Повторите отправку или скачайте бриф.' })
  }
}
