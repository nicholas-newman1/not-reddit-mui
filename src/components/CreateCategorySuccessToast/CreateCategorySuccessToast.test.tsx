import { fireEvent, render } from '@testing-library/react';
import CreateCategorySuccessToast from '.';

describe('<CreateCategorySuccessToast />', () => {
  it('renders without crashing', () => {
    render(<CreateCategorySuccessToast open={true} handleClose={() => {}} />);
  });

  it('should have a message', () => {
    const { getByText } = render(
      <CreateCategorySuccessToast open={true} handleClose={() => {}} />
    );

    getByText(/category successfully created/i);
  });

  it('should not render when open is false', () => {
    const { queryByRole } = render(
      <CreateCategorySuccessToast open={false} handleClose={() => {}} />
    );

    expect(queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should have a close button', () => {
    const { getByRole } = render(
      <CreateCategorySuccessToast open={true} handleClose={() => {}} />
    );

    getByRole('button');
  });

  it('should call handleClose on click close button', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <CreateCategorySuccessToast open={true} handleClose={fn} />
    );

    fireEvent.click(getByRole('button'));
    expect(fn).toBeCalled();
  });
});
