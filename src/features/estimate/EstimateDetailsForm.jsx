import styles from './EstimateDetailsForm.module.css'

export function EstimateDetailsForm({ id, fields, values, required, invalidField, onChange, onSubmit }) {
  return <form id={id} className={styles.siteForm} onSubmit={onSubmit}>
    {fields.map(({ name, label, hint, maxLength }) => {
      const fieldId = id + '-' + name
      const isAddress = name === 'address'
      const invalid = name === invalidField
      const Control = isAddress ? 'input' : 'textarea'
      return <div key={name}>
        <label htmlFor={fieldId}>{label}</label>
        <Control id={fieldId} name={name} value={values[name] ?? ''} placeholder={hint} maxLength={maxLength}
          required={required} aria-invalid={invalid || undefined} aria-describedby={invalid ? fieldId + '-error' : undefined}
          {...(isAddress ? { inputMode: 'url', autoComplete: 'url' } : { rows: 2 })}
          onChange={event => onChange(name, event.target.value)} />
        {invalid && <p id={fieldId + '-error'} className={styles.siteError} role="alert">
          {isAddress ? 'Укажите адрес сайта, например example.ru.' : 'Заполните это поле.'}
        </p>}
      </div>
    })}
  </form>
}
