import styled from "styled-components";

export const WeatherLoaderFullStyled = styled.div`
    animation: fadeIn 1s;
    position: fixed;
    inset: 60px 0 30px;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    > div{
        width: 150px;
        height: 150px;
        animation: rotation 2s infinite linear;
    }
`
