import { fireEvent, render } from '@testing-library/react';
import SentEmailVerificationDialog from '.';

describe('<SentEmailVerificationDialog />', () => {
  it('renders without crashing', () => {
    render(<SentEmailVerificationDialog open={true} onClose={() => {}} />);
  });

  it('should have a heading', () => {
    const { getByRole } = render(
      <SentEmailVerificationDialog open={true} onClose={() => {}} />
    );

    getByRole('heading');
  });

  it('should not render when open is false', () => {
    const { queryByRole } = render(
      <SentEmailVerificationDialog open={false} onClose={() => {}} />
    );

    expect(queryByRole('heading')).not.toBeInTheDocument();
  });

  it('should have a close button', () => {
    const { getByRole } = render(
      <SentEmailVerificationDialog open={true} onClose={() => {}} />
    );

    getByRole('button');
  });

  it('should call onClose on click close button', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <SentEmailVerificationDialog open={true} onClose={fn} />
    );

    fireEvent.click(getByRole('button'));
    expect(fn).toBeCalled();
  });

  it('should call onClose on backdropClick', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <SentEmailVerificationDialog open={true} onClose={fn} />
    );

    const backdrop = getByRole('presentation').firstChild!;
    fireEvent.click(backdrop);
    expect(fn).toHaveBeenCalled();
  });
});
