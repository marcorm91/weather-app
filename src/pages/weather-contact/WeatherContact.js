import React from 'react'
import { WeatherContactStyled } from './WeatherContactStyled'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNodes, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

const WeatherContact = () => {

  const { t } = useTranslation()

  const servicesList = [
    { text: 'Generali' },
    { text: 'Bidafarma' },
    { text: 'Bitban' },
    { text: 'Viajes el Corte Inglés' },
    { text: 'Simon Electric' },
    { text: 'Triodos Bank' },
    { text: 'MUFACE' },
    { text: '+Vision' },
    { text: 'BDEO' },
    { text: 'Exolum' }
  ]
  
  return (
    <WeatherContactStyled>
      <div className='col__wrapper'>
        <h2>{t("ABOUTME.COL1.COL1_1.TITLE")}</h2>
        <p>{t("ABOUTME.COL1.COL1_1.P1")}</p>
        <p>{t("ABOUTME.COL1.COL1_1.P2")}</p>
        <p>{t("ABOUTME.COL1.COL1_1.P3")}</p>
        <p>{t("ABOUTME.COL1.COL1_1.P4")}</p>
        <ul>
          {servicesList.map((item, index) => (
            <li key={index}>{item.text}</li>
        ))}
        </ul>
        <h2>{t("ABOUTME.COL1.COL1_2.TITLE")}</h2>
        <p>{t("ABOUTME.COL1.COL1_2.P1")}</p>
        <p>{t("ABOUTME.COL1.COL1_2.P2")}</p>
        <p>{t("ABOUTME.COL1.COL1_2.P3")}</p>
        <p>{t("ABOUTME.COL1.COL1_2.P4")}</p>
      </div>
      <div className='col__wrapper'>
        <h2>{t("ABOUTME.COL2.TITLE")}</h2>
        <ul className='contact__wrapper'>
          <li>
            <Link to="https://www.linkedin.com/in/marcorm91/" target='_blank'>
              <FontAwesomeIcon icon={faCircleNodes} /> LinkedIn
            </Link>
          </li>
          <li>
            <Link to="mailto:marco_antonio88_9@hotmail.com" target='_blank'>
              <FontAwesomeIcon icon={faEnvelope} /> marco_antonio88_9@hotmail.com
            </Link>
          </li>
        </ul>
      </div>
    </WeatherContactStyled>
  )
}

export default WeatherContact
