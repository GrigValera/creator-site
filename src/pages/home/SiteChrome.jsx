import { useRef, useState } from 'react'
import { Action } from '../../shared/ui/Action'
import { Icon } from '../../shared/ui/Icon'
import layout from '../../shared/layout/Section.module.css'
import styles from './SiteChrome.module.css'

const navigation = [
  ['tasks', 'Решения'], ['services', 'Услуги'], ['work', 'Работы'], ['contact', 'Контакты'],
]

function Brand({ animated = false }) {
  return <a href="#top" className={`${styles.brand} ${animated ? styles.brandAnimated : ''}`} aria-label="CREATOR, на главную">
    <svg className={styles.brandMark} viewBox="0 0 40 40" width="36" height="36" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="10" fill="#ff693d" />
      <path className={styles.bolt} d="M23.5 6.8 10 21.8h8.2l-1.7 11.4L30 18.2h-8.2z" fill="#202025" />
      <path className={styles.spark} d="M7 9.5 5 7.5M33 9.5l2-2M32 32l2 2M8 31l-2 2" fill="none" stroke="#ffb28c" strokeWidth="2" strokeLinecap="round" />
    </svg><span>CREATOR</span>
  </a>
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef(null)
  return <header className={styles.header}>
    <div className={layout.bound + ' ' + styles.bar}>
      <Brand animated />
      <button ref={menuButton} type="button" aria-expanded={open} aria-controls="main-nav" className={styles.menu}
        onClick={() => setOpen(current => !current)} aria-label={open ? 'Закрыть меню' : 'Открыть меню'}>
        <Icon name="menu" size={24} />
      </button>
      <nav id="main-nav" aria-label="Основная навигация" className={styles.nav} data-open={open}
        onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus() } }}>
        {navigation.map(([id, title]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{title}</a>)}
      </nav>
      <Action className={styles.headerCta} href="#estimate" variant="outline">Рассчитать проект</Action>
    </div>
  </header>
}

export function SkipLink() {
  return <a className={layout.visuallyHidden + ' ' + styles.skip} href="#main">К содержанию</a>
}

export function SiteFooter() {
  return <footer className={styles.footer}>
    <div className={layout.bound}><Brand /><a href="https://github.com/GrigValera">GitHub</a></div>
  </footer>
}
