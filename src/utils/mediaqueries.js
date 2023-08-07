import { css } from 'styled-components'

export const breakpoints = {
  mobile: '767px',
  tablet: '1024px',
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
    } else if (breakpoint === 'tablet') {
      return (...args) => css`
        @media (max-width: ${breakpoints[breakpoint]}) {
          ${css(...args)}
        }
      `
    } else {
      return (...args) => css`
        @media (min-width: ${breakpoints[breakpoint]}) {
          ${css(...args)}
        }
      `
    }
  } else {
    console.warn(`Breakpoint ${breakpoint} does not exist in the variable map.`)
    return () => {}
  }
}