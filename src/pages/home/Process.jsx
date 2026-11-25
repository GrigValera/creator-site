import { Section, SectionIntro } from '../../shared/layout/Section'
import styles from './Process.module.css'

const steps = [
  { number: '01', title: 'Разбираем задачу', text: 'Вы рассказываете, что нужно запустить или улучшить. Мы уточняем цель, аудиторию и ограничения.' },
  { number: '02', title: 'Показываем состав', text: 'Определяем базовые работы и отдельные подключения. Даём ориентир, который можно обсудить.' },
  { number: '03', title: 'Согласуем запуск', text: 'До начала работ обсуждаем детали, этапы и условия. После этого можно переходить к реализации.' },
]

export function Process() {
  return <Section id="process" titleId="process-title" className={styles.process}>
    <SectionIntro titleId="process-title" label="Как работаем" title="Понятный путь от задачи до запуска">
      Начать можно с короткого описания. Подробное ТЗ для первого разговора не требуется.
    </SectionIntro>
    <ol className={styles.steps}>
      {steps.map(step => <li key={step.number}>
        <span className={styles.number}>{step.number}</span>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </li>)}
    </ol>
  </Section>
}
