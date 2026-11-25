import styles from './Action.module.css'

export function Action({ href, variant = 'primary', className, children, ...props }) {
  const controlClass = [styles.action, styles[variant], className].filter(Boolean).join(' ')
  return href
    ? <a href={href} className={controlClass} {...props}>{children}</a>
    : <button className={controlClass} {...props}>{children}</button>
}
