import { useState } from 'react'
import { Configurator } from './Configurator'
import { Contact } from './Contact'
import { estimate, formatEstimate, formatFrom, routes } from './estimate'
import { Icon } from './Icons'
import mark from './mark.svg'
import gestia from './gestia.svg'
import shop from './shop.svg'
import styles from './App.module.css'

const nav = [['solutions', 'Решения'], ['services', 'Услуги'], ['work', 'Работы']]
const offers = [
  ['landing', 'window', 'Лендинг', 'Одна страница для запуска услуги, продукта или рекламной кампании.'],
  ['services', 'flow', 'Сайт услуг', 'Страницы направлений, каталог услуг и заявки на запись.'],
  ['shop', 'bag', 'Интернет-магазин', 'Каталог, корзина, оформление заказа и управление товарами.'],
]
const services = [
  ['refresh', 'Обновление сайта', 'Редизайн, мобильная версия, улучшение скорости и перенос контента.', 'redesign'],
  ['flow', 'Интеграции', 'CRM, Wildberries, Ozon, системы учёта, чат-боты, помощники и API.', 'automation'],
  ['window', 'Веб-приложения', 'Личные кабинеты, базы данных, мини-CRM и внутренние инструменты.', 'automation'],
]
const works = [
  { name: 'Гестия', type: 'Лендинг услуг', image: gestia, details: 'Выбор клининговой услуги, предварительный расчёт и демонстрационная форма заявки.', link: 'https://github.com/GrigValera/gestia-cleaning', demo: 'https://grigvalera.github.io/gestia-cleaning/' },
  { name: 'MyMyShop', type: 'Интернет-магазин', image: shop, details: 'Каталог, карточки товаров, корзина и демонстрационный сценарий оформления.', link: 'https://github.com/GrigValera/MyMyShop', demo: 'https://grigvalera.github.io/MyMyShop/' },
]
const faq = [
  ['Можно обновить существующий сайт?', 'Да. Начнём с текущего сайта и перечня проблем. Затем предложим объём изменений, порядок работ и оценку.'],
  ['Что входит в предварительную оценку?', 'Состав проекта и выбранные опции с известной стоимостью. Сложные интеграции, лицензии и регулярные платежи уточняем отдельно.'],
  ['Что происходит после запуска?', 'Передаём доступы и согласовываем обслуживание. При необходимости берём на себя обновления, хостинг и развитие проекта.'],
]

function Brand() {
  return <a href="#top" className={styles.brand}><img src={mark} alt="" width="37" height="37" />CREATOR<span>.</span></a>
}

function Header() {
  const [open, setOpen] = useState(false)
  return <header id="top" className={styles.header}><div className={styles.bar}>
    <Brand />
    <button type="button" aria-expanded={open} aria-controls="main-nav" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} className={styles.menu} onClick={() => setOpen(!open)}><Icon name="menu" /></button>
    <nav id="main-nav" aria-label="Основная навигация" className={styles.nav} data-open={open}>
      {nav.map(([id, text]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{text}</a>)}
      <a href="#contact" onClick={() => setOpen(false)}>Контакты</a>
    </nav>
    <a className={styles.headerCta} href="#estimate">Рассчитать проект</a>
  </div></header>
}

function HeroVisual() {
  return <div className={styles.heroVisual} aria-hidden="true">
    <div className={styles.orbit}></div>
    <div className={styles.floatOne}><Icon name="flow" size={25} /></div>
    <div className={styles.floatTwo}><Icon name="bag" size={25} /></div>
    <div className={styles.sample}>
      <div className={styles.sampleHead}><span></span><span></span><span></span></div>
      <div className={styles.sampleBody}>
        <div className={styles.sampleTitle}>Ваш проект</div>
        <div className={styles.sampleRows}>
          <div><i><Icon name="window" size={17} /></i> Сайт услуг <Icon name="tick" size={17} /></div>
          <div><i><Icon name="flow" size={17} /></i> Подключение CRM <Icon name="tick" size={17} /></div>
        </div>
        <div className={styles.samplePrice}><span>Оценка проекта</span><strong>{formatEstimate(estimate(routes[0], 'services', ['crm']).total)}</strong></div>
      </div>
    </div>
  </div>
}

export function App() {
  const [selection, setSelection] = useState({ id: 'new', sequence: 0 })
  const [brief, setBrief] = useState('')
  return <>
    <a className={styles.skip} href="#main">К содержанию</a>
    <Header />
    <main id="main">
      <section className={`${styles.bound} ${styles.hero}`} aria-labelledby="headline">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Веб-разработка и автоматизация</p>
          <h1 id="headline">Сайты, которые <em>работают</em> на бизнес</h1>
          <p className={styles.intro}>Создаём и обновляем сайты, магазины и веб-приложения. Связываем их с CRM, ботами и маркетплейсами.</p>
          <div className={styles.buttons}><a href="#estimate" className={styles.primary}>Рассчитать проект</a><a href="#contact" className={styles.secondary}>Обсудить задачу</a></div>
        </div>
        <HeroVisual />
      </section>

      <section id="solutions" className={`${styles.bound} ${styles.section}`}>
        <div className={styles.sectionHead}><div><p className={styles.eyebrow}>Готовые решения</p><h2>Что можно запустить</h2></div><p>Пакет задаёт основу проекта. Функции и подключения подбираем под вашу задачу.</p></div>
        <div className={styles.three}>
          {offers.map(([project, icon, name, description]) => <article className={styles.card} key={name}>
            <i className={styles.icon}><Icon name={icon} /></i><h3>{name}</h3><p>{description}</p>
            <a href="#estimate" className={styles.price} onClick={() => setSelection(value => ({ id: 'new', project, sequence: value.sequence + 1 }))}>{formatFrom(routes[0], project)}<span className={styles.sr}> — рассчитать {name.toLowerCase()}</span></a>
          </article>)}
        </div>
      </section>

      <section id="services" className={`${styles.bound} ${styles.section}`}>
        <div className={styles.sectionHead}><div><p className={styles.eyebrow}>Работы под задачу</p><h2>Развиваем то, что уже есть</h2></div><p>Разбираем процессы, проектируем решения и подключаем инструменты, которыми пользуется команда.</p></div>
        <div className={styles.three}>
          {services.map(([icon, name, description, id]) => <article className={styles.serviceCard} key={name}>
            <Icon name={icon} /><h3>{name}</h3><p>{description}</p>
            <a href="#estimate" onClick={() => setSelection(value => ({ id, sequence: value.sequence + 1 }))}>Рассчитать<span className={styles.sr}> — {name.toLowerCase()}</span></a>
          </article>)}
        </div>
      </section>

      <section id="estimate" className={styles.estimateBand}>
        <div className={`${styles.bound} ${styles.estimateGrid}`}>
          <div><p className={styles.eyebrow}>Конфигуратор</p><h2>Соберите свой проект</h2><p className={styles.bandText}>Выберите задачу и подключения. Покажем ориентир в рублях и поможем собрать бриф для обсуждения.</p></div>
          <Configurator selectedRoute={selection.id} selectedProject={selection.project} requestId={selection.sequence} onBrief={setBrief} />
        </div>
      </section>

      <section id="work" className={`${styles.bound} ${styles.section}`}>
        <div className={styles.sectionHead}><div><p className={styles.eyebrow}>Портфолио</p><h2>Примеры работ</h2></div></div>
        <div className={styles.two}>
          {works.map(item => <article className={styles.work} key={item.name}>
            <img src={item.image} alt="" loading="lazy" width="640" height="360" />
            <div><p className={styles.eyebrow}>{item.type}</p><h3>{item.name}</h3><p>{item.details}</p><div className={styles.workLinks}>{item.demo && <a href={item.demo}>Открыть демо<span className={styles.sr}> — {item.name}</span></a>}<a href={item.link}>Проект на GitHub<span className={styles.sr}> — {item.name}</span></a></div></div>
          </article>)}
        </div>
      </section>

      <section className={`${styles.bound} ${styles.section} ${styles.faq}`}>
        <h2>Частые вопросы</h2>
        <div>{faq.map(([question, answer]) => <details key={question}><summary>{question}<Icon name="plus" size={19} /></summary><p>{answer}</p></details>)}</div>
      </section>

      <section id="contact" className={styles.contactBand}>
        <div className={`${styles.bound} ${styles.contactGrid}`}>
          <div><p className={styles.eyebrow}>Следующий шаг</p><h2>Обсудим задачу</h2><p className={styles.bandText}>Опишите проект и скачайте бриф. Онлайн-отправка пока не подключена.</p></div>
          <Contact brief={brief} />
        </div>
      </section>
    </main>
    <footer className={styles.footer}><div className={styles.bound}><Brand /><a href="https://github.com/GrigValera">GitHub</a></div></footer>
  </>
}
