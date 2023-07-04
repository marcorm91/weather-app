import styled from 'styled-components'

export const WeatherTabsStyled = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  border-bottom: 4px solid var(--wa-platinum);
  padding-bottom: 8px;
  user-select: none;
  > li{
    padding: 0 16px;
    position: relative;
    cursor: pointer;
    opacity: .6;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
    &.active{
        color: var(--wa-black);
        opacity: 1;
        cursor: default;
        &:after{
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: -12px;
            height: 8px;
            background-color: var(--wa-deep-blue);
        }
    }
  }
`
