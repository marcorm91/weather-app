import styled from 'styled-components'

export const WeatherAccordionStyled = styled.div`
  .accordion{
    border: none;
    .accordion__item{
      .accordion__button{
        width: auto;
        padding: var(--wa-spacing-00);
        display: inline-flex;
        align-items: center;
        font-family: var(--wa-font-family-bold);
        background-color: transparent;
        border-radius: var(--wa-size-border-radius-00);
        margin: var(--wa-spacing-03) var(--wa-spacing-00);
        color: var(--wa-black);
        &:before{
          width: 0.4375rem;
          height: 0.4375rem;
        }
      }
      & + .accordion__item{
        border: none;
      }
    }
    .accordion__panel{
      font-size: var(--wa-font-size-sm);
      line-height: var(--wa-line-height-1);
      padding: var(--wa-spacing-00) var(--wa-spacing-04);
      margin: var(--wa-spacing-03) var(--wa-spacing-02);
      border-left: var(--wa-border-width-01) solid var(--wa-leadbelcher);
      text-align: justify;
    }
  }
`
