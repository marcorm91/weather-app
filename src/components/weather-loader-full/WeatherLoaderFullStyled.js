import styled from 'styled-components'

export const WeatherLoaderFullStyled = styled.div`
    animation: fadeIn 1s;
    position: fixed;
    inset: var(--wa-spacing-08) 0 var(--wa-spacing-06);
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: calc(-1 * var(--wa-spacing-01));
    > div{
        width: 150px;
        height: 150px;
        animation: rotation 2s infinite linear;
    }
`
