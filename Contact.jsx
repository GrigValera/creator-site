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
  const [status, setStatus] = useState('')

  function prepare(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const task = String(data.get('task') ?? '').trim()
    if (!task && !brief) {
      setStatus('Добавьте описание задачи.')
      return
    }
    downloadBrief([
      'Заявка на проект CREATOR',
      brief && `Расчёт\n${brief}`,
      task && `Задача\n${task}`,
    ].filter(Boolean).join('\n\n'))
    setStatus('Бриф подготовлен. Проверьте загрузки браузера.')
  }

  return <form className={styles.form} onSubmit={prepare} onChange={() => setStatus('')}>
    {brief && <details className={styles.attached}><summary>Состав из конфигуратора</summary><p>{brief}</p></details>}
    <label htmlFor="task">Что хотите сделать?</label>
    <textarea id="task" name="task" required={!brief} rows="4" maxLength={2500} placeholder="Например, обновить сайт услуг и передавать заявки в CRM" />
    <button className={styles.primary} type="submit">Скачать бриф</button>
    <p role="status" className={styles.formStatus}>{status}</p>
  </form>
}
