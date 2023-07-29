import styled from "styled-components";

export const WeatherContactStyled = styled.main`
  min-height: calc(100vh - 68px - 30px);
  max-height: calc(100vh - 68px - 30px);
  overflow: auto;
  background-color: var(--wa-dr-white);
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  gap: 32px;
  @media (max-width: 767px){
    flex-direction: column-reverse;
    gap: 16px;
  }
  > .col__wrapper{
    h2, p{
      margin: 0 0 18px 0;
    }
    p, a, ul{
      font-size: 14px;
    }
    ul{
      list-style: square;
      &.contact__wrapper{
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 0;
        a{
          text-decoration: none;
          color: var(--wa-black);
          font-family: var(--wa-font-family-medium);
          display: flex;
          align-items: center;
          gap: 8px;
          svg{
            color: var(--wa-deep-blue);
          }
        }
      }
    }
    &:first-child{
      flex: 1 1 75%;
      @media (max-width: 767px){
        flex: 1 1 100%;
      }
    }
    &:last-child{
      flex: 1 1 25%;
      position: sticky;
      top: 0;
      padding-left: 32px;
      border-left: 1px solid var(--wa-leadbelcher);
      @media (max-width: 767px){
        flex: 1 1 100%;
        border-left: 0;
        padding-left: 0;
        position: static;
      }
    }
  }
`;
