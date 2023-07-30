import styled from 'styled-components'
import { media } from '../../utils/mediaqueries';

export const WeatherCurrentPredictionStyled = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
    > div:first-child{
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 21px;
      > span{
        font-size: 48px;
        font-family: var(--wa-font-family-semibold);
        position: relative;
        &:after{
          content: 'º';
          position: absolute;
          font-size: 26px;
        }
      }
      > div{
        display: flex;
        align-items: center;
        flex-direction: column;
        > span{
          font-size: 12px;
        }
      }
    }
    > div:last-child{
      ul{
        display: flex;
        justify-content: center;
        gap: 32px;
        margin: 0;
        padding: 0;
        list-style: none;
        ${media('mobile')`
          flex-wrap: wrap;
          gap: 16px 48px;
        `}
        li{
          display: flex;
          align-items: center;
          gap: 4px;
          ${media('mobile')`
            flex: 1 1 calc(50% - 24px);
            &:nth-child(odd){
              justify-content: flex-end;
            }
            &:nth-child(even){
              justify-content: flex-start;
            }
          `}
          &.temperature__wrapper{
            display: flex;
            gap: 8px;
            > span{
              font-size: 16px;
              font-family: var(--wa-font-family-semibold);
              position: relative;
              &:after{
                content: 'º';
                position: absolute;
                font-size: 12px;
              }
            }
          }
          &.humidity__wrapper{
            > span{
              display: flex;
              gap: 2px;
              font-size: 16px;
              font-family: var(--wa-font-family-semibold);
              &:after{
                content: "%";
              }
            }
          }
          &.wind__wrapper{
            gap: 12px;
            > span{
              display: flex;
              gap: 2px;
              font-size: 16px;
              font-family: var(--wa-font-family-semibold);
              &:last-child{
                line-height: 0;
                font-size: 14px;
                gap: 0;
                align-items: center;
              }
            }
          }
          &.precipitation__wrapper{
            gap: 12px;
            > span{
              display: flex;
              gap: 2px;
              font-size: 16px;
              font-family: var(--wa-font-family-semibold);
              &:last-child{
                line-height: 0;
                font-size: 14px;
                gap: 0;
                align-items: center;
              }
            }
          }
          &:not(:last-child):after{
            content: "|";
            display: inline-flex;
            margin-left: 28px;
            ${media('mobile')`
              display: none;
            `}
          }
        }
      }
    }
`
