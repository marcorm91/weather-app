import styled from "styled-components";

export const WeatherTableStyled = styled.div`
  margin: 14px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  @media (max-width: 767px){
    margin: 24px 0 0 0;
  }
  .table-top__wrapper{
    display: flex;
    align-self: flex-end;
    gap: 32px;
    @media (max-width: 767px){
      flex-direction: column;
      gap: 16px;
      align-self: auto;
      width: 100%;
    }
    > input{
      min-width: 340px;
    }
  }
  .table__wrapper{
    width: 100%;
    max-height: calc(100vh - 380px);
    overflow: auto;
    @media (max-width: 767px){
      max-height: calc(100vh - 420px);
    }
    table{
        width: 100%;
        text-align: left;
        border-spacing: 0;  
        thead{
            position: sticky;
            top: 0;
            background-color: var(--wa-dr-white);
            tr{
                th{
                    border-bottom: 2px solid var(--wa-leadbelcher);
                    padding: 6px 4px;
                    font-weight: normal;
                    font-family: var(--wa-font-family-semibold);
                }
            }
            @media (max-width: 767px){
              display: none;
            }
        }
        tbody{
          tr{
            @media (max-width: 767px){
              display: flex;
              flex-direction: column;
            }
            td{
              @media (max-width: 767px){
                min-width: 100%;
                border-bottom: none;
                padding: 4px;
                box-sizing: border-box;
                font-size: 13px;
                label{
                  font-family: var(--wa-font-family-semibold);
                  margin-right: 4px;
                }
              }
              span{
                &.no-results-text{
                    display: block;
                    font-family: var(--wa-font-family-semibold);
                    font-size: 400;
                    margin: 16px 0;
                }
              }
            }
          }
        }
    }
  }
`
