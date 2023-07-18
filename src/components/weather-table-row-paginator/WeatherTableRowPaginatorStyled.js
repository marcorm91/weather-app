import styled from "styled-components";

export const WeatherTableRowPaginatorStyled = styled.div`
  &{
    align-self: flex-end;
    display: flex;
    gap: 16px;
    margin-top: 16px;
    button{
        background-color: transparent;
        border: none;
        border-radius: 0;
        outline: none;
        font-size: 16px;
        cursor: pointer;
    }
    > span{
        display: flex;
        align-items: center;
        gap: 8px;
    }
    @media (max-width: 767px){
      button, span, select{
        font-size: 13px;
        text-align: center;
      }
    }
  }
`
