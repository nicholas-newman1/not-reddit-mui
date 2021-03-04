import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      card: string;
      text: string;
    };
    transitions: {
      duration: {
        standard: string;
      };
    };
    borderRadius: string;
    zIndex: {
      modal: number;
      nav: number;
    };
    shadow: string;
    hoverOpacity: number;
  }
}
