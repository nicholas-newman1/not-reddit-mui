import { fireEvent, render } from '@testing-library/react';
import Toast from '.';

describe('<Toast />', () => {
  it('renders without crashing', () => {
    render(<Toast open={true} message='test' onClose={() => {}} />);
  });

  it('should have a message', () => {
    const { getByText } = render(
      <Toast open={true} message='test' onClose={() => {}} />
    );

    getByText(/test/i);
  });

  it('should not render when open is false', () => {
    const { queryByRole } = render(
      <Toast open={false} message='test' onClose={() => {}} />
    );

    expect(queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should have a close button', () => {
    const { getByRole } = render(
      <Toast open={true} message='test' onClose={() => {}} />
    );

    getByRole('button');
  });

  it('should call onClose on click close button', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <Toast open={true} message='test' onClose={fn} />
    );

    fireEvent.click(getByRole('button'));
    expect(fn).toBeCalled();
  });
});
