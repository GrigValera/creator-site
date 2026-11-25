export function validateInquiry(submission) {
  return submission.contact.length < 3
    ? { name: 'contact', text: 'Укажите телефон, почту или Telegram.' }
    : !submission.task && !submission.estimate
      ? { name: 'task', text: 'Коротко опишите, что нужно сделать.' }
      : null
}

export function formatBrief({ contact, task, brief }) {
  return [
    'Заявка на проект CREATOR',
    contact && `Контакт\n${contact}`,
    brief && `Расчёт\n${brief.content}`,
    task && `Задача\n${task}`,
  ].filter(Boolean).join('\n\n')
}
