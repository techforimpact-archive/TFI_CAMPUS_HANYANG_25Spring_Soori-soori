import '@emotion/react'
import { SOORITheme } from './theme'

declare module '@emotion/react' {
  export interface Theme {
    colors: SOORITheme['colors']
    typography: SOORITheme['typography']
  }
}
