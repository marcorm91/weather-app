import styled from "styled-components";

export const WeatherMoreInfoStyled = styled.main`
  min-height: calc(100vh - 68px - 30px);
  max-height: calc(100vh - 68px - 30px);
  overflow: auto;
  background-color: var(--wa-dr-white);
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  gap: 16px;
  > .col__wrapper{
    &:first-child{
      flex: 1 1 60%;
      > h2{
        margin: 0;
      }
    }
    &:last-child{
      flex: 1 1 40%;
      background-color: var(--wa-deep-blue-op10);
      padding: 16px 32px;
      box-sizing: border-box;
      border-radius: 8px;
      position: sticky;
      overflow: auto;
      max-height: 100%;
      border-right: 8px solid var(--wa-deep-blue);
      &:after{
        content: "";
        position: absolute;
        left: -8px;
        bottom: 0;
        top: 0;
        margin: auto;
        width: 16px;
        height: 16px;
        background-color: var(--wa-dr-white);
        transform: rotate(45deg);
      }
      > div{
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    }
  }
`;
