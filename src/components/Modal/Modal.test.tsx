import { fireEvent, render } from '@testing-library/react';
import Modal from '.';

describe('<Modal />', () => {
  it('renders without crashing', () => {
    render(<Modal open={true} />);
  });

  it('renders wrapper with test id', () => {
    const { getByTestId } = render(<Modal open={true} />);
    getByTestId('wrapper');
  });

  it('renders wrapper as a direct child of document.root', () => {
    const { getByTestId } = render(<Modal open={true} />);
    const wrapper = getByTestId('wrapper');
    expect(wrapper.parentElement?.tagName).toBe('BODY');
  });

  it('does not render when open prop is false', () => {
    const { queryByTestId } = render(<Modal open={false} />);
    expect(queryByTestId('wrapper')).toBeNull();
  });

  it('renders children', () => {
    const { getByText } = render(
      <Modal open={true}>
        <h1>child</h1>
      </Modal>
    );
    getByText(/child/);
  });

  it('renders background with test id', () => {
    const { getByTestId } = render(<Modal open={true} />);
    getByTestId('background');
  });

  it('calls onClose when background is clicked', () => {
    const fn = jest.fn();
    const { getByTestId } = render(<Modal open={true} onClose={fn} />);
    const background = getByTestId('background');
    fireEvent.click(background);
    expect(fn).toBeCalledTimes(1);
  });
});
