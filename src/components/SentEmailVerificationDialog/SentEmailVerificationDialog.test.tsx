import { fireEvent, render } from '@testing-library/react';
import SentEmailVerificationDialog from '.';

describe('<SentEmailVerificationDialog />', () => {
  it('renders without crashing', () => {
    render(<SentEmailVerificationDialog open={true} handleClose={() => {}} />);
  });

  it('should have a heading', () => {
    const { getByRole } = render(
      <SentEmailVerificationDialog open={true} handleClose={() => {}} />
    );

    getByRole('heading');
  });

  it('should not render when open is false', () => {
    const { queryByRole } = render(
      <SentEmailVerificationDialog open={false} handleClose={() => {}} />
    );

    expect(queryByRole('heading')).not.toBeInTheDocument();
  });

  it('should have a close button', () => {
    const { getByRole } = render(
      <SentEmailVerificationDialog open={true} handleClose={() => {}} />
    );

    getByRole('button');
  });

  it('should call handleClose on click close button', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <SentEmailVerificationDialog open={true} handleClose={fn} />
    );

    fireEvent.click(getByRole('button'));
    expect(fn).toBeCalled();
  });

  it('should call handleClose on backdropClick', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <SentEmailVerificationDialog open={true} handleClose={fn} />
    );

    const backdrop = getByRole('presentation').firstChild!;
    fireEvent.click(backdrop);
    expect(fn).toHaveBeenCalled();
  });
});
