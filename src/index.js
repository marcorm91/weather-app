import React from 'react'
import ReactDOM from 'react-dom/client'
import './utils/main.scss'
import './styles.scss'
import { I18nextProvider } from 'react-i18next'
import i18n from './resources/i18n/i18n'
import '@fortawesome/fontawesome-svg-core/styles.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
)
