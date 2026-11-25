import { Action } from '../../shared/ui/Action'
import gestiaScreen from '../../assets/gestia-screen.jpg'
import layout from '../../shared/layout/Section.module.css'
import styles from './Hero.module.css'

export function Hero() {
  return <div className={styles.heroBand}>
    <section className={`${layout.bound} ${styles.hero}`} aria-labelledby="headline">
      <div className={styles.copy}>
        <p className={styles.eyebrow}><span className={styles.signal} aria-hidden="true" /> Цифровая студия CREATOR</p>
        <h1 id="headline">Сайты и веб-приложения <em>под вашу задачу.</em></h1>
        <p className={styles.intro}>Создаём лендинги, магазины и веб-приложения. Обновляем действующие сайты и связываем сервисы — от выбора решения до рабочего запуска.</p>
        <div className={styles.buttons}>
          <Action href="#tasks">Подобрать решение</Action>
          <Action href="#contact" variant="secondary">Обсудить задачу</Action>
        </div>
        <a className={styles.proofLink} href="#work">Посмотреть работающие примеры <span aria-hidden="true">↗</span></a>
      </div>
      <a className={styles.showcase} href="#work-gestia" aria-label="Смотреть пример лендинга Гестия в портфолио">
        <span className={styles.showcaseTop}><span><i aria-hidden="true" /> <i aria-hidden="true" /> <i aria-hidden="true" /></span><span>CREATOR / В РАБОТЕ</span></span>
        <img src={gestiaScreen} alt="Первый экран демонстрационного лендинга Гестия" width="1265" height="720" fetchPriority="high" />
        <span className={styles.showcaseBottom}><strong>Гестия</strong><span>Лендинг услуг <b aria-hidden="true">↗</b></span></span>
      </a>
    </section>
  </div>
}
