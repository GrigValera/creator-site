import { useState } from 'react'
import { Configurator } from './Configurator'
import { Contact } from './Contact'
import { landingExample, Portfolio } from './Portfolio'
import { estimate, formatEstimate, formatFrom, routes } from './estimate'
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
        <ul className={styles.features} aria-label="В базовом составе">{item.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
        {item.materials && <p><strong>Для старта.</strong> {item.materials}</p>}
        {item.additions && <p><strong>Отдельно.</strong> {item.additions}</p>}
        <div className={styles.cardEstimate}>
          <p className={styles.startingPrice}>{item.id === 'landing'
            ? formatEstimate(estimate(routes[0], item.id, []).total)
            : formatFrom(routes[0], item.id)}</p>
          {item.id === 'landing' && <p className={styles.estimateNote}>Предварительно, за базовый состав.</p>}
          <a href="#estimate" className={styles.estimateLink} onClick={() => onSelect('new', item.id)}>
            Рассчитать стоимость<span className={styles.sr}> — {item.title.toLowerCase()}</span>
          </a>
          {item.id === 'landing' && <a href={`#work-${landingExample.id}`} className={styles.estimateLink}>Смотреть пример лендинга</a>}
        </div>
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
  const [brief, setBrief] = useState(null)

  function selectProject(id, project) {
    setSelection(value => ({ id, project, sequence: value.sequence + 1 }))
  }

  return <div id="top">
    <a className={styles.skip} href="#main">К содержанию</a>
    <Header />
    <main id="main" tabIndex={-1}>
      <div className={styles.heroBand}>
        <section className={`${styles.bound} ${styles.hero}`} aria-labelledby="headline">
          <h1 id="headline">Сайты и веб-приложения <em>под ключ.</em></h1>
          <p className={styles.intro}>Запускаем лендинги для заявок, магазины для онлайн-продаж и сервисы для работы команды. Подключаем CRM, оплату и другие системы по задаче.</p>
          <div className={styles.buttons}>
            <a href="#estimate" className={styles.primary} onClick={() => selectProject('new', 'landing')}>Оценить лендинг</a>
            <a href="#contact" className={styles.secondary}>Обсудить задачу</a>
          </div>
          <a href="#estimate" className={styles.heroEstimate} onClick={() => selectProject('new')}>Рассчитать другой проект</a>
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
