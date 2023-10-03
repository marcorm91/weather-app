import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherFooterStyled = styled.footer`
  height: var(--wa-footer-height);
  background-color: var(--wa-deep-blue);
  color: var(--wa-white);
  padding: var(--wa-spacing-03) var(--wa-spacing-04);
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  p{
    margin: var(--wa-spacing-00);
    font-size: var(--wa-font-size-xs);
    font-family: var(--wa-font-family-light);
    ${media('mobile')`
      font-size: var(--wa-font-size-2xs);
    `}
  }
`