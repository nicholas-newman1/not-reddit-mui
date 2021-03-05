import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: {
        main: string;
        text: string;
      };
      secondary: {
        main: string;
        text: string;
      };
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
