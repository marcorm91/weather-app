import styled from 'styled-components';

export const WeatherCurrentGeolocationStyled = styled.div`
  display: flex;
  flex-direction: column;
  .loading-skeleton{
    width: 100%;
    height: 16rem;
  }
  > span{
    font-size: var(--wa-font-size-sm);
    > b{
        font-weight: normal;
        font-family: var(--wa-font-family-semibold);
    }
  }
  > a{
    min-width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: var(--wa-spacing-05);

  }
  > ul{
    margin: var(--wa-spacing-04) var(--wa-spacing-00) var(--wa-spacing-00) var(--wa-spacing-00);
    padding: var(--wa-spacing-00);
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--wa-spacing-03);
    > li{
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: var(--wa-font-family-semibold);
        font-size: var(--wa-font-size-sm);
        color: var(--wa-deep-blue);
        &.current-sky__wrapper{
          svg{
            width: 5.25rem;
            height: 5.25rem;
          }
          span{
            display: none;
          }
        }
        &.current-temp__wrapper{
          display: flex;
          flex-direction: column;
          margin-bottom: var(--wa-spacing-04);
            > span{
              &.main-text__wrapper{
                font-size: var(--wa-font-size-4xl);
                font-family: var(--wa-font-family-bold);
              }
            }
        }
        &.current-wind__wrapper{
          display: flex;
          flex-direction: column;
          align-items: center;
          > span{
            display: flex;
          }
        }
    }
  }
`