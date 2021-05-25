import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import CreateCommentForm from '.';

const props = {
  onReply: () => {},
  loading: false,
  onSignIn: () => {},
  onSubscribe: () => {},
  loadingSubscribe: false,
};

describe('<CreateCommentForm />', () => {
  it('should render without crashing', () => {
    render(<CreateCommentForm {...props} />);
  });

  it('has an input', () => {
    const { getByRole } = render(<CreateCommentForm {...props} />);
    getByRole('textbox');
  });

  it('has a button', () => {
    const { getByRole } = render(<CreateCommentForm {...props} />);
    getByRole('button');
  });

  it("should change text input's value", () => {
    const { getByRole } = render(<CreateCommentForm {...props} />);
    const input = getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'a' } });
    expect(input.value).toBe('a');
  });

  it('should call onReply on submit', async () => {
    const fn = jest.fn();
    const { getByRole } = render(<CreateCommentForm {...props} onReply={fn} />);
    await act(async () => {
      fireEvent.change(getByRole('textbox'), { target: { value: 'a' } });
      fireEvent.submit(getByRole('form'));
    });
    expect(fn).toHaveBeenCalled();
  });

  it('should call onReply with given body', async () => {
    const fn = jest.fn();
    const { getByRole } = render(<CreateCommentForm {...props} onReply={fn} />);
    await act(async () => {
      fireEvent.change(getByRole('textbox'), { target: { value: 'a' } });
      fireEvent.submit(getByRole('form'));
    });
    expect(fn).toHaveBeenCalledWith('a');
  });

  it('should not call onReply on submit if body is empty', async () => {
    const fn = jest.fn();
    const { getByRole } = render(<CreateCommentForm {...props} onReply={fn} />);
    await act(async () => {
      fireEvent.submit(getByRole('form'));
    });
    expect(fn).not.toHaveBeenCalled();
  });

  it('should give an error on submit if body is empty', async () => {
    const { getByRole, getByText } = render(<CreateCommentForm {...props} />);
    await act(async () => {
      fireEvent.submit(getByRole('form'));
    });
    getByText(/body is required/i);
  });

  it('should render auth error', async () => {
    const { getByRole } = render(
      <CreateCommentForm {...props} error={{ type: 'auth' }} />
    );
    getByRole('button', { name: /sign in/i });
  });

  it('should call onSignIn', async () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <CreateCommentForm {...props} error={{ type: 'auth' }} onSignIn={fn} />
    );
    const button = getByRole('button', { name: /sign in/i });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(fn).toBeCalled();
  });

  it('should render subscribe error', async () => {
    const { getByRole } = render(
      <CreateCommentForm {...props} error={{ type: 'subscribe' }} />
    );
    getByRole('button', { name: /subscribe/i });
  });

  it('should call onSubscribe', async () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <CreateCommentForm
        {...props}
        error={{ type: 'subscribe' }}
        onSubscribe={fn}
      />
    );
    const button = getByRole('button', { name: /subscribe/i });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(fn).toBeCalled();
  });

  it('should disable subscribe button while loadingSubscribe is true', () => {
    const { getByRole } = render(
      <CreateCommentForm
        {...props}
        error={{ type: 'subscribe' }}
        loadingSubscribe
      />
    );
    const button = getByRole('button', {
      name: /subscribe/i,
    }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should disable submit button while loading', () => {
    const { getByRole } = render(
      <CreateCommentForm {...props} loading={true} />
    );
    const button = getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should display given error', () => {
    const { getByText } = render(
      <CreateCommentForm {...props} error={{ message: 'invalid body' }} />
    );
    getByText(/invalid body/i);
  });
});
