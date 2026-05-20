'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface FaqItemProps {
  question: string
  answer: string
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-8 py-6 text-left"
      >
        <span className="font-sans text-sm font-medium text-foreground">{question}</span>
        <Plus
          className="mt-0.5 h-4 w-4 shrink-0 text-gold transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '300px' : '0px' }}
      >
        <p className="pb-6 font-sans text-sm leading-relaxed text-muted">{answer}</p>
      </div>
    </div>
  )
}

interface FaqAccordionProps {
  items: { question: string; answer: string }[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <div className="divide-y divide-border border-t border-border">
      {items.map((item) => (
        <FaqItem key={item.question} question={item.question} answer={item.answer} />
      ))}
    </div>
  )
}
