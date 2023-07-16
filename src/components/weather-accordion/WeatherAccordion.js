import React from 'react'
import { WeatherAccordionStyled } from './WeatherAccordionStyled'
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import 'react-accessible-accordion/dist/fancy-example.css'

const WeatherAccordion = () => {

  return (
    <WeatherAccordionStyled>
      <Accordion>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              Item 1
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            Contenido del Item 1
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              Item 2
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            Contenido del Item 2
          </AccordionItemPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              Item 3
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            Contenido del Item 3
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </WeatherAccordionStyled>
  )
}

export default WeatherAccordion
