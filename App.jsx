import { useState } from 'react'
import { Configurator } from './Configurator'
import { Contact } from './Contact'
import { Portfolio } from './Portfolio'
import { formatFrom, routes } from './estimate'
import { faq, services, solutions } from './siteContent'
import { Icon } from './Icons'
import mark from './mark.svg'
import styles from './App.module.css'

const navigation = [
  ['solutions', 'Решения'], ['services', 'Услуги'], ['work', 'Работы'], ['contact', 'Контакты'],
]

function Brand() {
  return <a href="#top" className={styles.brand} aria-label="CREATOR, на главную">
    <img src={mark} alt="" width="32" height="32" /><span>CREATOR</span>
  </a>
}

function Header() {
  const [open, setOpen] = useState(false)
  return <header className={styles.header}>
    <div className={styles.bar}>
      <Brand />
      <button type="button" aria-expanded={open} aria-controls="main-nav" className={styles.menu}
        onClick={() => setOpen(!open)} aria-label={open ? 'Закрыть меню' : 'Открыть меню'}>
        <Icon name="menu" size={24} />
      </button>
      <nav id="main-nav" aria-label="Основная навигация" className={styles.nav} data-open={open}
        onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); event.currentTarget.parentElement.querySelector('button')?.focus() } }}>
        {navigation.map(([id, title]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{title}</a>)}
      </nav>
      <a className={styles.headerCta} href="#estimate">Рассчитать проект</a>
    </div>
  </header>
}

function HeroVisual() {
  return <div className={styles.heroVisual} aria-hidden="true">
    <div className={styles.visualGrid} />
    <div className={styles.orbit} />
    <div className={styles.mockWindow}>
      <div className={styles.mockTop}><i /><i /><i /><span>creator / проект</span></div>
      <div className={styles.mockBody}>
        <div className={styles.mockLabel}>СТРУКТУРА ПРОЕКТА</div>
        <div className={styles.mockTitle}>Цифровая система<br />для вашего бизнеса</div>
        <div className={styles.mockLine} />
        <div className={styles.mockTiles}>
          <div><Icon name="window" size={21} /><span>Сайт</span></div>
          <div><Icon name="bag" size={21} /><span>Магазин</span></div>
          <div><Icon name="flow" size={21} /><span>Интеграции</span></div>
        </div>
      </div>
    </div>
    <div className={styles.mockBadge}><Icon name="tick" size={17} /> Готово к настройке</div>
  </div>
}

function Solutions({ onSelect }) {
  return <section id="solutions" className={`${styles.bound} ${styles.section}`} aria-labelledby="solutions-title">
    <div className={styles.sectionHead}>
      <div><p className={styles.eyebrow}>Решения</p><h2 id="solutions-title">Что можно запустить</h2></div>
      <p>Выберите основу проекта. Состав и подключения уточните в конфигураторе.</p>
    </div>
    <div className={styles.three}>
      {solutions.map(item => <article className={styles.card} data-solution={item.id} key={item.id}>
        <span className={styles.icon}><Icon name={item.icon} size={24} /></span>
        <p className={styles.cardType}>{item.type}</p>
        <h3>{item.title}</h3><p>{item.text}</p>
        <ul className={styles.features}>{item.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
        <a href="#estimate" className={styles.price} onClick={() => onSelect('new', item.id)}>
          {formatFrom(routes[0], item.id)}<span className={styles.sr}> — рассчитать {item.title.toLowerCase()}</span>
        </a>
      </article>)}
    </div>
  </section>
}

function Services({ onSelect }) {
  return <section id="services" className={`${styles.bound} ${styles.section}`} aria-labelledby="services-title">
    <div className={styles.sectionHead}>
      <div><p className={styles.eyebrow}>Услуги</p><h2 id="services-title">Развиваем и подключаем</h2></div>
      <p>Можно заказать отдельную работу или добавить её к новому проекту.</p>
    </div>
    <div className={styles.serviceGrid}>
      {services.map(item => <article className={styles.serviceCard} key={item.title}>
        <Icon name={item.icon} size={25} /><h3>{item.title}</h3><p>{item.text}</p>
        <a href="#estimate" onClick={() => onSelect(item.route, item.project)}>Оценить задачу<span className={styles.sr}> — {item.title.toLowerCase()}</span></a>
      </article>)}
    </div>
  </section>
}

export function App() {
  const [selection, setSelection] = useState({ id: 'new', sequence: 0 })
  const [brief, setBrief] = useState('')

  function selectProject(id, project) {
    setSelection(value => ({ id, project, sequence: value.sequence + 1 }))
  }

  return <div id="top">
    <a className={styles.skip} href="#main">К содержанию</a>
    <Header />
    <main id="main" tabIndex={-1}>
      <div className={styles.heroBand}>
        <section className={`${styles.bound} ${styles.hero}`} aria-labelledby="headline">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Веб-разработка и автоматизация</p>
            <h1 id="headline">Сайты и веб-приложения <em>под ключ.</em></h1>
            <p className={styles.intro}>Создаём лендинги, интернет-магазины и внутренние сервисы. Подключаем CRM, ботов, базы и системы, которыми пользуется ваш бизнес.</p>
            <div className={styles.buttons}>
              <a href="#estimate" className={styles.primary}>Рассчитать проект</a>
              <a href="#work" className={styles.secondary}>Смотреть работы</a>
            </div>
          </div>
          <HeroVisual />
        </section>
      </div>
      <Solutions onSelect={selectProject} />
      <Services onSelect={selectProject} />
      <section id="estimate" className={styles.estimateBand} aria-labelledby="estimate-title">
        <div className={`${styles.bound} ${styles.estimateGrid}`}>
          <div><p className={styles.eyebrow}>Конфигуратор</p><h2 id="estimate-title">Соберите свой проект</h2>
            <p className={styles.bandText}>Выберите задачу и подключения. Получите ориентир в рублях и перенесите расчёт в заявку.</p>
          </div>
          <Configurator selectedRoute={selection.id} selectedProject={selection.project} requestId={selection.sequence} onBrief={setBrief} />
        </div>
      </section>
      <Portfolio />
      <section className={`${styles.bound} ${styles.section} ${styles.faq}`} aria-labelledby="faq-title">
        <h2 id="faq-title">Частые вопросы</h2>
        <div>{faq.map(([question, answer]) => <details key={question}>
          <summary>{question}<Icon name="plus" size={19} /></summary><p>{answer}</p>
        </details>)}</div>
      </section>
      <section id="contact" className={styles.contactBand} aria-labelledby="contact-title">
        <div className={`${styles.bound} ${styles.contactGrid}`}>
          <div><p className={styles.eyebrow}>Обратная связь</p><h2 id="contact-title">Обсудим задачу</h2>
            <p className={styles.bandText}>Расскажите, что нужно сделать. Если уже собрали расчёт, он появится в форме.</p>
          </div>
          <Contact brief={brief} />
        </div>
      </section>
    </main>
    <footer className={styles.footer}>
      <div className={styles.bound}><Brand /><a href="https://github.com/GrigValera">GitHub</a></div>
    </footer>
  </div>
}
