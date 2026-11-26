import { Section, SectionIntro } from '../../shared/layout/Section'
import { Icon } from '../../shared/ui/Icon'
import styles from './TaskPaths.module.css'

const tasks = [
  {
    title: 'Нужен сайт или магазин',
    description: 'Поможем выбрать формат, чтобы представить услуги, получать заявки или продавать онлайн.',
    href: '#solutions', icon: 'bag',
  },
  {
    title: 'Сайт есть, но мало заявок',
    description: 'Посмотрим, где посетителю трудно найти нужное, связаться с вами или оформить заказ.',
    href: '#estimate', icon: 'refresh', route: 'redesign',
  },
  {
    title: 'Нужно связать сайт и сервисы',
    description: 'Настроим передачу заявок в CRM, уведомления в боте или обмен с каталогом и учётной системой.',
    href: '#estimate', icon: 'flow', route: 'automation', project: 'integrate',
  },
  {
    title: 'Нужно веб-приложение',
    description: 'Спроектируем личный кабинет, сервис записи или внутренний инструмент команды.',
    href: '#estimate', icon: 'window', route: 'automation', project: 'app',
  },
]

export function TaskPaths({ onSelect }) {
  return <Section id="tasks" titleId="tasks-title">
    <SectionIntro titleId="tasks-title" label="Решения" title="Что вы хотите решить?">
      Если задача пока не ясна, <a className={styles.contact} href="#contact">расскажите о ней своими словами</a>.
    </SectionIntro>
    <ul className={styles.grid}>
      {tasks.map(({ title, description, href, icon, route, project }) => <li key={title}>
        <a href={href} className={styles.path} onClick={route ? () => onSelect(route, project) : undefined}>
          <span className={styles.icon}><Icon name={icon} /></span>
          <span className={styles.copy}><strong>{title}</strong><span>{description}</span></span>
          <span className={styles.arrow} aria-hidden="true">↗</span>
        </a>
      </li>)}
    </ul>
  </Section>
}
