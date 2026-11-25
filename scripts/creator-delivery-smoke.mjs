import { createServer } from 'node:http'
import handleInquiry from '../api/inquiries.js'

if (process.env.VERCEL_ENV !== 'preview' || process.env.VERCEL_GIT_COMMIT_REF !== 'work/landing-journey-review') {
  console.log('CREATOR delivery smoke: skipped outside review preview')
  process.exit(0)
}

const names = {
  CREATOR_TELEGRAM_BOT_TOKEN: /^\d+:[\w-]+$/,
  CREATOR_TELEGRAM_CHAT_ID: /^-?\d+$/,
  CREATOR_RESEND_API_KEY: /^re_[\w-]+$/,
  CREATOR_EMAIL_FROM: /@/,
  CREATOR_EMAIL_TO: /@/,
}
const checks = Object.entries(names).map(([name, pattern]) => {
  const config = process.env[name]
  return [name, !config ? 'missing' : pattern.test(config) ? 'present' : pattern.test(config.trim()) ? 'extra whitespace' : 'invalid format']
})
for (const [name, state] of checks) console.log('CREATOR delivery config: ' + name + '=' + state)

const server = createServer(handleInquiry)
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const endpoint = 'http://127.0.0.1:' + server.address().port + '/api/inquiries'
const tests = [
  { label: 'direct', contact: 'creator-control@example.test', task: 'Контрольная заявка CREATOR SD24-01. Прямое обращение.', estimate: '', deliveryId: '2ffc3053-0421-4834-80a9-fa5217052401' },
  { label: 'estimate', contact: 'creator-control@example.test', task: '', estimate: 'Контрольная заявка CREATOR SD24-02. Лендинг. Предварительная оценка: 59 000–95 000 ₽.', deliveryId: '2ffc3053-0421-4834-80a9-fa5217052402' },
]
try {
  for (const { label, ...body } of tests) {
    const res = await fetch(endpoint, {
      method: 'POST', signal: AbortSignal.timeout(9500),
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    const result = await res.json()
    const outcome = res.ok && result.mode === 'delivered' ? 'both accepted'
      : result.deliveryReceipt ? 'email accepted, Telegram failed'
      : res.status === 503 ? 'delivery settings missing'
      : res.status === 502 ? 'email not accepted' : 'unexpected response'
    console.log('CREATOR delivery smoke ' + label + ': HTTP ' + res.status + ' ' + outcome)
    if (outcome !== 'both accepted') break
  }
} catch {
  console.log('CREATOR delivery smoke: local HTTP test failed')
} finally {
  await new Promise(resolve => server.close(resolve))
}
