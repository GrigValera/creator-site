import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

const UUID = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i
const RECEIPT = /^(\d{13})\.([\da-f]{64})$/
const RECEIPT_AGE = 24 * 60 * 60 * 1000
const SUBJECT = 'Новая заявка CREATOR'

export function createChannelDelivery(env, send = fetch) {
  const bot = env.CREATOR_TELEGRAM_BOT_TOKEN
  const chat = env.CREATOR_TELEGRAM_CHAT_ID
  const key = env.CREATOR_RESEND_API_KEY
  const from = env.CREATOR_EMAIL_FROM
  const to = env.CREATOR_EMAIL_TO
  if (!/^\d+:[\w-]+$/.test(bot ?? '') || !/^-?\d+$/.test(chat ?? '') || !key || !from || !to) return null

  function signature(scope, data) {
    return createHmac('sha256', key).update(scope).update('\0').update(data).digest('hex')
  }

  function validEmailReceipt(value, submission, now) {
    const [, expires, mac] = typeof value === 'string' ? RECEIPT.exec(value) ?? [] : []
    if (!expires || Number(expires) <= now) return false
    return timingSafeEqual(Buffer.from(mac, 'hex'), Buffer.from(signature('email-receipt', expires + '.' + submission), 'hex'))
  }

  return async function deliver(lead, { id, receipt } = {}) {
    const reference = typeof id === 'string' && UUID.test(id) ? id : randomUUID()
    const submission = JSON.stringify([reference, lead, from, to, chat])
    const now = Date.now()
    const signal = AbortSignal.timeout(7500)
    const text = [
      SUBJECT,
      'Контакт: ' + lead.contact,
      lead.task && 'Задача:\n' + lead.task,
      lead.estimate && 'Расчёт:\n' + lead.estimate,
    ].filter(Boolean).join('\n\n')

    if (!validEmailReceipt(receipt, submission, now)) {
      try {
        const email = await send('https://api.resend.com/emails', {
          method: 'POST', redirect: 'error', signal,
          headers: {
            Authorization: 'Bearer ' + key,
            'Content-Type': 'application/json',
            'Idempotency-Key': 'creator/' + signature('resend-key', submission),
          },
          body: JSON.stringify({ from, to: [to], subject: SUBJECT, text }),
        })
        if (!email.ok || typeof (await email.json()).id !== 'string') return { delivered: false }
        const expires = String(now + RECEIPT_AGE)
        receipt = expires + '.' + signature('email-receipt', expires + '.' + submission)
      } catch {
        return { delivered: false }
      }
    }

    try {
      const long = text.length > 4096
      const method = long ? 'sendDocument' : 'sendMessage'
      const body = long ? new FormData() : JSON.stringify({ chat_id: chat, text, link_preview_options: { is_disabled: true } })
      if (long) {
        body.set('chat_id', chat)
        body.set('caption', SUBJECT)
        body.set('document', new Blob([text], { type: 'text/plain;charset=utf-8' }), 'creator-inquiry.txt')
      }
      const telegram = await send('https://api.telegram.org/bot' + bot + '/' + method, {
        method: 'POST', redirect: 'error', signal, body,
        headers: long ? undefined : { 'Content-Type': 'application/json' },
      })
      if (telegram.ok && (await telegram.json()).ok === true) return { delivered: true }
    } catch {
      // The signed receipt allows the form to retry Telegram after Resend accepted the email.
    }
    return { delivered: false, receipt, id: reference }
  }
}
