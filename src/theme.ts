import { createMuiTheme } from '@material-ui/core';

function getTheme(theme: { paletteType: string }) {
  return createMuiTheme({
    palette: {
      type: 'light',
      primary: {
        main: '#008aa6',
      },
      secondary: {
        main: '#c28800',
      },
      background: {
        paper: theme.paletteType === 'dark' ? '#333' : '#e1e1e1',
        default: theme.paletteType === 'dark' ? '#1a1a1a' : '#fff',
      },
    },
  });
}

export const theme = getTheme({
  paletteType: 'dark',
});

theme.props = {
  MuiCard: {
    elevation: 0,
  },
};
