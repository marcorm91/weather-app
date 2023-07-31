import styled from 'styled-components'
import { media } from '../../utils/mediaqueries';

export const WeatherNavbarStyled = styled.nav`
    position: fixed;
    right: var(--wa-spacing-00);
    top: var(--wa-spacing-00);
    bottom: var(--wa-spacing-00);
    background: #fff;
    z-index: 11;
    min-width: var(--wa-width-main-navbar);
    width: var(--wa-width-main-navbar);
    max-width: var(--wa-width-main-navbar);
    box-shadow: 0 1px 8px var(--wa-gray);
    &:after{
        content: "";
        position: fixed;
        inset: var(--wa-spacing-00);
        width: calc(100% - var(--wa-width-main-navbar));
        background-color: #00000050;
    }
    .button-close{
        position: absolute;
        top: var(--wa-spacing-04);
        right: var(--wa-spacing-04);
        background-color: transparent;
        border: none;
        font-size: var(--wa-font-size-3xl);
        color: var(--wa-deep-blue);
        cursor: pointer;
        padding: var(--wa-spacing-00);
    }
    .logo__wrapper{
        display: flex;
        align-items: center;
        gap: var(--wa-spacing-03);
        position: absolute;
        left: var(--wa-spacing-04);
        top: var(--wa-spacing-04);
        > div{
            width: 36px;
            height: 36px;
        }
        > span{
            color: var(--wa-deep-blue);
            font-family: var(--wa-font-family-semibold);
            font-size: var(--wa-font-size-sm);
            margin: var(--wa-spacing-00);
            text-transform: uppercase;
            letter-spacing: 1px;
            user-select: none;
        }
    }
    .content__wrapper{
        padding: var(--wa-spacing-09) var(--wa-spacing-04) var(--wa-spacing-06);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        overflow: auto;
        > ul{
            margin: var(--wa-spacing-00);
            padding: var(--wa-spacing-00);
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: var(--wa-spacing-03);
            a{
                color: var(--wa-deep-blue);
                font-size: var(--wa-font-size-md);
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: var(--wa-spacing-03);
                ${media('mobile')`
                    font-size: var(--wa-font-size-sm);
                `}
                &.active{
                    font-family: var(--wa-font-family-semibold);
                }
            }
            &.block-2__wrapper{
                padding-top: var(--wa-spacing-04);
                border-top: var(--wa-border-width-01) solid var(--wa-platinum);
            }
        }
    }
`
