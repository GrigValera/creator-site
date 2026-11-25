import { Section } from '../../shared/layout/Section'
import { Icon } from '../../shared/ui/Icon'
import layout from '../../shared/layout/Section.module.css'
import { faq } from './faqContent'
import styles from './Faq.module.css'

export function Faq() {
  return <Section titleId="faq-title" className={styles.faq}>
    <h2 id="faq-title" className={layout.heading}>Частые вопросы</h2>
    <div>{faq.map(([question, answer]) => <details key={question}>
      <summary>{question}<Icon name="plus" size={19} /></summary>
      <p>{answer}</p>
    </details>)}</div>
  </Section>
}
