import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import SignUpDialog from '.';

describe('<SignUpDialog />', () => {
  const props = {
    onSubmit: () => {},
    switchToSignInDialog: () => {},
    open: true,
    hideDialog: () => {},
    loading: false,
    error: '',
  };

  it('renders without crashing', () => {
    render(<SignUpDialog {...props} />);
  });

  describe('UI', () => {
    it('has a title', () => {
      const { getByRole } = render(<SignUpDialog {...props} />);
      getByRole('heading');
    });

    it('has a username input', () => {
      const { getByLabelText } = render(<SignUpDialog {...props} />);
      getByLabelText(/username/i);
    });

    it('has an email input', () => {
      const { getByLabelText } = render(<SignUpDialog {...props} />);
      getByLabelText(/email/i);
    });

    it('has a password input', () => {
      const { getByLabelText } = render(<SignUpDialog {...props} />);
      getByLabelText(/^password$/i);
    });

    it('has a confirm password input', () => {
      const { getByLabelText } = render(<SignUpDialog {...props} />);
      getByLabelText(/confirm password/i);
    });

    it('has a sign up button', () => {
      const { getByRole } = render(<SignUpDialog {...props} />);
      getByRole('button', {
        name: /sign up/i,
      });
    });

    it('has a switch to log in button', () => {
      const { getByRole } = render(<SignUpDialog {...props} />);
      getByRole('button', {
        name: /already have an account\?/i,
      });
    });

    it('should not render dialog when open is false', () => {
      const { queryByRole } = render(<SignUpDialog {...props} open={false} />);

      expect(queryByRole('form')).not.toBeInTheDocument();
    });

    it('should disable sign up button while loading', () => {
      const { getByRole } = render(<SignUpDialog {...props} loading={true} />);
      const button = getByRole('button', {
        name: /sign up/i,
      }) as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('should display given error', () => {
      const { getByText } = render(
        <SignUpDialog {...props} error='invalid email' />
      );

      getByText(/invalid email/i);
    });
  });

  describe('Actions', () => {
    it('should call onSubmit on submit', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText } = render(
        <SignUpDialog {...props} onSubmit={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/username/i), {
          target: { value: 'username123' },
        });
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/^password$/i), {
          target: { value: '123123' },
        });
        fireEvent.change(getByLabelText(/confirm password/i), {
          target: { value: '123123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      expect(fn).toHaveBeenCalled();
    });

    it('should call onSubmit with given username, email, and password', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText } = render(
        <SignUpDialog {...props} onSubmit={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/username/i), {
          target: { value: 'username123' },
        });
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/^password$/i), {
          target: { value: '123123' },
        });
        fireEvent.change(getByLabelText(/confirm password/i), {
          target: { value: '123123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      expect(fn).toHaveBeenCalledWith({
        username: 'username123',
        email: '123@gmail.com',
        password: '123123',
      });
    });

    it('should call switchToSignInDialog on click switch to sign in button', () => {
      const fn = jest.fn();
      const { getByRole } = render(
        <SignUpDialog {...props} switchToSignInDialog={fn} />
      );

      fireEvent.click(
        getByRole('button', {
          name: /already have an account\?/i,
        })
      );

      expect(fn).toHaveBeenCalled();
    });

    it('should call hideDialog on close', () => {
      const fn = jest.fn();
      const { getByRole } = render(<SignUpDialog {...props} hideDialog={fn} />);

      const backdrop = getByRole('presentation').firstChild!;
      fireEvent.click(backdrop);
      expect(fn).toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('should not call onSubmit on submit if username is empty', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText } = render(
        <SignUpDialog {...props} onSubmit={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/^password$/i), {
          target: { value: '123123' },
        });
        fireEvent.change(getByLabelText(/confirm password/i), {
          target: { value: '123123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('should give an error on submit if username is empty', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText, getByText } = render(
        <SignUpDialog {...props} onSubmit={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/^password$/i), {
          target: { value: '123123' },
        });
        fireEvent.change(getByLabelText(/confirm password/i), {
          target: { value: '123123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      getByText(/username is required/i);
    });

    it('should not call onSubmit on submit if email is empty', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText } = render(
        <SignUpDialog {...props} onSubmit={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/username/i), {
          target: { value: 'username123' },
        });
        fireEvent.change(getByLabelText(/^password$/i), {
          target: { value: '123123' },
        });
        fireEvent.change(getByLabelText(/confirm password/i), {
          target: { value: '123123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('should give an error on submit if email is empty', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText, getByText } = render(
        <SignUpDialog {...props} onSubmit={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/username/i), {
          target: { value: 'username123' },
        });
        fireEvent.change(getByLabelText(/^password$/i), {
          target: { value: '123123' },
        });
        fireEvent.change(getByLabelText(/confirm password/i), {
          target: { value: '123123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      getByText(/email is required/i);
    });

    it('should not call onSubmit on submit if password is empty', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText } = render(
        <SignUpDialog {...props} onSubmit={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/username/i), {
          target: { value: 'username123' },
        });
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/confirm password/i), {
          target: { value: '123123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('should give an error on submit if password is empty', async () => {
      const fn = jest.fn();
      const { getByRole, getByText, getByLabelText } = render(
        <SignUpDialog {...props} onSubmit={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/username/i), {
          target: { value: 'username123' },
        });
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/confirm password/i), {
          target: { value: '123123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      getByText(/password is required/i);
    });

    it('should not call onSubmit on submit if password is less than 6 characters', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText } = render(
        <SignUpDialog {...props} onSubmit={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/username/i), {
          target: { value: 'username123' },
        });
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/^password$/i), {
          target: { value: '123' },
        });
        fireEvent.change(getByLabelText(/confirm password/i), {
          target: { value: '123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('should give an error on submit if password is less than 6 characters', async () => {
      const fn = jest.fn();
      const { getByRole, getByText, getByLabelText } = render(
        <SignUpDialog {...props} onSubmit={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/username/i), {
          target: { value: 'username123' },
        });
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/^password$/i), {
          target: { value: '123' },
        });
        fireEvent.change(getByLabelText(/confirm password/i), {
          target: { value: '123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      getByText(/password must be at least 6 characters/i);
    });

    it('should not call onSubmit on submit if passwords do not match', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText } = render(
        <SignUpDialog {...props} onSubmit={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/username/i), {
          target: { value: 'username123' },
        });
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/^password$/i), {
          target: { value: '123456' },
        });
        fireEvent.change(getByLabelText(/confirm password/i), {
          target: { value: '123465' },
        });
        fireEvent.submit(getByRole('form'));
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('should give an error on submit if passwords do not match', async () => {
      const fn = jest.fn();
      const { getByRole, getByText, getByLabelText } = render(
        <SignUpDialog {...props} onSubmit={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/username/i), {
          target: { value: 'username123' },
        });
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/^password$/i), {
          target: { value: '123456' },
        });
        fireEvent.change(getByLabelText(/confirm password/i), {
          target: { value: '123465' },
        });
        fireEvent.submit(getByRole('form'));
      });

      getByText(/passwords must match/i);
    });
  });
});
