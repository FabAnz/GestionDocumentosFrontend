import React, { useState } from 'react'
import { Card } from '../ui/card'
import { CardTitle } from '../atoms/CardTitle'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { AddDocumentForm } from '../molecules/AddDocumentForm'

export const AddDocument = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [accordionValue, setAccordionValue] = React.useState('')

  // Mantener el acordeón abierto cuando está subiendo
  React.useEffect(() => {
    if (isSubmitting) {
      setAccordionValue('add-document')
    }
  }, [isSubmitting])

  return (
    <Card className="transition-all duration-200 group p-0 overflow-hidden [&:has([data-state=closed])]:cursor-pointer [&:has([data-state=closed])]:hover:bg-accent [&:has([data-state=closed])]:hover:shadow-md [&:has([data-state=open])]:cursor-default">
      <Accordion 
        type="single" 
        collapsible 
        className="w-full"
        value={accordionValue}
        onValueChange={(value) => {
          // No permitir cerrar el acordeón mientras está subiendo
          if (!isSubmitting) {
            setAccordionValue(value)
          }
        }}
      >
        <AccordionItem value="add-document" className="border-none w-full">
          <AccordionTrigger 
            className={cn(
              "w-full p-6 hover:no-underline min-h-[inherit] group/trigger transition-all duration-200",
              isSubmitting 
                ? "cursor-not-allowed opacity-60 pointer-events-none" 
                : "cursor-pointer [&[data-state=open]]:bg-transparent [&[data-state=open]]:hover:bg-accent [&[data-state=open]]:hover:shadow-md [&[data-state=open]]:rounded-lg"
            )}
          >
            <CardTitle icon={Upload} className="transition-transform duration-200 [.group:has([data-state=closed])_&]:group-hover:translate-x-1 [.group\/trigger:hover_&]:translate-x-1">
              Agregar Documento
            </CardTitle>
          </AccordionTrigger>
          <AccordionContent>
            <AddDocumentForm onSubmittingChange={setIsSubmitting} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

