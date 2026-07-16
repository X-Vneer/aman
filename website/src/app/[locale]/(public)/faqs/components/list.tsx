"use client"
import React from "react"
import { Accordion } from "@heroui/react"
import { Minus, Plus } from "lucide-react"
import { FAQ } from "../types"

type Props = {
  data: FAQ[]
}

const List = (props: Props) => {
  return (
    <div className="px-5 pb-4 md:px-8 md:pb-5 lg:px-16 lg:pb-6">
      <Accordion hideSeparator className="w-full">
        {props.data.map((faq) => {
          return (
            <Accordion.Item key={faq.id} id={String(faq.id)} className="text-default-600">
              <Accordion.Heading>
                <Accordion.Trigger className="flex w-full items-center gap-3 text-start [&[aria-expanded='true']_.faq-acc-icon-minus]:flex [&[aria-expanded='true']_.faq-acc-icon-plus]:hidden">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border md:size-10 lg:size-12">
                    <Plus className="faq-acc-icon-plus text-primary size-4 md:size-5 lg:size-6" />
                    <Minus className="faq-acc-icon-minus text-primary hidden size-4 md:size-5 lg:size-6" />
                  </div>
                  <span className="flex-1">{faq.title}</span>
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>{faq.description}</Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          )
        })}
      </Accordion>
      <div className="sr-only" aria-hidden="false">
        <dl>
          {props.data.map((faq) => (
            <React.Fragment key={`seo-${faq.id}`}>
              <dt>{faq.title}</dt>
              <dd>{faq.description}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
    </div>
  )
}

export default List
