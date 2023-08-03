import styled from 'styled-components';

export const WeatherPredictionHoursStyled = styled.div`
  > ul{
    list-style: none;
    margin: 32px 0;
    padding: 0;
    display: grid;
    gap: 4px;
    grid-template-columns: repeat(14, 1fr);
    > li{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        > div{
            width: 70px;
            height: 70px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            user-select: none;
        }
        &:first-child{
            background-color: var(--wa-deep-blue-op20);
        }
        &:not(:first-child){
            background-color: var(--wa-deep-blue-op10);
            transition: 0.3s;
            > div{
                font-family: var(--wa-font-family-semibold);
                font-size: var(--wa-font-size-sm);
            }
            &:hover{
                background-color: var(--wa-deep-blue-op20);
            }
        }
    }
  }
`

export const WeatherPredictionHoursSkeletonStyled = styled.ul`
    list-style: none;
    margin: 32px 0;
    padding: 0;
    display: grid;
    gap: 4px;
    grid-template-columns: repeat(14, 1fr);
    > li{
        > div{
            width: 70px;
            height: 70px;
            border-radius: 0;
        }
    }
`
