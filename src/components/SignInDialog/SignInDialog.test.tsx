import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import SignInDialog from '.';

describe('<SignInDialog />', () => {
  const props = {
    handleSignIn: () => {},
    switchToResetPasswordDialog: () => {},
    switchToSignUpDialog: () => {},
    open: true,
    hideDialog: () => {},
    loading: false,
    error: '',
  };

  it('renders without crashing', () => {
    render(<SignInDialog {...props} />);
  });

  describe('UI', () => {
    it('has a title', () => {
      const { getByRole } = render(<SignInDialog {...props} />);
      getByRole('heading');
    });

    it('has an email input', () => {
      const { getByLabelText } = render(<SignInDialog {...props} />);
      getByLabelText(/email/i);
    });

    it('has a password input', () => {
      const { getByLabelText } = render(<SignInDialog {...props} />);
      getByLabelText(/password/i);
    });

    it('has a log in button', () => {
      const { getByRole } = render(<SignInDialog {...props} />);
      getByRole('button', {
        name: /log in/i,
      });
    });

    it('has a forgot password button', () => {
      const { getByRole } = render(<SignInDialog {...props} />);
      getByRole('button', {
        name: /forgot your password\?/i,
      });
    });

    it('has a switch to sign up button', () => {
      const { getByRole } = render(<SignInDialog {...props} />);
      getByRole('button', {
        name: /don't have an account\?/i,
      });
    });

    it('should not render dialog when open is false', () => {
      const { queryByRole } = render(<SignInDialog {...props} open={false} />);

      expect(queryByRole('form')).not.toBeInTheDocument();
    });

    it('should disable log in button while loading', () => {
      const { getByRole } = render(<SignInDialog {...props} loading={true} />);
      const button = getByRole('button', {
        name: /log in/i,
      }) as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('should display given error', () => {
      const { getByText } = render(
        <SignInDialog {...props} error='invalid email' />
      );

      getByText(/invalid email/i);
    });
  });

  describe('Actions', () => {
    it('should call handleSignIn on submit', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText } = render(
        <SignInDialog {...props} handleSignIn={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/password/i), {
          target: { value: '123123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      expect(fn).toHaveBeenCalled();
    });

    it('should call handleSignIn with given email and password', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText } = render(
        <SignInDialog {...props} handleSignIn={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/password/i), {
          target: { value: '123123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      expect(fn).toHaveBeenCalledWith({
        email: '123@gmail.com',
        password: '123123',
      });
    });

    it('should call switchToSignUpDialog on click switch to sign up button', () => {
      const fn = jest.fn();
      const { getByRole } = render(
        <SignInDialog {...props} switchToSignUpDialog={fn} />
      );

      fireEvent.click(
        getByRole('button', {
          name: /don't have an account\?/i,
        })
      );

      expect(fn).toHaveBeenCalled();
    });

    it('should call switchToResetPasswordDialog on click forgot password button', () => {
      const fn = jest.fn();
      const { getByRole } = render(
        <SignInDialog {...props} switchToResetPasswordDialog={fn} />
      );

      fireEvent.click(
        getByRole('button', {
          name: /forgot your password\?/i,
        })
      );

      expect(fn).toHaveBeenCalled();
    });

    it('should call hideDialog on close', () => {
      const fn = jest.fn();
      const { getByRole } = render(<SignInDialog {...props} hideDialog={fn} />);

      const backdrop = getByRole('presentation').firstChild!;
      fireEvent.click(backdrop);
      expect(fn).toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('should not call handleSignIn on submit if email is empty', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText } = render(
        <SignInDialog {...props} handleSignIn={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/password/i), {
          target: { value: '123123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('should give an error on submit if email is empty', async () => {
      const fn = jest.fn();
      const { getByRole, getByText } = render(
        <SignInDialog {...props} handleSignIn={fn} />
      );

      await act(async () => {
        fireEvent.submit(getByRole('form'));
      });

      getByText(/email is required/i);
    });

    it('should not call handleSignIn on submit if password is empty', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText } = render(
        <SignInDialog {...props} handleSignIn={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.submit(getByRole('form'));
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('should give an error on submit if password is empty', async () => {
      const fn = jest.fn();
      const { getByRole, getByText, getByLabelText } = render(
        <SignInDialog {...props} handleSignIn={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.submit(getByRole('form'));
      });

      getByText(/password is required/i);
    });

    it('should not call handleSignIn on submit if password is less than 6 characters', async () => {
      const fn = jest.fn();
      const { getByRole, getByLabelText } = render(
        <SignInDialog {...props} handleSignIn={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/password/i), {
          target: { value: '123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      expect(fn).not.toHaveBeenCalled();
    });

    it('should give an error on submit if password is less than 6 characters', async () => {
      const fn = jest.fn();
      const { getByRole, getByText, getByLabelText } = render(
        <SignInDialog {...props} handleSignIn={fn} />
      );

      await act(async () => {
        fireEvent.change(getByLabelText(/email/i), {
          target: { value: '123@gmail.com' },
        });
        fireEvent.change(getByLabelText(/password/i), {
          target: { value: '123' },
        });
        fireEvent.submit(getByRole('form'));
      });

      getByText(/password must be at least 6 characters/i);
    });
  });
});
