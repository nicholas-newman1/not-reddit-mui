import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import CreateCategoryDialog from '.';

const props = {
  handleCreateCategory: () => {},
  open: true,
  hideDialog: () => {},
  loading: false,
  error: '',
  user: true,
  onLogin: () => {},
};

describe('<CreateCategoryDialog />', () => {
  it('renders without crashing', () => {
    render(<CreateCategoryDialog {...props} />);
  });

  it('has a title', () => {
    const { getByRole } = render(<CreateCategoryDialog {...props} />);
    getByRole('heading');
  });

  it('has an input', () => {
    const { getByRole } = render(<CreateCategoryDialog {...props} />);
    getByRole('textbox');
  });

  it('has a button', () => {
    const { getByRole } = render(<CreateCategoryDialog {...props} />);
    getByRole('button');
  });

  it("should change text input's value", () => {
    const { getByRole } = render(<CreateCategoryDialog {...props} />);
    const input = getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'a' } });
    expect(input.value).toBe('a');
  });

  it('should call handleCreateCategory on submit', async () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <CreateCategoryDialog {...props} handleCreateCategory={fn} />
    );
    await act(async () => {
      fireEvent.change(getByRole('textbox'), { target: { value: 'hockey' } });
      fireEvent.submit(getByRole('form'));
    });
    expect(fn).toHaveBeenCalled();
  });

  it('should call handleCreateCategory with given category name', async () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <CreateCategoryDialog {...props} handleCreateCategory={fn} />
    );
    await act(async () => {
      fireEvent.change(getByRole('textbox'), { target: { value: 'hockey' } });
      fireEvent.submit(getByRole('form'));
    });
    expect(fn).toHaveBeenCalledWith({ categoryName: 'hockey' });
  });

  it('should not call handleCreateCategory if category name is empty', async () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <CreateCategoryDialog {...props} handleCreateCategory={fn} />
    );
    await act(async () => {
      fireEvent.submit(getByRole('form'));
    });
    expect(fn).not.toHaveBeenCalled();
  });

  it('should display error if categoryName is empty', async () => {
    const fn = jest.fn();
    const { getByRole, getByText } = render(
      <CreateCategoryDialog {...props} handleCreateCategory={fn} />
    );
    await act(async () => {
      fireEvent.submit(getByRole('form'));
    });
    getByText(/category name is required/i);
  });

  it('should display error if categoryName length < 3', async () => {
    const fn = jest.fn();
    const { getByRole, getByText } = render(
      <CreateCategoryDialog {...props} handleCreateCategory={fn} />
    );
    await act(async () => {
      fireEvent.change(getByRole('textbox'), { target: { value: 'ab' } });
      fireEvent.submit(getByRole('form'));
    });
    getByText(/must be at least 3 characters/i);
  });

  it('should display error if categoryName is not alphanumeric', async () => {
    const fn = jest.fn();
    const { getByRole, getByText } = render(
      <CreateCategoryDialog {...props} handleCreateCategory={fn} />
    );
    await act(async () => {
      fireEvent.change(getByRole('textbox'), { target: { value: 'abc!@#' } });
      fireEvent.submit(getByRole('form'));
    });
    getByText(/only letters and numbers allowed/i);
  });

  it('should not render dialog when open is false', () => {
    const { queryByRole } = render(
      <CreateCategoryDialog {...props} open={false} />
    );
    expect(queryByRole('form')).not.toBeInTheDocument();
  });

  it('should call hideDialog on close', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <CreateCategoryDialog {...props} hideDialog={fn} />
    );
    const backdrop = getByRole('presentation').firstChild!;
    fireEvent.click(backdrop);
    expect(fn).toHaveBeenCalled();
  });

  it('should disable create category button while loading', () => {
    const { getByRole } = render(
      <CreateCategoryDialog {...props} loading={true} />
    );
    const button = getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should display given error', () => {
    const { getByText } = render(
      <CreateCategoryDialog {...props} error='category name taken' />
    );
    getByText(/category name taken/i);
  });

  it('should prompt user to log in', () => {
    const { getByRole } = render(
      <CreateCategoryDialog {...props} user={false} />
    );
    getByRole('button', { name: /log in/i });
  });

  it('should call onLogin', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <CreateCategoryDialog {...props} user={false} onLogin={fn} />
    );
    const button = getByRole('button', { name: /log in/i });
    fireEvent.click(button);
    expect(fn).toBeCalled();
  });
});
