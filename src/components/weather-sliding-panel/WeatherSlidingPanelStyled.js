import styled from 'styled-components';

export const WeatherSlidingPanelStyled = styled.div.attrs(props => ({isOpen: props.isOpen}))`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  --width-panel: 256px;
  width: calc(100% - var(--width-panel));
  box-shadow: -2px 0px 2px 1px #00000020;
  height: 100vh;
  background-color: #fff;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  @media (max-width: 767px){
    width: 100%;
  }
  &:after{
    content: "";
    position: fixed;
    top: 0;
    bottom: 0;
    right: calc(100% - var(--width-panel));
    width: var(--width-panel);
    background-color: #00000050;
    @media (max-width: 767px){
      display: none;
    }
  }
  header{
    background-color: var(--wa-dr-white);
    padding: 16px;
    box-shadow: 1px 3px 2px 0px var(--wa-leadbelcher);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
    > button{
      font-size: 22px;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
    h2{
      font-weight: 700;
      text-transform: uppercase;
      color: var(--wa-black);
      margin: 0;
      font-size: 16px;
      @media (max-width: 767px){
        font-size: 14px;
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  .content__wrapper{
    height: calc(100% - 150px);
    overflow: auto;
    padding: 24px;
    box-sizing: border-box;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 32px;
    h3{
      font-weight: normal;
      margin: 0;
      font-size: 16px;
    }
  }
  .footer__wrapper{
    display: flex;
    justify-content: flex-end;
    padding: 24px;
    @media (max-width: 767px){
      padding: 24px 16px;
    }
  }
`
