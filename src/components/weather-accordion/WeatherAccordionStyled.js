import styled from "styled-components";

export const WeatherAccordionStyled = styled.div`
  .accordion{
    border: none;
    .accordion__item{
      .accordion__button{
        width: auto;
        padding: 0;
        display: inline-flex;
        align-items: center;
        font-family: var(--wa-font-family-bold);
        background-color: transparent;
        border-radius: 0;
        margin: 10px 0;
        color: var(--wa-black);
        &:before{
          width: 7px;
          height: 7px;
        }
      }
      & + .accordion__item{
        border: none;
      }
    }
    .accordion__panel{
      font-size: 14px;
      line-height: 1.5;
      padding: 0 16px;
      margin: 8px 4px;
      border-left: 1px solid var(--wa-leadbelcher);
      text-align: justify;
    }
  }
`
