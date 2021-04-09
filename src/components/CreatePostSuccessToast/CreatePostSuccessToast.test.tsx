import { fireEvent, render } from '@testing-library/react';
import CreatePostSuccessToast from '.';

describe('<CreatePostSuccessToast />', () => {
  it('renders without crashing', () => {
    render(<CreatePostSuccessToast open={true} handleClose={() => {}} />);
  });

  it('should have a message', () => {
    const { getByText } = render(
      <CreatePostSuccessToast open={true} handleClose={() => {}} />
    );

    getByText(/post successfully created/i);
  });

  it('should not render when open is false', () => {
    const { queryByRole } = render(
      <CreatePostSuccessToast open={false} handleClose={() => {}} />
    );

    expect(queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should have a close button', () => {
    const { getByRole } = render(
      <CreatePostSuccessToast open={true} handleClose={() => {}} />
    );

    getByRole('button');
  });

  it('should call handleClose on click close button', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <CreatePostSuccessToast open={true} handleClose={fn} />
    );

    fireEvent.click(getByRole('button'));
    expect(fn).toBeCalled();
  });
});
