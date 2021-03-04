import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import Modal from '.';
import { dark } from '../../theme';

describe('<Modal />', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme={dark}>
        <Modal open={true} />
      </ThemeProvider>
    );
  });

  it('renders wrapper with test id', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={dark}>
        <Modal open={true} />
      </ThemeProvider>
    );
    getByTestId('wrapper');
  });

  it('renders wrapper as a direct child of document.root', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={dark}>
        <Modal open={true} />
      </ThemeProvider>
    );
    const wrapper = getByTestId('wrapper');
    expect(wrapper.parentElement?.tagName).toBe('BODY');
  });

  it('does not render when open prop is false', () => {
    const { queryByTestId } = render(
      <ThemeProvider theme={dark}>
        <Modal open={false} />
      </ThemeProvider>
    );
    expect(queryByTestId('wrapper')).toBeNull();
  });

  it('renders children', () => {
    const { getByText } = render(
      <ThemeProvider theme={dark}>
        <Modal open={true}>
          <h1>child</h1>
        </Modal>
      </ThemeProvider>
    );
    getByText(/child/);
  });

  it('renders background with test id', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={dark}>
        <Modal open={true} />
      </ThemeProvider>
    );
    getByTestId('background');
  });

  it('calls onClose when background is clicked', () => {
    const fn = jest.fn();
    const { getByTestId } = render(
      <ThemeProvider theme={dark}>
        <Modal open={true} onClose={fn} />
      </ThemeProvider>
    );
    const background = getByTestId('background');
    fireEvent.click(background);
    expect(fn).toBeCalledTimes(1);
  });
});
