import { Action } from '../../shared/ui/Action'
import layout from '../../shared/layout/Section.module.css'
import styles from './Hero.module.css'

export function Hero() {
  return <div className={styles.heroBand}>
    <section className={`${layout.bound} ${styles.hero}`} aria-labelledby="headline">
      <h1 id="headline">Сайты и веб-приложения <em>под ключ.</em></h1>
      <p className={styles.intro}>Запускаем сайты и магазины, разбираемся, почему с действующего сайта мало заявок, и связываем сервисы, чтобы команда не переносила данные вручную.</p>
      <div className={styles.buttons}>
        <Action href="#tasks">Подобрать решение</Action>
        <Action href="#contact" variant="secondary">Обсудить задачу</Action>
      </div>
    </section>
  </div>
}
