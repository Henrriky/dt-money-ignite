import 'styled-components'
import { defaultTheme } from './../styles/themes/default'

// Tipando nosso ThemeType para a tipagem do objeto de Tema
type ThemeType = typeof defaultTheme
// Sobrescrevendo o modulo do styled-components DefaultTheme com o nosso DefaultTheme estendendo do ThemeType criado
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
