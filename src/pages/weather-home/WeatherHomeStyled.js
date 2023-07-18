import styled from "styled-components";

export const WeatherHomeStyled = styled.main`
  min-height: calc(100vh - 68px - 30px);
  max-height: calc(100vh - 68px - 30px);
  overflow: auto;
  background-color: var(--wa-dr-white);
  padding: 16px;
  box-sizing: border-box;
  > h1{
    margin: 0;
    font-size: 24px;
    @media (max-width: 767px){
      font-size: 18px;
    }
  }
  > ul{
    margin: 32px 0;
    @media (max-width: 767px){
      margin: 16px 0;
    }
  }
  > .weather-ad__wrapper{
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    & ~ h1{
      margin-top: 32px;
    }
    & ~ .tab-content__wrapper{
      .table__wrapper{
        max-height: calc(100vh - 410px);
      }
    }
  }
`;
