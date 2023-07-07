import styled from "styled-components";

export const WeatherTableStyled = styled.div`
  margin: 14px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  .table-top__wrapper{
    display: flex;
    align-self: flex-end;
    gap: 32px;
    > input{
      min-width: 340px;
    }
  }
  .table__wrapper{
    width: 100%;
    max-height: calc(100vh - 375px);
    overflow: auto;
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
                }
            }
        }
    }
  }
`
