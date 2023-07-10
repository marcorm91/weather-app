import styled from "styled-components";

export const WeatherAdStyled = styled.div`
  height: 40px;
  background-color: var(--wa-ad);
  box-shadow: 0px 1px 8px 1px var(--wa-gray);
  padding: 8px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span{
    display: block;
    max-width: calc(100% - 32px);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  > button{
    background-color: transparent;
    border: none;
    font-size: 22px;
    padding: 0;
    cursor: pointer;
  }
`
