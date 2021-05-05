import { fireEvent, render } from '@testing-library/react';
import CustomDialog from '.';

describe('<CustomDialog />', () => {
  it('renders without crashing', () => {
    render(<CustomDialog heading='dialog' open={true} onClose={() => {}} />);
  });

  it('should have a heading', () => {
    const { getByRole } = render(
      <CustomDialog heading='dialog' open={true} onClose={() => {}} />
    );

    getByRole('heading');
  });

  it('should not render when open is false', () => {
    const { queryByRole } = render(
      <CustomDialog heading='dialog' open={false} onClose={() => {}} />
    );

    expect(queryByRole('heading')).not.toBeInTheDocument();
  });

  it('should call onClose on backdropClick', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <CustomDialog heading='dialog' open={true} onClose={fn} />
    );

    const backdrop = getByRole('presentation').firstChild!;
    fireEvent.click(backdrop);
    expect(fn).toHaveBeenCalled();
  });
});
