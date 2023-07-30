import { css } from 'styled-components'
import { between } from 'polished'

export const breakpoints = {
  mobile: '767px',
  tablet: '768px',
  desktop: '1200px',
}

export const media = (breakpoint) => {
  if (breakpoints[breakpoint]) {
    if (breakpoint === 'mobile') {
      return (...args) => css`
        @media (max-width: ${breakpoints[breakpoint]}) {
          ${css(...args)}
        }
      `
    } else {
      return (...args) => css`
        @media ${between(breakpoints[breakpoint], breakpoints.desktop)} {
          ${css(...args)}
        }
      `
    }
  } else {
    console.warn(`Breakpoint ${breakpoint} does not exist in the variable map.`)
    return () => {}
  }
}