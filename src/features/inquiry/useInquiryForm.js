import { useRef, useState } from 'react'
import { requestInquiry } from './inquiryClient'
import { validateInquiry } from './inquiryModel'

export function useInquiryForm(brief) {
  const [status, setStatus] = useState({ text: '', error: false })
  const [pending, setPending] = useState(false)
  const [fieldError, setFieldError] = useState(null)
  const sending = useRef(false)
  const delivery = useRef(null)

  function getSubmission(form) {
    const data = new FormData(form)
    return { contact: String(data.get('contact') ?? '').trim(), task: String(data.get('task') ?? '').trim(), estimate: brief?.content ?? '' }
  }

  async function send(event) {
    event.preventDefault()
    if (sending.current) return
    const form = event.currentTarget
    const submission = getSubmission(form)
    const invalid = validateInquiry(submission)
    setFieldError(invalid)
    if (invalid) {
      setStatus({ text: '', error: false })
      const field = form.elements.namedItem(invalid.name)
      field.focus()
      return
    }
    const fingerprint = JSON.stringify(submission)
    if (delivery.current?.fingerprint !== fingerprint) {
      delivery.current = { fingerprint, id: globalThis.crypto?.randomUUID?.(), receipt: undefined }
    }
    const attempt = delivery.current
    if (attempt.completed) {
      setStatus({ text: 'Эта заявка уже отправлена.', error: false })
      return
    }
    sending.current = true
    setPending(true)
    setStatus({ text: 'Отправляем заявку…', error: false })
    try {
      const { responseOk, result } = await requestInquiry(submission, attempt)
      if (typeof result?.deliveryReceipt === 'string' && typeof result.deliveryId === 'string') {
        attempt.id = result.deliveryId
        attempt.receipt = result.deliveryReceipt
      }
      if (!responseOk || !result?.ok) throw new Error(result?.error || 'Не удалось отправить заявку. Повторите попытку.')
      attempt.completed = result.mode !== 'demo'
      setStatus({ text: result.mode === 'demo' ? 'Тестовая заявка принята. Внешняя доставка не настроена.' : 'Заявка отправлена.', error: false })
    } catch (error) {
      const message = error.name === 'TimeoutError' || error instanceof TypeError
        ? 'Не удалось связаться с сервером. Повторите попытку.'
        : error.message
      setStatus({ text: message, error: true })
    } finally {
      sending.current = false
      setPending(false)
    }
  }

  function clearFieldError(event) {
    if (fieldError?.name === event.currentTarget.name) setFieldError(null)
  }

  return { status, pending, fieldError, send, clearFieldError }
}
