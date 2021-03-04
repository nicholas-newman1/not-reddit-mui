import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Card from '.';
import { dark } from '../../theme';

describe('<Card />', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme={dark}>
        <Card />
      </ThemeProvider>
    );
  });

  it('applys props to wrapping element', () => {
    const fn = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={dark}>
        <Card onClick={fn} />
      </ThemeProvider>
    );
    const wrapper = getByTestId('wrapper');
    fireEvent.click(wrapper);
    expect(fn).toBeCalledTimes(1);
  });

  it('renders given children', () => {
    const { getByText } = render(
      <ThemeProvider theme={dark}>
        <Card>Hello</Card>
      </ThemeProvider>
    );
    getByText(/Hello/);
  });
});
