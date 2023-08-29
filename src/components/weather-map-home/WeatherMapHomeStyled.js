import styled from 'styled-components'

export const WeatherMapHomeStyled = styled.div`
    position: relative;
    height: 100%;
    #map{
      width: 100%;
      height: 100%;
      z-index: 1;
      & + button{
        position: absolute;
        left: 8px;
        bottom: 8px;
        z-index: 2;
      }
    }


`
