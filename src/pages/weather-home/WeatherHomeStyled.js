import styled from "styled-components";

export const WeatherHomeStyled = styled.main`
  min-height: calc(100vh - 68px - 30px);
  max-height: calc(100vh - 68px - 30px);
  overflow: auto;
  background-color: var(--wa-dr-white);
  padding: 16px;
  box-sizing: border-box;
  > h1{
    margin: 0;
    font-size: 24px;
  }
  > ul{
    margin: 32px 0;
  }
`;
