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

  function getSubmission(form) {
    const data = new FormData(form)
    return { contact: String(data.get('contact') ?? '').trim(), task: String(data.get('task') ?? '').trim(), estimate: brief }
  }

  async function send(event) {
    event.preventDefault()
    if (pending) return
    const submission = getSubmission(event.currentTarget)
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
      brief && `Расчёт\n${brief}`,
      task && `Задача\n${task}`,
    ].filter(Boolean).join('\n\n'))
    setStatus({ text: 'Бриф подготовлен. Проверьте загрузки браузера.', error: false })
  }

  return <form className={styles.form} onSubmit={send} aria-busy={pending}>
    {brief && <details className={styles.attached}><summary>Состав из конфигуратора</summary><p>{brief}</p></details>}
    <label htmlFor="contact-info">Как с вами связаться?</label>
    <input id="contact-info" name="contact" required minLength={3} maxLength={180} placeholder="Почта, телефон или Telegram" />
    <label htmlFor="task">Что хотите сделать?</label>
    <textarea id="task" name="task" required={!brief} rows="4" maxLength={2500} placeholder="Например, обновить сайт услуг и передавать заявки в CRM" />
    <div className={styles.formActions}>
      <button className={styles.primary} type="submit" disabled={pending}>Отправить заявку</button>
      <button className={styles.download} type="button" onClick={prepare}>Скачать бриф</button>
    </div>
    <p role="status" className={`${styles.formStatus} ${status.error ? styles.formError : ''}`}>{status.text}</p>
  </form>
}
