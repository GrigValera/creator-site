import { useRef } from 'react'
import { Action } from '../../shared/ui/Action'
import { useInquiryForm } from './useInquiryForm'
import styles from './InquiryForm.module.css'

export function InquiryForm({ brief, onRemoveBrief }) {
  const { status, pending, fieldError, send, clearFieldError } = useInquiryForm(brief)
  const contact = useRef(null)

  return <form className={styles.form} onSubmit={send} aria-busy={pending} noValidate>
    {brief && <div className={styles.attached}>
      <div className={styles.briefOverview}><strong>{brief.project}</strong><span>{brief.range}</span></div>
      <details><summary>Что войдёт в заявку</summary><p>{brief.content}</p></details>
      <button type="button" className={styles.remove} disabled={pending} onClick={() => {
        onRemoveBrief()
        contact.current?.focus({ preventScroll: true })
      }}>Убрать расчёт</button>
    </div>}
    <label htmlFor="contact-info">Как с вами связаться?</label>
    <input ref={contact} id="contact-info" name="contact" required minLength={3} maxLength={180} placeholder="Почта, телефон или Telegram"
      aria-invalid={fieldError?.name === 'contact' || undefined}
      aria-describedby={fieldError?.name === 'contact' ? 'contact-error' : undefined} onChange={clearFieldError} />
    {fieldError?.name === 'contact' && <p id="contact-error" role="alert" className={styles.formError}>{fieldError.text}</p>}
    <label htmlFor="task">Что хотите сделать?</label>
    <textarea id="task" name="task" required={!brief} rows="4" maxLength={2500} placeholder="Например, обновить сайт услуг и передавать заявки в CRM"
      aria-invalid={fieldError?.name === 'task' || undefined}
      aria-describedby={fieldError?.name === 'task' ? 'task-error' : undefined} onChange={clearFieldError} />
    {fieldError?.name === 'task' && <p id="task-error" role="alert" className={styles.formError}>{fieldError.text}</p>}
    <Action className={styles.primary} type="submit" disabled={pending}>Отправить заявку</Action>
    <p role="status" className={`${styles.formStatus} ${status.error ? styles.formError : ''}`}>{status.text}</p>
  </form>
}
