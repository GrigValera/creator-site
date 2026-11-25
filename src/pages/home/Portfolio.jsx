import { Section, SectionIntro } from '../../shared/layout/Section'
import layout from '../../shared/layout/Section.module.css'
import { works } from './portfolioContent'
import styles from './Portfolio.module.css'

export function Portfolio() {
  return <Section id="work" titleId="work-title">
    <SectionIntro titleId="work-title" label="Портфолио" title="Работы в действии">
      На превью — реальные экраны демо. Откройте проект и проверьте его сценарий.
    </SectionIntro>
    <div className={styles.two}>
      {works.map(item => <article id={`work-${item.id}`} className={styles.work} key={item.id}>
        <div className={styles.screen}>
          <img src={item.image} alt={`Экран проекта ${item.name}`} loading="lazy" width={item.id === 'gestia' ? '1280' : '1200'} height={item.id === 'gestia' ? '720' : '600'} />
          <span>Живое демо <span aria-hidden="true">↗</span></span>
        </div>
        <div>
          <p className={layout.eyebrow}>{item.type}</p>
          <h3>{item.name}</h3>
          <p className={styles.description}>{item.task}</p>
          <p className={styles.scenario}><strong>Проверьте:</strong> {item.scenario}</p>
          <p className={styles.note}>{item.note}</p>
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
