import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import CreatePostDialog from '.';

const props = {
  handleCreatePost: () => {},
  open: true,
  hideDialog: () => {},
  loading: false,
  user: true,
  onLogin: () => {},
  loadingSubscribedCategoryIds: false,
  error: '',
  subscribedCategoryIds: ['meditation', 'hockey'],
  onSubscribe: () => {},
  isSubscribed: false,
};

describe('<CreatePostDialog />', () => {
  it('should render without crashing', () => {
    render(<CreatePostDialog {...props} />);
  });

  it('should render a heading', () => {
    const { getByRole } = render(<CreatePostDialog {...props} />);
    getByRole('heading');
  });

  it('should render a title input', () => {
    const { getByLabelText } = render(<CreatePostDialog {...props} />);
    getByLabelText(/title/i);
  });

  it('should render a category input', () => {
    const { getByLabelText } = render(<CreatePostDialog {...props} />);
    getByLabelText(/category/i);
  });

  it('should render a body input', () => {
    const { getByLabelText } = render(<CreatePostDialog {...props} />);
    getByLabelText(/body/i);
  });

  it('should render a submit button', () => {
    const { getByRole } = render(<CreatePostDialog {...props} />);
    getByRole('button', {
      name: /create post/i,
    });
  });

  it('should call handleCreatePost on submit', async () => {
    const fn = jest.fn();
    const { getByRole, getByLabelText, getByText } = render(
      <CreatePostDialog {...props} handleCreatePost={fn} />
    );
    const title = getByLabelText(/title/i);
    const category = getByLabelText(/category/i);
    const submit = getByRole('button', {
      name: /create post/i,
    });

    fireEvent.change(title, { target: { value: 'test' } });
    fireEvent.mouseDown(category);
    fireEvent.click(getByText(/meditation/i));
    await act(async () => {
      fireEvent.click(submit);
    });

    expect(fn).toBeCalledTimes(1);
  });

  it('should render an error message if title is empty', async () => {
    const { getByRole, getByLabelText, getByText } = render(
      <CreatePostDialog {...props} />
    );
    const category = getByLabelText(/category/i);
    const submit = getByRole('button', {
      name: /create post/i,
    });

    fireEvent.mouseDown(category);
    fireEvent.click(getByText(/meditation/i));
    await act(async () => {
      fireEvent.click(submit);
    });

    getByText(/title is required/i);
  });

  it('should render an error message if title length < 3', async () => {
    const { getByRole, getByLabelText, getByText } = render(
      <CreatePostDialog {...props} />
    );
    const title = getByLabelText(/title/i);
    const category = getByLabelText(/category/i);
    const submit = getByRole('button', {
      name: /create post/i,
    });

    fireEvent.change(title, { target: { value: '12' } });
    fireEvent.mouseDown(category);
    fireEvent.click(getByText(/meditation/i));
    await act(async () => {
      fireEvent.click(submit);
    });

    getByText(/title must be at least 3 characters/i);
  });

  it('should render an error if no category is selected', async () => {
    const { getByRole, getByLabelText, getByText } = render(
      <CreatePostDialog {...props} />
    );
    const title = getByLabelText(/title/i);
    const submit = getByRole('button', {
      name: /create post/i,
    });

    fireEvent.change(title, { target: { value: 'test' } });
    await act(async () => {
      fireEvent.click(submit);
    });

    getByText(/category is required/i);
  });

  it('should call handleCreatePost with given data', async () => {
    const fn = jest.fn();
    const { getByRole, getByLabelText, getByText } = render(
      <CreatePostDialog {...props} handleCreatePost={fn} />
    );
    const title = getByLabelText(/title/i);
    const category = getByLabelText(/category/i);
    const submit = getByRole('button', {
      name: /create post/i,
    });

    fireEvent.change(title, { target: { value: 'test' } });
    fireEvent.mouseDown(category);
    fireEvent.click(getByText(/hockey/i));
    await act(async () => {
      fireEvent.click(submit);
    });

    expect(fn).toBeCalledWith({
      title: 'test',
      category: 'hockey',
      body: '',
    });
  });

  it('should not display dialog if open prop is false', () => {
    const { queryByRole } = render(
      <CreatePostDialog {...props} open={false} />
    );
    expect(queryByRole('heading')).not.toBeInTheDocument();
  });

  it('should call hideDialog on backdrop click', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <CreatePostDialog {...props} hideDialog={fn} />
    );
    const backdrop = getByRole('presentation').firstChild!;
    fireEvent.click(backdrop);
    expect(fn).toHaveBeenCalled();
  });

  it('should disable create post button while loading', () => {
    const { getByRole } = render(
      <CreatePostDialog {...props} loading={true} />
    );
    const button = getByRole('button', {
      name: /create post/i,
    }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should render given error prop', () => {
    const { getByText } = render(
      <CreatePostDialog {...props} error='hello error' />
    );
    getByText(/hello error/i);
  });

  it('should list all subscribedCategoryIds in category input', () => {
    const { getByLabelText, getByText } = render(
      <CreatePostDialog {...props} />
    );
    const title = getByLabelText(/title/i);
    const category = getByLabelText(/category/i);

    fireEvent.change(title, { target: { value: 'test' } });
    fireEvent.mouseDown(category);

    getByText(/meditation/i);
    getByText(/hockey/i);
  });

  it('should select given defaultCategoryId by default', () => {
    const { getByText } = render(
      <CreatePostDialog
        {...props}
        defaultCategoryId='hockey'
        isSubscribed={true}
      />
    );
    getByText(/hockey/i);
  });

  it('should render loader while loadingSubscribedCategoryIds', () => {
    const { getByTestId } = render(
      <CreatePostDialog {...props} loadingSubscribedCategoryIds={true} />
    );
    getByTestId('loader');
  });

  it('should render log in button if no user', () => {
    const { getByText } = render(<CreatePostDialog {...props} user={false} />);
    getByText(/log in/i);
  });

  it('should call onLogin on login button click', () => {
    const fn = jest.fn();
    const { getByText } = render(
      <CreatePostDialog {...props} user={false} onLogin={fn} />
    );
    const login = getByText(/log in/i);
    fireEvent.click(login);
    expect(fn).toBeCalled();
  });

  it('should render helpful message if user has no subscribed categories', () => {
    const { getByText } = render(
      <CreatePostDialog {...props} subscribedCategoryIds={[]} />
    );
    getByText(/you must subscribe to a category/i);
  });

  it('should render subscribe button if user is not subscribed to defaultCategoryId', () => {
    const { getByRole } = render(
      <CreatePostDialog {...props} defaultCategoryId='baseball' />
    );
    getByRole('button', { name: /subscribe/i });
  });
});
