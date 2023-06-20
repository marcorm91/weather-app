import styled from "styled-components";

export const WeatherTableRowStyled = styled.tr`
    &{
        transition: ease-in .2s;
        user-select: none;
        td{
            padding: 6px 4px;
            &:last-child{
                text-align: right;
            }
        }
        &:nth-child(even){
            background-color: #CACACA25;
            td{
                border-bottom: 1px solid var(--wa-leadbelcher);
            }
        }
        &:hover{
            background-color: #CACACA50;
        }
    }
`;
