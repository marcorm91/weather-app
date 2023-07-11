import styled from "styled-components";

export const WeatherAdStyled = styled.div`
  height: 40px;
  background-color: var(--wa-ad);
  box-shadow: 0px 1px 8px 1px var(--wa-gray);
  padding: 8px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  > .ad-text-title{
    display: contents;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 700;
  }
  .ad-text__wrapper{
    overflow: hidden;
    > span{
      user-select: none;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 13px;
      vertical-align: middle;
      animation: scrollText 100s linear infinite;
    }
  }
  > button{
    background-color: transparent;
    border: none;
    font-size: 22px;
    padding: 0;
    cursor: pointer;
  }

@keyframes scrollText {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}`
