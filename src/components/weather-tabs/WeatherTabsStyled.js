import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherTabsStyled = styled.ul`
  list-style: none;
  display: flex;
  border-bottom: var(--wa-border-width-04) solid var(--wa-platinum);
  padding: var(--wa-spacing-00) var(--wa-spacing-00) var(--wa-spacing-03) var(--wa-spacing-00);
  user-select: none;
  position: relative;
  &:after{
    content: "";
    position: absolute;
    right: var(--wa-spacing-00);
    bottom: calc(-1 * var(--wa-spacing-03));
    height: 0.5rem;
    width: 10%;
    background: linear-gradient(to left, rgb(255, 255, 255) 0%,rgba(255,255,255,0) 100%);
  }
  > li{
    padding: var(--wa-spacing-00) var(--wa-spacing-04);
    position: relative;
    cursor: pointer;
    opacity: .6;
    font-family: var(--wa-font-family-semibold);
    display: flex;
    align-items: center;
    text-align: center;
    gap: var(--wa-spacing-03);
    ${media('mobile')`
      font-size: var(--wa-font-size-sm);
      max-width: 5.625rem;
    `}
    &.active{
        color: var(--wa-black);
        opacity: 1;
        cursor: default;
        &:after{
            content: "";
            position: absolute;
            left: var(--wa-spacing-00);
            right: var(--wa-spacing-00);
            bottom: calc(-1 * var(--wa-spacing-04));
            height: 0.5rem;
            background-color: var(--wa-deep-blue);
        }
    }
  }
`
