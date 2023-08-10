import styled from 'styled-components'
import { media } from '../../utils/mediaqueries';

export const WeatherCurrentPredictionStyled = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: var(--wa-spacing-02);
    > div:first-child{
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--wa-spacing-05);
      > span{
        font-size: var(--wa-font-size-7xl);
        font-family: var(--wa-font-family-semibold);
        position: relative;
        &:after{
          content: 'º';
          position: absolute;
          font-size: var(--wa-font-size-2xl);
        }
      }
      > div{
        display: flex;
        align-items: center;
        flex-direction: column;
        > span{
          font-size: var(--wa-font-size-xs);
        }
      }
    }
    > div:last-child{
      ul{
        display: flex;
        justify-content: center;
        gap: var(--wa-spacing-06);
        margin: var(--wa-spacing-00);
        padding: var(--wa-spacing-00);
        list-style: none;
        ${media('mobile')`
          flex-wrap: wrap;
          gap: var(--wa-spacing-04) var(--wa-spacing-08);
        `}
        li{
          display: flex;
          align-items: center;
          gap: var(--wa-spacing-02);
          ${media('mobile')`
            flex: 1 1 calc(50% - var(--wa-spacing-05));
            &:nth-child(odd){
              justify-content: flex-end;
            }
            &:nth-child(even){
              justify-content: flex-start;
            }
          `}
          &.temperature__wrapper{
            display: flex;
            gap: var(--wa-spacing-03);
            > span{
              font-size: var(--wa-font-size-md);
              font-family: var(--wa-font-family-semibold);
              position: relative;
              &:after{
                content: 'º';
                position: absolute;
                font-size: var(--wa-font-size-xs);
              }
            }
          }
          &.humidity__wrapper{
            > span{
              display: flex;
              gap: var(--wa-spacing-01);
              font-size: var(--wa-font-size-md);
              font-family: var(--wa-font-family-semibold);
              &:after{
                content: "%";
              }
            }
          }
          &.wind__wrapper{
            gap: var(--wa-spacing-03);
            > span{
              display: flex;
              gap: var(--wa-spacing-01);
              font-size: var(--wa-font-size-md);
              font-family: var(--wa-font-family-semibold);
              &:last-child{
                line-height: var(--wa-line-height-0);
                font-size: var(--wa-font-size-sm);
                gap: var(--wa-spacing-00);
                align-items: center;
              }
            }
          }
          &.precipitation__wrapper{
            gap: var(--wa-spacing-03);
            > span{
              display: flex;
              gap: var(--wa-spacing-01);
              font-size: var(--wa-font-size-md);
              font-family: var(--wa-font-family-semibold);
              &:last-child{
                line-height: var(--wa-line-height-0);
                font-size: var(--wa-font-size-sm);
                gap: var(--wa-spacing-00);
                align-items: center;
              }
            }
          }
          &:not(:last-child):after{
            content: "|";
            display: inline-flex;
            margin-left: var(--wa-spacing-05);
            ${media('mobile')`
              display: none;
            `}
          }
        }
      }
    }
`
