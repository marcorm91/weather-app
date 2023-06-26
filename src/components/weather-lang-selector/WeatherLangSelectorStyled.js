import styled from "styled-components";

export const WeatherLangSelectorStyled = styled.select`
  background-color: transparent;
  border: 1px solid var(--wa-white);
  padding: 8px;
  box-sizing: border-box;
  border-radius: 4px;
  color: var(--wa-white);
  &:focus{
    border: 1px solid var(--wa-white);
  }
  option{
    color: var(--wa-black);
  }
`
