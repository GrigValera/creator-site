import { useState } from 'react'
import { EstimateWizard } from '../../features/estimate/EstimateWizard'
import { InquiryForm } from '../../features/inquiry/InquiryForm'
import { SplitSection } from '../../shared/layout/Section'
import { Faq } from './Faq'
import { Hero } from './Hero'
import { Services, Solutions } from './Offers'
import { Portfolio } from './Portfolio'
import { SiteHeader, SiteFooter, SkipLink } from './SiteChrome'

export function HomePage() {
  const [selection, setSelection] = useState({ id: 'new', sequence: 0 })
  const [brief, setBrief] = useState(null)

  function selectProject(id, project) {
    setSelection(current => ({ id, project, sequence: current.sequence + 1 }))
  }

  return <div id="top">
    <SkipLink />
    <SiteHeader />
    <main id="main" tabIndex={-1}>
      <Hero onSelect={selectProject} />
      <Solutions onSelect={selectProject} />
      <Services onSelect={selectProject} />
      <SplitSection id="estimate" label="Конфигуратор" title="Соберите свой проект"
        description="Выберите задачу и подключения. Получите ориентир в рублях и перенесите расчёт в заявку.">
        <EstimateWizard selectedRoute={selection.id} selectedProject={selection.project}
          requestId={selection.sequence} onBrief={setBrief} />
      </SplitSection>
      <Portfolio />
      <Faq />
      <SplitSection id="contact" label="Обратная связь" title="Обсудим задачу"
        description="Расскажите, что нужно сделать. Если уже собрали расчёт, он появится в форме.">
        <InquiryForm brief={brief} />
      </SplitSection>
    </main>
    <SiteFooter />
  </div>
}
