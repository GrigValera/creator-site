import { Section, SectionIntro } from '../../shared/layout/Section'
import layout from '../../shared/layout/Section.module.css'
import { works } from './portfolioContent'
import styles from './Portfolio.module.css'

export function Portfolio() {
  return <Section id="work" titleId="work-title">
    <SectionIntro titleId="work-title" label="Портфолио" title="Примеры работ">
      Откройте работы, чтобы посмотреть интерфейс и попробовать доступные функции.
    </SectionIntro>
    <div className={styles.two}>
      {works.map(item => <article id={`work-${item.id}`} className={styles.work} key={item.id}>
        <img src={item.image} alt="" loading="lazy" width="640" height="360" />
        <div>
          <p className={layout.eyebrow}>{item.type}</p>
          <h3>{item.name}</h3>
          <p className={styles.description}>{item.details}</p>
          <div className={styles.workLinks}>
            {item.preview && <a className={layout.actionLink} href={item.preview.url} target="_blank" rel="noopener">
              {item.preview.label}<span className={layout.visuallyHidden}> — {item.name}, в новой вкладке</span>
            </a>}
            {item.repository && <a className={layout.actionLink} href={item.repository}>Проект на GitHub<span className={layout.visuallyHidden}> — {item.name}</span></a>}
          </div>
        </div>
      </article>)}
    </div>
  </Section>
}
