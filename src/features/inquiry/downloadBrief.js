export function downloadBrief(content) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
  const download = document.createElement('a')
  download.href = url
  download.download = 'creator-brief.txt'
  document.body.append(download)
  download.click()
  download.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
