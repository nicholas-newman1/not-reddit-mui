import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import CardMenuItem from '.';
import { dark } from '../../../theme';

describe('<CardMenuItem />', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme={dark}>
        <CardMenuItem />
      </ThemeProvider>
    );
  });

  it('renders children', () => {
    const { getByText } = render(
      <ThemeProvider theme={dark}>
        <CardMenuItem>
          <h1>child</h1>
        </CardMenuItem>
      </ThemeProvider>
    );
    getByText(/child/);
  });
});
