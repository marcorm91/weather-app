import styled from 'styled-components'
import { media } from '../../utils/mediaqueries'

export const WeatherAdStyled = styled.div`
  height: 2.5rem;
  background-color: var(--wa-ad);
  box-shadow: var(--wa-box-shadow-01);
  padding: var(--wa-spacing-03) var(--wa-spacing-04);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--wa-spacing-04);
  ${media('mobile')`
    gap: var(--wa-spacing-03);
  `}
  > div{
    flex: 1; // Loading
  }
  > .ad-text-title{
    white-space: nowrap;
    display: block;
    text-transform: uppercase;
    font-size: var(--wa-font-size-sm);
    font-family: var(--wa-font-family-bold);
    ${media('mobile')`
      font-size: var(--wa-font-size-xs);
    `}
  }
  .ad-text__wrapper{
    overflow: hidden;
    > span{
      user-select: none;
      display: inline-block;
      line-height: var(--wa-line-height-2);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: var(--wa-font-size-sm);
      vertical-align: middle;
      animation: scrollText 100s linear infinite;
    }
  }
  > button, > a{
    background-color: transparent;
    border: none;
    font-size: var(--wa-font-size-xl);
    padding: var(--wa-spacing-00);
    cursor: pointer;
    line-height: var(--wa-line-height-0);
    color: var(--wa-black);
  }
  ${media('mobile')`
    > a{
      display: none;
    }
  `}
`
