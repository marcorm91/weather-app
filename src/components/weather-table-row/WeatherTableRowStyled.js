import styled from 'styled-components'

export const WeatherTableRowStyled = styled.tr`
    &{
        transition: ease-in .2s;
        user-select: none;
        td{
            padding: var(--wa-spacing-03) var(--wa-spacing-02);
            border-bottom: var(--wa-border-width-01) solid var(--wa-platinum);
            &.hide-column{
                display: none;
            }
            &:last-child{
                text-align: right;
            }
        }
        &:nth-child(even){
            background-color: var(--wa-leadbelcher-op25);
            td{
                border-bottom: var(--wa-border-width-01) solid var(--wa-leadbelcher);
            }
        }
        &:hover{
            background-color: var(--wa-leadbelcher-op50);
        }
    }
`;
