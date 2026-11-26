import { describeOption } from './wizardModel'
import styles from './EstimateWizard.module.css'

export function EstimateSummary({ result, projectTotal }) {
  return <div className={styles.result}>
    <p className={styles.total}>{projectTotal}</p>
    <ul>
      <li>{describeOption(result.project)}</li>
      {result.options.map(item => <li key={item.id}>{describeOption(item)}</li>)}
    </ul>
    {result.total && result.separate.length > 0 && <p>Позиции без указанной цены оцениваются отдельно.</p>}
    {result.recurring && <p>Хостинг и обслуживание могут потребовать регулярной оплаты.</p>}
    <p>{result.total
      ? 'Цена справочная. Стоимость и сроки уточним после обсуждения задачи.'
      : 'Стоимость и сроки оценим после обсуждения задачи.'}</p>
  </div>
}
