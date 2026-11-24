import gestia from './gestia.svg'
import shop from './shop.svg'
import styles from './App.module.css'

export const landingExample = {
  id: 'gestia',
  name: 'Гестия',
  type: 'Лендинг услуг',
  image: gestia,
  details: 'Задача — помочь посетителю подобрать уборку и перейти к заявке. В демо выберите услугу: она подставится в форму. Форма готовит текст для копирования.',
  repository: 'https://github.com/GrigValera/gestia-cleaning',
  preview: { url: 'https://grigvalera.github.io/gestia-cleaning/', label: 'Открыть демо' },
}

const works = [
  landingExample,
  {
    id: 'mymyshop',
    name: 'MyMyShop',
    type: 'Интернет-магазин',
    image: shop,
    details: 'Витрина, карточки товаров и корзина. Публичное оформление заказа пока недоступно.',
    repository: 'https://github.com/GrigValera/MyMyShop',
    preview: { url: 'https://grigvalera.github.io/MyMyShop/', label: 'Открыть витрину' },
  },
]

export function Portfolio() {
  return <section id="work" className={`${styles.bound} ${styles.section}`} aria-labelledby="work-title">
    <div className={styles.sectionHead}>
      <div><p className={styles.eyebrow}>Портфолио</p><h2 id="work-title">Примеры работ</h2></div>
      <p>Откройте работы, чтобы посмотреть интерфейс и попробовать доступные функции.</p>
    </div>
    <div className={styles.two}>
      {works.map(item => <article id={`work-${item.id}`} className={styles.work} key={item.id}>
        <img src={item.image} alt="" loading="lazy" width="640" height="360" />
        <div>
          <p className={styles.eyebrow}>{item.type}</p>
          <h3>{item.name}</h3>
          <p>{item.details}</p>
          <div className={styles.workLinks}>
            {item.preview && <a href={item.preview.url}>{item.preview.label}<span className={styles.sr}> — {item.name}</span></a>}
            {item.repository && <a href={item.repository}>Проект на GitHub<span className={styles.sr}> — {item.name}</span></a>}
          </div>
        </div>
      </article>)}
    </div>
  </section>
}
