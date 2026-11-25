export function validateInquiry(submission) {
  return submission.contact.length < 3
    ? { name: 'contact', text: 'Укажите телефон, почту или Telegram.' }
    : !submission.task && !submission.estimate
      ? { name: 'task', text: 'Коротко опишите, что нужно сделать.' }
      : null
}
