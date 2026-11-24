const MAX_BODY = 32_768

function response(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(body))
}

async function readSubmission(req) {
  if (req.body && typeof req.body === 'object') return req.body
  const chunks = []
  let bytes = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    bytes += buffer.length
    if (bytes > MAX_BODY) return null
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks, bytes).toString('utf8'))
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

export function createInquiryHandler({ webhook, deliver, demo = false } = {}) {
  return async function handleInquiry(req, res) {
    if (req.method !== 'POST') return response(res, 405, { error: 'Метод не поддерживается.' })
    if (!req.headers['content-type']?.toLowerCase().startsWith('application/json')) {
      return response(res, 415, { error: 'Ожидается заявка в формате JSON.' })
    }

    let payload
    try {
      payload = await readSubmission(req)
    } catch {
      return response(res, 400, { error: 'Не удалось прочитать заявку.' })
    }
    const lead = validatedSubmission(payload)
    if (!lead) return response(res, 400, { error: 'Проверьте контакт и описание задачи.' })
    if (!webhook && !deliver) {
      return demo
        ? response(res, 200, { ok: true, mode: 'demo' })
        : response(res, 503, { error: 'Онлайн-отправка пока недоступна. Скачайте бриф.' })
    }

    try {
      if (deliver) {
        const result = await deliver(lead, { id: payload.deliveryId, receipt: payload.deliveryReceipt })
        if (result.delivered) return response(res, 200, { ok: true, mode: 'delivered' })
        if (result.receipt) return response(res, 502, {
          error: 'Почтовый сервис принял заявку. Telegram пока не подтвердил отправку. Повторите попытку.',
          deliveryReceipt: result.receipt,
          deliveryId: result.id,
        })
        return response(res, 502, { error: 'Почтовый сервис не подтвердил приём. Повторите отправку или скачайте бриф.' })
      }
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
