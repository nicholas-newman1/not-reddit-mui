import { fireEvent, render } from '@testing-library/react';
import Toast from '.';

describe('<Toast />', () => {
  it('renders without crashing', () => {
    render(<Toast open={true} message='test' handleClose={() => {}} />);
  });

  it('should have a message', () => {
    const { getByText } = render(
      <Toast open={true} message='test' handleClose={() => {}} />
    );

    getByText(/test/i);
  });

  it('should not render when open is false', () => {
    const { queryByRole } = render(
      <Toast open={false} message='test' handleClose={() => {}} />
    );

    expect(queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should have a close button', () => {
    const { getByRole } = render(
      <Toast open={true} message='test' handleClose={() => {}} />
    );

    getByRole('button');
  });

  it('should call handleClose on click close button', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <Toast open={true} message='test' handleClose={fn} />
    );

    fireEvent.click(getByRole('button'));
    expect(fn).toBeCalled();
  });
});
