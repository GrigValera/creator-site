import styles from './Section.module.css'

export function Section({ id, titleId, className, children }) {
  const classes = [styles.bound, styles.section, className].filter(Boolean).join(' ')
  return <section id={id} aria-labelledby={titleId} className={classes}>{children}</section>
}

export function SectionIntro({ titleId, label, title, children }) {
  return <div className={styles.sectionHead}>
    <div>
      <p className={styles.eyebrow}>{label}</p>
      <h2 className={styles.heading} id={titleId}>{title}</h2>
    </div>
    <p>{children}</p>
  </div>
}

export function SplitSection({ id, label, title, description, children }) {
  const titleId = id + '-title'
  return <section id={id} className={styles.band} aria-labelledby={titleId}>
    <div className={styles.bound + ' ' + styles.split}>
      <div>
        <p className={styles.eyebrow}>{label}</p>
        <h2 className={styles.heading} id={titleId}>{title}</h2>
        <p className={styles.bandText}>{description}</p>
      </div>
      {children}
    </div>
  </section>
}
