import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import EditPostForm from '.';

const props = {
  loading: false,
  onCancel: () => {},
  onEdit: () => {},
};

describe('<EditPostForm />', () => {
  it('should render without crashing', () => {
    render(<EditPostForm {...props} />);
  });

  it('has a title input', () => {
    const { getByLabelText } = render(<EditPostForm {...props} />);
    getByLabelText(/title/i);
  });

  it('has a body input', () => {
    const { getByLabelText } = render(<EditPostForm {...props} />);
    getByLabelText(/body/i);
  });

  it('has a submit button', () => {
    const { getByRole } = render(<EditPostForm {...props} />);
    getByRole('button', { name: /edit/i });
  });

  it('has a cancel button', () => {
    const { getByRole } = render(<EditPostForm {...props} />);
    getByRole('button', { name: /cancel/i });
  });

  it('disables submit button while loading', () => {
    const { getByRole } = render(<EditPostForm {...props} loading={true} />);
    const button = getByRole('button', { name: /edit/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('calls onEdit on submit', async () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <EditPostForm
        {...props}
        onEdit={fn}
        defaultTitle='123'
        defaultBody='321'
      />
    );
    const button = getByRole('button', { name: /edit/i }) as HTMLButtonElement;
    await act(async () => {
      fireEvent.click(button);
    });
    expect(fn).toBeCalled();
  });

  it('renders error if title empty', async () => {
    const { getByRole, getByText } = render(<EditPostForm {...props} />);
    const button = getByRole('button', { name: /edit/i }) as HTMLButtonElement;
    await act(async () => {
      fireEvent.click(button);
    });
    getByText(/title is required/i);
  });

  it('sets defaultTitle to value of title input', () => {
    const { getByLabelText } = render(
      <EditPostForm {...props} defaultTitle='123' />
    );
    const input = getByLabelText(/title/i) as HTMLInputElement;
    expect(input.value).toBe('123');
  });

  it('sets defaultBody to value of body input', () => {
    const { getByLabelText } = render(
      <EditPostForm {...props} defaultBody='123' />
    );
    const input = getByLabelText(/body/i) as HTMLInputElement;
    expect(input.value).toBe('123');
  });

  it('calls onEdit with correct values', async () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <EditPostForm
        {...props}
        onEdit={fn}
        defaultTitle='123'
        defaultBody='321'
      />
    );
    const button = getByRole('button', { name: /edit/i }) as HTMLButtonElement;
    await act(async () => {
      fireEvent.click(button);
    });
    expect(fn).toBeCalledWith('123', '321');
  });
});
