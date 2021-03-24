import { fireEvent, render } from '@testing-library/react';
import ResetPasswordSentToast from '.';

describe('<ResetPasswordSentToast />', () => {
  it('renders without crashing', () => {
    render(<ResetPasswordSentToast open={true} handleClose={() => {}} />);
  });

  it('should have a message', () => {
    const { getByText } = render(
      <ResetPasswordSentToast open={true} handleClose={() => {}} />
    );

    getByText(/an email has been sent with further instructions/i);
  });

  it('should not render when open is false', () => {
    const { queryByRole } = render(
      <ResetPasswordSentToast open={false} handleClose={() => {}} />
    );

    expect(queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should have a close button', () => {
    const { getByRole } = render(
      <ResetPasswordSentToast open={true} handleClose={() => {}} />
    );

    getByRole('button');
  });

  it('should call handleClose on click close button', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <ResetPasswordSentToast open={true} handleClose={fn} />
    );

    fireEvent.click(getByRole('button'));
    expect(fn).toBeCalled();
  });
});
