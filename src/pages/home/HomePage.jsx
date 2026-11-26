import { useState } from 'react'
import { EstimateWizard } from '../../features/estimate/EstimateWizard'
import { InquiryForm } from '../../features/inquiry/InquiryForm'
import { SplitSection } from '../../shared/layout/Section'
import { Faq } from './Faq'
import { Hero } from './Hero'
import { Services, Solutions } from './Offers'
import { Portfolio } from './Portfolio'
import { Process } from './Process'
import { SiteHeader, SiteFooter, SkipLink } from './SiteChrome'
import { TaskPaths } from './TaskPaths'

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
      <Hero />
      <TaskPaths onSelect={selectProject} />
      <Solutions onSelect={selectProject} />
      <Services onSelect={selectProject} />
      <Process />
      <SplitSection id="estimate" label="Конфигуратор" title="Соберите свой проект"
        description="Выберите задачу и подключения. Получите ориентир в рублях и перенесите расчёт в заявку.">
        <EstimateWizard selectedRoute={selection.id} selectedProject={selection.project}
          requestId={selection.sequence} onBrief={setBrief} />
      </SplitSection>
      <Portfolio />
      <Faq />
      <SplitSection id="contact" label="Обратная связь" title="Обсудим задачу"
        description="Опишите задачу своими словами. Мы уточним детали и предложим, с чего начать. Если вы собрали расчёт, он приложится к заявке.">
        <InquiryForm brief={brief} onRemoveBrief={() => setBrief(null)} />
      </SplitSection>
    </main>
    <SiteFooter />
  </div>
}
