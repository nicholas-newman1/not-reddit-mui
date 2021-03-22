import {
  PaletteType,
  // solves findDOMNode deprecation warnings
  unstable_createMuiStrictModeTheme,
} from '@material-ui/core';

function getTheme(theme: { paletteType: PaletteType }) {
  return unstable_createMuiStrictModeTheme({
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
    typography: {
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 700,
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
  MuiPaper: {
    elevation: 0,
  },
  MuiIconButton: {
    size: 'small',
  },
  MuiSvgIcon: {
    fontSize: 'large',
  },
  MuiButton: {
    disableElevation: true,
  },
};

theme.overrides = {
  MuiCssBaseline: {
    '@global': {
      '*::-webkit-scrollbar': {
        width: '0.6em',
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.3)',
      },
    },
  },
  MuiIconButton: {
    root: {
      color: theme.palette.text.primary,
    },
  },
  MuiButton: {
    root: {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  MuiInputBase: {
    input: {
      transition: 'background-color 5000s ease-in-out 0s',
      WebkitTextFillColor: theme.palette.text.primary,
      caretColor: theme.palette.text.primary,
    },
  },
};
