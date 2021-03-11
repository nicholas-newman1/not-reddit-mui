import { createMuiTheme, PaletteType } from '@material-ui/core';

function getTheme(theme: { paletteType: PaletteType }) {
  return createMuiTheme({
    palette: {
      type: theme.paletteType,
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
  MuiIconButton: {
    size: 'small',
  },
  MuiSvgIcon: {
    fontSize: 'large',
  },
};

theme.overrides = {
  MuiIconButton: {
    root: {
      color: theme.palette.text.primary,
    },
  },
};
