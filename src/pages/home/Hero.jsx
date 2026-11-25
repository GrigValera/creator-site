import { Action } from '../../shared/ui/Action'
import layout from '../../shared/layout/Section.module.css'
import styles from './Hero.module.css'

export function Hero({ onSelect }) {
  return <div className={styles.heroBand}>
    <section className={`${layout.bound} ${styles.hero}`} aria-labelledby="headline">
      <h1 id="headline">Сайты и веб-приложения <em>под ключ.</em></h1>
      <p className={styles.intro}>Запускаем лендинги для заявок, магазины для онлайн-продаж и сервисы для работы команды. Подключаем CRM, оплату и другие системы по задаче.</p>
      <div className={styles.buttons}>
        <Action href="#estimate" onClick={() => onSelect('new', 'landing')}>Оценить лендинг</Action>
        <Action href="#contact" variant="secondary">Обсудить задачу</Action>
      </div>
      <a href="#estimate" className={styles.heroEstimate} onClick={() => onSelect('new')}>Рассчитать другой проект</a>
    </section>
  </div>
}
