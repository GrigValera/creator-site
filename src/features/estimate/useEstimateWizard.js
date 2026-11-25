import { useEffect, useRef, useState } from 'react'
import { availableExtras, estimate, formatEstimate, routes } from './estimate'
import { createBrief, findInvalidSiteField } from './wizardModel'

export function useEstimateWizard({ selectedRoute, selectedProject, requestId }) {
  const [step, setStep] = useState('goal')
  const [routeId, setRouteId] = useState('new')
  const [projectId, setProjectId] = useState('')
  const [extras, setExtras] = useState([])
  const [site, setSite] = useState({})
  const [scope, setScope] = useState({})
  const [invalidSiteField, setInvalidSiteField] = useState('')
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
      const invalid = findInvalidSiteField(site)
      if (invalid) {
        setInvalidSiteField(invalid)
        event.currentTarget.elements.namedItem(invalid).focus()
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

  function updateField(name, value) {
    const setValues = step === 'site' ? setSite : setScope
    setValues(current => ({ ...current, [name]: value }))
    if (name === invalidSiteField) setInvalidSiteField('')
  }

  return {
    title, heading, step, steps, stepIndex, route, projectId, options, extras, needsScope,
    values: step === 'site' ? site : scope, invalidSiteField, result, projectTotal,
    goTo, chooseRoute, chooseProject, updateExtra, saveDetails, updateField,
    getBrief: () => createBrief({ route, result, site, scope, needsScope, projectTotal }),
  }
}
