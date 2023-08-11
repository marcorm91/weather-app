import styled from 'styled-components';

export const WeatherAdWarningStyled = styled.div`
    position: absolute;
    top: var(--wa-spacing-00);
    right: var(--wa-spacing-00);
    left: var(--wa-spacing-00);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--wa-spacing-01) var(--wa-spacing-02);
    box-sizing: border-box;
    background-color: var(--wa-orange);
    .react-tooltip[role="tooltip"]{
       padding: var(--wa-spacing-02);
       ul{
        margin: var(--wa-spacing-00);
        padding: var(--wa-spacing-00);
        display: flex;
        flex-direction: column;
        gap: var(--wa-spacing-02);
        list-style: none;
        font-family: var(--wa-font-family-semibold);
        > li:not(:last-child){
            border-bottom: var(--wa-border-width-01) solid var(--wa-white);
            padding-bottom: var(--wa-spacing-03);
        }
       }
    }
    > svg{
        font-size: var(--wa-font-size-lg);
        width: 100%;
    }
`
