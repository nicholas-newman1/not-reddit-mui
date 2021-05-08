import { fireEvent, render } from '@testing-library/react';
import VerifyEmailDialog from '.';

const props = {
  open: true,
  onClose: () => {},
};

describe('<VerifyEmailDialog />', () => {
  it('renders without crashing', () => {
    render(<VerifyEmailDialog {...props} />);
  });

  it('should have a heading', () => {
    const { getByRole } = render(<VerifyEmailDialog {...props} />);
    getByRole('heading');
  });

  it('should not render when open is false', () => {
    const { queryByRole } = render(
      <VerifyEmailDialog {...props} open={false} />
    );
    expect(queryByRole('heading')).not.toBeInTheDocument();
  });

  it('should have a close button', () => {
    const { getByRole } = render(<VerifyEmailDialog {...props} />);
    getByRole('button', {
      name: /close/i,
    });
  });

  it('should call onClose on click close button', () => {
    const fn = jest.fn();
    const { getByRole } = render(<VerifyEmailDialog {...props} onClose={fn} />);
    fireEvent.click(
      getByRole('button', {
        name: /close/i,
      })
    );
    expect(fn).toBeCalled();
  });

  it('should call onClose on backdropClick', () => {
    const fn = jest.fn();
    const { getByRole } = render(<VerifyEmailDialog {...props} onClose={fn} />);
    const backdrop = getByRole('presentation').firstChild!;
    fireEvent.click(backdrop);
    expect(fn).toHaveBeenCalled();
  });
});
