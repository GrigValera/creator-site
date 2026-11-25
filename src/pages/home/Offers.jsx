import { Section, SectionIntro } from '../../shared/layout/Section'
import layout from '../../shared/layout/Section.module.css'
import { Icon } from '../../shared/ui/Icon'
import { estimate, formatEstimate, formatFrom, routes } from '../../features/estimate/estimate'
import { landingExample } from './portfolioContent'
import { solutions, services } from './offerContent'
import styles from './Offers.module.css'

export function Solutions({ onSelect }) {
  return <Section id="solutions" titleId="solutions-title">
    <SectionIntro titleId="solutions-title" label="Решения" title="Что можно запустить">
      Выберите основу проекта. Состав и подключения уточните в конфигураторе.
    </SectionIntro>
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
          <a href="#estimate" className={layout.actionLink} onClick={() => onSelect('new', item.id)}>
            Рассчитать стоимость<span className={layout.visuallyHidden}> — {item.title.toLowerCase()}</span>
          </a>
          {item.id === 'landing' && <a href={`#work-${landingExample.id}`} className={layout.actionLink}>Смотреть пример лендинга</a>}
        </div>
      </article>)}
    </div>
  </Section>
}

export function Services({ onSelect }) {
  return <Section id="services" titleId="services-title">
    <SectionIntro titleId="services-title" label="Услуги" title="Развиваем и подключаем">
      Можно заказать отдельную работу или добавить её к новому проекту.
    </SectionIntro>
    <div className={styles.serviceGrid}>
      {services.map(item => <article className={styles.serviceCard} key={item.title}>
        <Icon name={item.icon} size={25} /><h3>{item.title}</h3><p>{item.text}</p>
        <a href="#estimate" className={layout.actionLink} onClick={() => onSelect(item.route, item.project)}>Оценить задачу<span className={layout.visuallyHidden}> — {item.title.toLowerCase()}</span></a>
      </article>)}
    </div>
  </Section>
}
