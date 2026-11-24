import { useEffect, useRef, useState } from 'react'
import { availableExtras, estimate, formatEstimate, routes } from './estimate'
import { Icon } from './Icons'
import styles from './Configurator.module.css'

const steps = ['Цель', 'Состав', 'Подключения', 'Оценка']

export function Configurator({ selectedRoute, selectedProject, requestId, onBrief }) {
  const [step, setStep] = useState(0)
  const [routeId, setRouteId] = useState('new')
  const [projectId, setProjectId] = useState('')
  const [extras, setExtras] = useState([])
  const title = useRef(null)
  const wantsFocus = useRef(false)
  const route = routes.find(item => item.id === routeId)
  const result = estimate(route, projectId, extras)
  const options = availableExtras(route, projectId)
  const projectTotal = formatEstimate(result.total)
  const heading = ['Что нужно сделать?', route.projectLabel, 'Что ещё понадобится?', 'Предварительная оценка'][step]

  useEffect(() => {
    if (!requestId) return
    setRouteId(selectedRoute)
    setProjectId(selectedProject ?? '')
    setExtras([])
    setStep(selectedProject ? 1 : 0)
    title.current?.focus({ preventScroll: true })
  }, [requestId, selectedRoute, selectedProject])

  useEffect(() => {
    if (wantsFocus.current) {
      title.current?.focus({ preventScroll: true })
      wantsFocus.current = false
    }
  }, [step])

  function goTo(nextStep) {
    wantsFocus.current = true
    setStep(nextStep)
  }

  function chooseRoute(id) {
    setRouteId(id)
    setProjectId('')
    setExtras([])
  }

  function updateExtra(id) {
    setExtras(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }

  function chooseProject(id) {
    const allowed = availableExtras(route, id)
    setProjectId(id)
    setExtras(current => current.filter(extra => allowed.some(item => item.id === extra)))
  }

  function describeOption(item) {
    return `${item.name} — ${item.price ? formatEstimate(item.price) : 'оценивается отдельно'}`
  }

  function sendBrief() {
    const content = [
      route.name,
      describeOption(result.project),
      ...result.options.map(describeOption),
      `Ориентир: ${projectTotal}`,
      result.total && result.separate.length ? 'Работы без цены в диапазон не входят.' : '',
    ].filter(Boolean).join('\n')
    onBrief(content)
  }

  return <div className={styles.config}>
    <ol className={styles.progress} aria-label="Шаги расчёта">
      {steps.map((label, index) => <li key={label} aria-current={index === step ? 'step' : undefined}>{label}</li>)}
    </ol>
    <div className={styles.panel}>
      <h3 ref={title} tabIndex={-1}>{heading}</h3>
      {step < 3 && <p className={styles.hint}>{step === 2 ? 'Можно выбрать несколько вариантов или пропустить шаг.' : 'Выберите подходящий вариант.'}</p>}
      {step === 0 && <div className={styles.options} role="group" aria-label={heading}>
        {routes.map(item => <Choice key={item.id} name="goal" item={item} checked={routeId === item.id} onChange={() => chooseRoute(item.id)} />)}
      </div>}
      {step === 1 && <div className={styles.options} role="group" aria-label={heading}>
        {route.projects.map(item => <Choice key={item.id} name="project" item={item} checked={projectId === item.id} onChange={() => chooseProject(item.id)} />)}
      </div>}
      {step === 2 && <div className={styles.options} role="group" aria-label={heading}>
        {options.map(item => <Choice key={item.id} type="checkbox" name="addons" item={item} checked={extras.includes(item.id)} onChange={() => updateExtra(item.id)} />)}
      </div>}
      {step === 3 && <div className={styles.result}>
        <p className={styles.total}>{projectTotal}</p>
        <ul><li>{describeOption(result.project)}</li>{result.options.map(item => <li key={item.id}>{describeOption(item)}</li>)}</ul>
        {result.total && result.separate.length > 0 && <p>В диапазон входят только позиции, для которых указана цена.</p>}
        {result.recurring && <p>Хостинг и обслуживание могут потребовать регулярной оплаты.</p>}
        <p>Окончательная стоимость и сроки зависят от согласованного объёма работ.</p>
      </div>}
      <div className={styles.actions}>
        {step > 0 && <button type="button" className={styles.back} onClick={() => goTo(step - 1)}>Назад</button>}
        {step < 3
          ? <button type="button" className={styles.next} disabled={step === 1 && !projectId} onClick={() => goTo(step + 1)}>{step === 2 ? 'Показать оценку' : 'Далее'}</button>
          : <a className={styles.next} href="#contact" onClick={sendBrief}>Подготовить заявку</a>}
      </div>
    </div>
  </div>
}

function Choice({ type = 'radio', name, item, checked, onChange }) {
  return <label className={styles.choice}>
    <input type={type} name={name} value={item.id} checked={checked} onChange={onChange} />
    <span><strong>{item.name}</strong>{item.detail && <small>{item.detail}</small>}</span>
    {checked && <span className={styles.tick}><Icon name="tick" size={18} /></span>}
  </label>
}
