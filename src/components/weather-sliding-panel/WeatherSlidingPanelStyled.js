import styled from 'styled-components';
import { media } from '../../utils/mediaqueries';

export const WeatherSlidingPanelStyled = styled.div.attrs(props => ({isOpen: props.isOpen}))`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  width: calc(100% - var(--wa-width-panel-right));
  box-shadow: var(--wa-box-shadow-03);
  height: 100vh;
  background-color: var(--wa-white);
  position: fixed;
  top: var(--wa-spacing-00);
  right: var(--wa-spacing-00);
  z-index: 999;
  ${media('mobile')`
    width: 100%;
  `}
  &:after{
    content: "";
    position: fixed;
    top: var(--wa-spacing-00);
    bottom: var(--wa-spacing-00);
    right: calc(100% - var(--wa-width-panel-right));
    width: var(--wa-width-panel-right);
    background-color: #00000050;
    ${media('mobile')`
      display: none;
    `}
  }
  header{
    background-color: var(--wa-dr-white);
    padding: var(--wa-spacing-04);
    box-shadow: var(--wa-box-shadow-02);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--wa-spacing-06);
    > button{
      font-size: var(--wa-font-size-2xl);
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
    h2{
      font-family: var(--wa-font-family-semibold);
      text-transform: uppercase;
      color: var(--wa-black);
      margin: var(--wa-spacing-00);
      font-size: var(--wa-font-size-md);
      ${media('mobile')`
        font-size: var(--wa-font-size-sm);
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      `}
    }
  }
  .content__wrapper{
    height: calc(100% - 150px);
    overflow: auto;
    padding: var(--wa-spacing-05);
    box-sizing: border-box;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--wa-spacing-06);
    h3{
      margin: var(--wa-spacing-00);
      font-size: var(--wa-font-size-md);
    }
  }
  .footer__wrapper{
    display: flex;
    justify-content: flex-end;
    padding: var(--wa-spacing-05);
    ${media('mobile')`
      padding: var(--wa-spacing-05) var(--wa-spacing-04);
    `}
  }
`
