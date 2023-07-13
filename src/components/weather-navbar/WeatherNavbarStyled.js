import styled from 'styled-components'

export const WeatherNavbarStyled = styled.nav`
    --width-navbar: 360px;
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    background: #fff;
    z-index: 11;
    min-width: var(--width-navbar);
    width: var(--width-navbar);
    max-width: var(--width-navbar);
    box-shadow: 0 1px 8px var(--wa-gray);
    &:after{
        content: "";
        position: fixed;
        inset: 0;
        width: calc(100% - var(--width-navbar));
        background-color: #00000050;
    }
    .button-close{
        position: absolute;
        top: 16px;
        right: 16px;
        background-color: transparent;
        border: none;
        font-size: 26px;
        color: var(--wa-deep-blue);
        cursor: pointer;
        padding: 0;
    }
    .logo__wrapper{
        display: flex;
        align-items: center;
        gap: 8px;
        position: absolute;
        left: 16px;
        top: 16px;
        > div{
            width: 36px;
            height: 36px;
        }
        > span{
            color: var(--wa-deep-blue);
            font-weight: 700;
            font-size: 14px;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            user-select: none;
        }
    }
    .content__wrapper{
        padding: 84px 18px 32px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        overflow: auto;
        > ul{
            margin: 0;
            padding: 0;
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 8px;
            a{
                color: var(--wa-deep-blue);
                font-size: 16px;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            &.block-2__wrapper{
                padding-top: 16px;
                border-top: 1px solid var(--wa-platinum);
            }
        }
    }
`
