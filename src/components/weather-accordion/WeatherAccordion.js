import React from 'react'
import { WeatherAccordionStyled } from './WeatherAccordionStyled'
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import 'react-accessible-accordion/dist/fancy-example.css'

const WeatherAccordion = ({ weatherData }) => {
  return (
    <WeatherAccordionStyled>
      <Accordion>
        {weatherData.map(region => (
          <AccordionItem key={region.code}>
            <AccordionItemHeading>
              <AccordionItemButton>
                {region.community}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {region.weather}
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </WeatherAccordionStyled>
  )
}

export default WeatherAccordion
