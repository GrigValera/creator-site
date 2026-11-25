import { useRef, useState } from 'react'
import mark from '../../assets/mark.svg'
import { Action } from '../../shared/ui/Action'
import { Icon } from '../../shared/ui/Icon'
import layout from '../../shared/layout/Section.module.css'
import styles from './SiteChrome.module.css'

const navigation = [
  ['tasks', 'Решения'], ['services', 'Услуги'], ['work', 'Работы'], ['contact', 'Контакты'],
]

function Brand() {
  return <a href="#top" className={styles.brand} aria-label="CREATOR, на главную">
    <img src={mark} alt="" width="32" height="32" /><span>CREATOR</span>
  </a>
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef(null)
  return <header className={styles.header}>
    <div className={layout.bound + ' ' + styles.bar}>
      <Brand />
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
