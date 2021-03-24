import { fireEvent, render } from '@testing-library/react';
import SignUpSuccessToast from '.';

describe('<SignUpSuccessToast />', () => {
  it('renders without crashing', () => {
    render(<SignUpSuccessToast open={true} handleClose={() => {}} />);
  });

  it('should have a message', () => {
    const { getByText } = render(
      <SignUpSuccessToast open={true} handleClose={() => {}} />
    );

    getByText(/account successfully created/i);
  });

  it('should not render when open is false', () => {
    const { queryByRole } = render(
      <SignUpSuccessToast open={false} handleClose={() => {}} />
    );

    expect(queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should have a close button', () => {
    const { getByRole } = render(
      <SignUpSuccessToast open={true} handleClose={() => {}} />
    );

    getByRole('button');
  });

  it('should call handleClose on click close button', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <SignUpSuccessToast open={true} handleClose={fn} />
    );

    fireEvent.click(getByRole('button'));
    expect(fn).toBeCalled();
  });
});
