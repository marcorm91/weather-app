import styled from 'styled-components'

export const WeatherCurrentSkyStyled = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  > span{
    font-size: var(--wa-font-size-sm);
    font-family: var(--wa-font-family-semibold);
    text-transform: uppercase;
  }
`
