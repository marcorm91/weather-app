import styled from 'styled-components'

export const WeatherLangSelectorStyled = styled.select`
  background-color: transparent;
  border: var(--wa-border-width-01) solid var(--wa-white);
  padding: var(--wa-spacing-03);
  box-sizing: border-box;
  border-radius: var(--wa-size-border-radius-01);
  color: var(--wa-white);
  &:focus{
    border: var(--wa-border-width-01) solid var(--wa-white);
  }
  option{
    color: var(--wa-black);
  }
`
