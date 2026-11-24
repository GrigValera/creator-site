import { useState } from 'react'
import styles from './App.module.css'

function downloadBrief(content) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
  const download = document.createElement('a')
  download.href = url
  download.download = 'creator-brief.txt'
  document.body.append(download)
  download.click()
  download.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function Contact({ brief }) {
  const [status, setStatus] = useState({ text: '', error: false })
  const [pending, setPending] = useState(false)
  const [fieldError, setFieldError] = useState(null)

  function getSubmission(form) {
    const data = new FormData(form)
    return { contact: String(data.get('contact') ?? '').trim(), task: String(data.get('task') ?? '').trim(), estimate: brief?.content ?? '' }
  }

  async function send(event) {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    const submission = getSubmission(form)
    const invalid = submission.contact.length < 3
      ? { name: 'contact', text: 'Укажите телефон, почту или Telegram.' }
      : !submission.task && !submission.estimate
        ? { name: 'task', text: 'Коротко опишите, что нужно сделать.' }
        : null
    setFieldError(invalid)
    if (invalid) {
      setStatus({ text: '', error: false })
      const field = form.elements.namedItem(invalid.name)
      field.focus()
      return
    }
    setPending(true)
    setStatus({ text: 'Отправляем заявку…', error: false })
    try {
      const response = await fetch(import.meta.env.VITE_INQUIRY_ENDPOINT || '/api/inquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submission),
        signal: AbortSignal.timeout(10000),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.ok) throw new Error(result?.error || 'Онлайн-отправка недоступна. Скачайте бриф.')
      setStatus({ text: result.mode === 'demo' ? 'Тестовая заявка принята. Внешняя доставка не настроена.' : 'Заявка отправлена.', error: false })
    } catch (error) {
      const message = error.name === 'TimeoutError' || error instanceof TypeError
        ? 'Не удалось связаться с сервером. Повторите попытку или скачайте бриф.'
        : error.message
      setStatus({ text: message, error: true })
    } finally {
      setPending(false)
    }
  }

  function prepare(event) {
    const { contact, task } = getSubmission(event.currentTarget.form)
    if (!task && !brief) {
      setStatus({ text: 'Добавьте описание задачи.', error: true })
      return
    }
    downloadBrief([
      'Заявка на проект CREATOR',
      contact && `Контакт\n${contact}`,
      brief && `Расчёт\n${brief.content}`,
      task && `Задача\n${task}`,
    ].filter(Boolean).join('\n\n'))
    setStatus({ text: 'Бриф подготовлен. Проверьте загрузки браузера.', error: false })
  }

  function clearFieldError(event) {
    if (fieldError?.name === event.currentTarget.name) setFieldError(null)
  }

  return <form className={styles.form} onSubmit={send} aria-busy={pending}>
    {brief && <div className={styles.attached}>
      <div className={styles.briefOverview}><strong>{brief.project}</strong><span>{brief.range}</span></div>
      <details><summary>Состав из конфигуратора</summary><p>{brief.content}</p></details>
    </div>}
    <label htmlFor="contact-info">Как с вами связаться?</label>
    <input id="contact-info" name="contact" required minLength={3} maxLength={180} placeholder="Почта, телефон или Telegram"
      aria-invalid={fieldError?.name === 'contact' || undefined}
      aria-describedby={fieldError?.name === 'contact' ? 'contact-error' : undefined} onChange={clearFieldError} />
    {fieldError?.name === 'contact' && <p id="contact-error" role="alert" className={styles.formError}>{fieldError.text}</p>}
    <label htmlFor="task">Что хотите сделать?</label>
    <textarea id="task" name="task" required={!brief} rows="4" maxLength={2500} placeholder="Например, обновить сайт услуг и передавать заявки в CRM"
      aria-invalid={fieldError?.name === 'task' || undefined}
      aria-describedby={fieldError?.name === 'task' ? 'task-error' : undefined} onChange={clearFieldError} />
    {fieldError?.name === 'task' && <p id="task-error" role="alert" className={styles.formError}>{fieldError.text}</p>}
    <div className={styles.formActions}>
      <button className={styles.primary} type="submit" disabled={pending}>Отправить заявку</button>
      <button className={styles.download} type="button" onClick={prepare}>Скачать бриф</button>
    </div>
    <p role="status" className={`${styles.formStatus} ${status.error ? styles.formError : ''}`}>{status.text}</p>
  </form>
}
