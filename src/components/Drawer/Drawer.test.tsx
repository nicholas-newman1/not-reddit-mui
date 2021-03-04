import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Drawer from '.';
import { dark } from '../../theme';

describe('<Drawer />', () => {
  it('should render without crashing', () => {
    render(
      <ThemeProvider theme={dark}>
        <Drawer open={true} />
      </ThemeProvider>
    );
  });
});
