import { useEffect, useId, useRef, useState } from 'react'
import { availableExtras, estimate, formatEstimate, routes } from '../domain/estimate'
import { Icon } from '../shared/ui/Icon'
import styles from './Configurator.module.css'

const stepLabels = {
  goal: 'Цель', site: 'Сайт', project: 'Состав', extras: 'Опции', scope: 'Задача', result: 'Оценка',
}
const siteFields = [
  { name: 'address', label: 'Адрес сайта', hint: 'Например, example.ru', maxLength: 300 },
  { name: 'problem', label: 'Что сейчас не устраивает?', hint: 'Например, на телефоне трудно оставить заявку', maxLength: 600 },
  { name: 'outcome', label: 'Какой результат нужен?', hint: 'Например, чтобы заявки с телефона приходили в CRM', maxLength: 600 },
]
const scopeFields = [
  { name: 'workflow', label: 'Что должен уметь проект?', hint: 'Например, собирать заявки и назначать ответственного', maxLength: 300 },
  { name: 'systems', label: 'С какими системами и данными он будет работать?', hint: 'Например, сайт, CRM, каталог товаров или таблица', maxLength: 300 },
  { name: 'priority', label: 'Что нужно запустить в первую очередь?', hint: 'Например, передачу новых заявок из формы', maxLength: 300 },
]

function isSiteAddress(value) {
  if (!value || /\s/.test(value)) return false
  try {
    const address = new URL(value.includes('://') ? value : `https://${value}`)
    return ['http:', 'https:'].includes(address.protocol) && !address.username && !address.password
  } catch {
    return false
  }
}

export function Configurator({ selectedRoute, selectedProject, requestId, onBrief }) {
  const [step, setStep] = useState('goal')
  const [routeId, setRouteId] = useState('new')
  const [projectId, setProjectId] = useState('')
  const [extras, setExtras] = useState([])
  const [site, setSite] = useState({})
  const [scope, setScope] = useState({})
  const [invalidSiteField, setInvalidSiteField] = useState('')
  const detailsFormId = useId()
  const title = useRef(null)
  const wantsFocus = useRef(false)
  const route = routes.find(item => item.id === routeId)
  const result = estimate(route, projectId, extras)
  const options = availableExtras(route, projectId)
  const projectTotal = formatEstimate(result.total)
  const isRedesign = routeId === 'redesign'
  const needsScope = Boolean(result.project && (!result.total || result.separate.some(item => !item.recurring)))
  const steps = ['goal', ...(isRedesign ? ['site'] : []), 'project', 'extras', ...(needsScope ? ['scope'] : []), 'result']
  const stepIndex = steps.indexOf(step)
  const heading = {
    goal: 'Что нужно сделать?', site: 'Расскажите о текущем сайте', project: route.projectLabel,
    extras: 'Что ещё понадобится?', scope: 'Уточните задачу', result: 'Предварительная оценка',
  }[step]
  const isDetailsStep = step === 'site' || step === 'scope'

  useEffect(() => {
    if (!requestId) return
    setRouteId(selectedRoute)
    setProjectId(selectedProject ?? '')
    setExtras([])
    setScope({})
    setInvalidSiteField('')
    setStep(selectedRoute === 'redesign' ? 'site' : selectedProject ? 'project' : 'goal')
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
    setScope({})
    setInvalidSiteField('')
  }

  function saveDetails(event) {
    event.preventDefault()
    if (step === 'site') {
      const invalid = siteFields.find(({ name }) => !site[name]?.trim() ||
        (name === 'address' && !isSiteAddress(site.address.trim())))
      if (invalid) {
        setInvalidSiteField(invalid.name)
        event.currentTarget.elements.namedItem(invalid.name).focus()
        return
      }
      setInvalidSiteField('')
    }
    goTo(steps[stepIndex + 1])
  }

  function updateExtra(id) {
    setExtras(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }

  function chooseProject(id) {
    const allowed = availableExtras(route, id)
    setProjectId(id)
    setScope({})
    setExtras(current => current.filter(extra => allowed.some(item => item.id === extra)))
  }

  function describeOption(item) {
    return `${item.name} — ${item.price ? formatEstimate(item.price) : 'оценивается отдельно'}`
  }

  function sendBrief() {
    const content = [
      route.name,
      ...(isRedesign ? [
        `Адрес сайта: ${site.address.trim()}`,
        `Проблема: ${site.problem.trim()}`,
        `Желаемый результат: ${site.outcome.trim()}`,
      ] : []),
      describeOption(result.project),
      ...result.options.map(describeOption),
      ...(needsScope ? scopeFields.flatMap(({ name, label }) => scope[name]?.trim()
        ? [`${label} ${scope[name].trim()}`] : []) : []),
      `Ориентир: ${projectTotal}`,
      result.total && result.separate.length ? 'Работы без цены в диапазон не входят.' : '',
    ].filter(Boolean).join('\n')
    onBrief({ content, project: result.project.name, range: projectTotal })
  }

  return <div className={styles.config}>
    <ol className={styles.progress} aria-label="Шаги расчёта">
      {steps.map(id => <li key={id} aria-current={id === step ? 'step' : undefined}>{stepLabels[id]}</li>)}
    </ol>
    <div className={styles.panel}>
      <h3 ref={title} tabIndex={-1}>{heading}</h3>
      {step === 'extras' && <p className={styles.hint}>Можно выбрать несколько вариантов или пропустить шаг.</p>}
      {step === 'scope' && <p className={styles.hint}>Ответьте на то, что уже известно. Это поможет оценить работы с индивидуальной стоимостью.</p>}
      {step === 'goal' && <div className={styles.options} role="group" aria-label={heading}>
        {routes.map(item => <Choice key={item.id} name="goal" item={item} checked={routeId === item.id} onChange={() => chooseRoute(item.id)} />)}
      </div>}
      {isDetailsStep && <form id={detailsFormId} className={styles.siteForm} onSubmit={saveDetails}>
        {(step === 'site' ? siteFields : scopeFields).map(({ name, label, hint, maxLength }) => {
          const id = `${detailsFormId}-${name}`
          const Control = name === 'address' ? 'input' : 'textarea'
          const invalid = name === invalidSiteField
          const values = step === 'site' ? site : scope
          const setValues = step === 'site' ? setSite : setScope
          return <div key={name}>
            <label htmlFor={id}>{label}</label>
            <Control id={id} name={name} value={values[name] ?? ''} placeholder={hint} maxLength={maxLength}
              required={step === 'site'} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-error` : undefined}
              {...(name === 'address' ? { inputMode: 'url', autoComplete: 'url' } : { rows: 2 })}
              onChange={event => {
                const { value } = event.target
                setValues(current => ({ ...current, [name]: value }))
                if (invalid) setInvalidSiteField('')
              }} />
            {invalid && <p id={`${id}-error`} className={styles.siteError} role="alert">
              {name === 'address' ? 'Укажите адрес сайта, например example.ru.' : 'Заполните это поле.'}
            </p>}
          </div>
        })}
      </form>}
      {step === 'project' && <div className={styles.options} role="group" aria-label={heading}>
        {route.projects.map(item => <Choice key={item.id} name="project" item={item} showPrice checked={projectId === item.id} onChange={() => chooseProject(item.id)} />)}
      </div>}
      {step === 'extras' && <div className={styles.options} role="group" aria-label={heading}>
        {options.map(item => <Choice key={item.id} type="checkbox" name="addons" item={item} showPrice checked={extras.includes(item.id)} onChange={() => updateExtra(item.id)} />)}
      </div>}
      {step === 'result' && <div className={styles.result}>
        <p className={styles.total}>{projectTotal}</p>
        <ul><li>{describeOption(result.project)}</li>{result.options.map(item => <li key={item.id}>{describeOption(item)}</li>)}</ul>
        {result.total && result.separate.length > 0 && <p>В диапазон входят только позиции, для которых указана цена.</p>}
        {result.recurring && <p>Хостинг и обслуживание могут потребовать регулярной оплаты.</p>}
        <p>Окончательная стоимость и сроки зависят от согласованного объёма работ.</p>
      </div>}
      <div className={styles.actions}>
        {stepIndex > 0 && <button type="button" className={styles.back} onClick={() => goTo(steps[stepIndex - 1])}>Назад</button>}
        {isDetailsStep && <button type="submit" form={detailsFormId} className={styles.next}>
          {step === 'scope' ? 'Показать оценку' : 'Далее'}
        </button>}
        {step === 'result' && <a className={styles.next} href="#contact" onClick={sendBrief}>Подготовить заявку</a>}
        {!isDetailsStep && step !== 'result' && <button type="button" className={styles.next}
          disabled={step === 'project' && !projectId} onClick={() => goTo(steps[stepIndex + 1])}>
          {step === 'extras' && !needsScope ? 'Показать оценку' : 'Далее'}
        </button>}
      </div>
    </div>
  </div>
}

function Choice({ type = 'radio', name, item, showPrice, checked, onChange }) {
  return <label className={styles.choice}>
    <input type={type} name={name} value={item.id} checked={checked} onChange={onChange} />
    <span>
      <strong>{item.name}</strong>
      {item.detail && <small>{item.detail}</small>}
      {showPrice && <small>{item.price ? formatEstimate(item.price) : 'По задаче'}</small>}
    </span>
    {checked && <span className={styles.tick}><Icon name="tick" size={18} /></span>}
  </label>
}
