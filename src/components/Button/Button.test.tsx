import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Button from '.';
import { dark } from '../../theme';

describe('<Button />', () => {
  it('should render without crashing', () => {
    render(
      <ThemeProvider theme={dark}>
        <Button />
      </ThemeProvider>
    );
  });

  it('should render children', () => {
    const { getByText } = render(
      <ThemeProvider theme={dark}>
        <Button>hello</Button>
      </ThemeProvider>
    );
    getByText(/hello/i);
  });

  it('should pass along props', () => {
    const fn = jest.fn();
    const { getByText } = render(
      <ThemeProvider theme={dark}>
        <Button onClick={fn}>hello</Button>
      </ThemeProvider>
    );
    const button = getByText(/hello/i);
    fireEvent.click(button);
    expect(fn).toBeCalledTimes(1);
  });
});
