export async function requestInquiry(submission, attempt) {
  const response = await fetch(import.meta.env?.VITE_INQUIRY_ENDPOINT || '/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...submission, deliveryId: attempt.id, deliveryReceipt: attempt.receipt }),
    signal: AbortSignal.timeout(10000),
  })
  const result = await response.json().catch(() => null)
  return { responseOk: response.ok, result }
}
