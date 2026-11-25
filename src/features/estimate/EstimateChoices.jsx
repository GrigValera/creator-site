import { Icon } from '../../shared/ui/Icon'
import { formatEstimate } from './estimate'
import styles from './EstimateChoices.module.css'

export function EstimateChoices({ label, name, items, isSelected, onSelect, allowMultiple = false, showPrice = false }) {
  return <div className={styles.options} role="group" aria-label={label}>
    {items.map(item => <Choice key={item.id} type={allowMultiple ? 'checkbox' : 'radio'}
      name={name} item={item} checked={isSelected(item.id)} showPrice={showPrice} onChange={() => onSelect(item.id)} />)}
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
