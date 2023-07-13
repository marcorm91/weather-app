import styled from "styled-components";

export const WeatherHeaderStyled = styled.header`
  height: 60px;
  background-color: var(--wa-deep-blue);
  color: #ffffff;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 1px 8px 1px var(--wa-gray);
  margin-bottom: 8px;
  .title__wrapper{
    display: flex;
    align-items: center;
    gap: 16px;
    user-select: none;
    > div{
      width: 36px;
      height: 36px;
    }
    > h1{
      font-weight: 700;
      font-size: 16px;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }
  .actions__wrapper{
      display: flex;
      align-items: center;
      gap: 16px;
      > button{
        background-color: transparent;
        border: none;
        color: var(--wa-white);
        font-size: 26px;
        cursor: pointer;
      }
  }
`
