import { useId } from 'react'
import { routes } from './estimate'
import { EstimateChoices } from './EstimateChoices'
import { EstimateDetailsForm } from './EstimateDetailsForm'
import { EstimateSummary } from './EstimateSummary'
import { useEstimateWizard } from './useEstimateWizard'
import { siteFields, scopeFields, stepLabels } from './wizardModel'
import styles from './EstimateWizard.module.css'

export function EstimateWizard({ onBrief, ...selection }) {
  const wizard = useEstimateWizard(selection)
  const detailsForm = useId()
  const { step, steps, stepIndex, heading, route, projectId, options, extras } = wizard
  const isDetails = step === 'site' || step === 'scope'
  const nextStep = steps[stepIndex + 1]

  return <div ref={wizard.panel} className={styles.config}>
    <ol className={styles.progress} aria-label="Шаги расчёта">
      {steps.map(id => <li key={id} aria-current={id === step ? 'step' : undefined}>{stepLabels[id]}</li>)}
    </ol>
    <div className={styles.panel}>
      <h3 ref={wizard.title} tabIndex={-1}>{heading}</h3>
      {step === 'project' && <p className={styles.hint}>Цены справочные. Уточним стоимость после обсуждения задачи.</p>}
      {step === 'extras' && <p className={styles.hint}>Выберите нужные дополнения или пропустите шаг. Цены справочные.</p>}
      {step === 'scope' && <p className={styles.hint}>Ответьте на то, что уже известно. Это поможет оценить работы с индивидуальной стоимостью.</p>}
      {step === 'goal' && <EstimateChoices label={heading} name="goal" items={routes}
        isSelected={id => id === route.id} onSelect={wizard.chooseRoute} />}
      {step === 'project' && <EstimateChoices label={heading} name="project" items={route.projects}
        isSelected={id => id === projectId} onSelect={wizard.chooseProject} showPrice />}
      {step === 'extras' && <EstimateChoices label={heading} name="addons" items={options}
        isSelected={id => extras.includes(id)} onSelect={wizard.updateExtra} showPrice allowMultiple />}
      {isDetails && <EstimateDetailsForm id={detailsForm} fields={step === 'site' ? siteFields : scopeFields}
        values={wizard.values} required={step === 'site'} invalidField={wizard.invalidSiteField}
        onChange={wizard.updateField} onSubmit={wizard.saveDetails} />}
      {step === 'result' && <EstimateSummary result={wizard.result} projectTotal={wizard.projectTotal} />}
      <div className={styles.actions}>
        {stepIndex > 0 && <button type="button" className={styles.back} onClick={() => wizard.goTo(steps[stepIndex - 1])}>Назад</button>}
        {isDetails && <button type="submit" form={detailsForm} className={styles.next}>
          {step === 'scope' ? 'Показать оценку' : 'Далее'}
        </button>}
        {step === 'result' && <a className={styles.next} href="#contact" onClick={() => onBrief(wizard.getBrief())}>Подготовить заявку</a>}
        {!isDetails && step !== 'result' && <button type="button" className={styles.next}
          disabled={step === 'project' && !projectId} onClick={() => wizard.goTo(nextStep)}>
          {step === 'extras' && !wizard.needsScope ? 'Показать оценку' : 'Далее'}
        </button>}
      </div>
    </div>
  </div>
}
