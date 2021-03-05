const theme = {
  colors: {
    primary: {
      main: '#008aa6',
      text: '#fff',
    },
    secondary: {
      main: '#c28800',
      text: '#fff',
    },
  },
  transitions: {
    duration: {
      standard: '200ms',
    },
  },
  borderRadius: '5px',
  zIndex: {
    modal: 200,
    nav: 100,
  },
  shadow: '5px 5px 5px rgba(0, 0, 0, 0.15)',
  hoverOpacity: 0.8,
};

export const light = {
  ...theme,
  colors: {
    ...theme.colors,
    background: '#fff',
    card: '#e1e1e1',
    text: '#000',
  },
};

export const dark = {
  ...theme,
  colors: {
    ...theme.colors,
    background: '#1a1a1a',
    card: '#333',
    text: '#eee',
  },
};
