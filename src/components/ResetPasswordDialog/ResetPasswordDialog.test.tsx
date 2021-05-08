import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ResetPasswordDialog from '.';

describe('<ResetPasswordDialog />', () => {
  it('renders without crashing', () => {
    render(
      <ResetPasswordDialog
        onSubmit={() => {}}
        open={true}
        hideDialog={() => {}}
        loading={false}
        error=''
      />
    );
  });

  it('has a title', () => {
    const { getByRole } = render(
      <ResetPasswordDialog
        onSubmit={() => {}}
        open={true}
        hideDialog={() => {}}
        loading={false}
        error=''
      />
    );

    getByRole('heading');
  });

  it('has an input', () => {
    const { getByRole } = render(
      <ResetPasswordDialog
        onSubmit={() => {}}
        open={true}
        hideDialog={() => {}}
        loading={false}
        error=''
      />
    );

    getByRole('textbox');
  });

  it('has a button', () => {
    const { getByRole } = render(
      <ResetPasswordDialog
        onSubmit={() => {}}
        open={true}
        hideDialog={() => {}}
        loading={false}
        error=''
      />
    );

    getByRole('button');
  });

  it("should change text input's value", () => {
    const { getByRole } = render(
      <ResetPasswordDialog
        onSubmit={() => {}}
        open={true}
        hideDialog={() => {}}
        loading={false}
        error=''
      />
    );

    const input = getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'a' } });
    expect(input.value).toBe('a');
  });

  it('should call onSubmit on submit', async () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <ResetPasswordDialog
        onSubmit={fn}
        open={true}
        hideDialog={() => {}}
        loading={false}
        error=''
      />
    );

    await act(async () => {
      fireEvent.change(getByRole('textbox'), { target: { value: 'a' } });
      fireEvent.submit(getByRole('form'));
    });

    expect(fn).toHaveBeenCalled();
  });

  it('should call onSubmit with given email', async () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <ResetPasswordDialog
        onSubmit={fn}
        open={true}
        hideDialog={() => {}}
        loading={false}
        error=''
      />
    );

    await act(async () => {
      fireEvent.change(getByRole('textbox'), { target: { value: 'a' } });
      fireEvent.submit(getByRole('form'));
    });

    expect(fn).toHaveBeenCalledWith('a');
  });

  it('should not call onSubmit on submit if email is empty', async () => {
    const fn = jest.fn();

    const { getByRole } = render(
      <ResetPasswordDialog
        onSubmit={fn}
        open={true}
        hideDialog={() => {}}
        loading={false}
        error=''
      />
    );

    await act(async () => {
      fireEvent.submit(getByRole('form'));
    });

    expect(fn).not.toHaveBeenCalled();
  });

  it('should give an error on submit if email is empty', async () => {
    const fn = jest.fn();

    const { getByRole, getByText } = render(
      <ResetPasswordDialog
        onSubmit={fn}
        open={true}
        hideDialog={() => {}}
        loading={false}
        error=''
      />
    );

    await act(async () => {
      fireEvent.submit(getByRole('form'));
    });

    getByText(/email is required/i);
  });

  it('should not render dialog when open is false', () => {
    const { queryByRole } = render(
      <ResetPasswordDialog
        onSubmit={() => {}}
        open={false}
        hideDialog={() => {}}
        loading={false}
        error=''
      />
    );

    expect(queryByRole('form')).not.toBeInTheDocument();
  });

  it('should call hideDialog on close', () => {
    const fn = jest.fn();

    const { getByRole } = render(
      <ResetPasswordDialog
        onSubmit={() => {}}
        open={true}
        hideDialog={fn}
        loading={false}
        error=''
      />
    );

    const backdrop = getByRole('presentation').firstChild!;

    fireEvent.click(backdrop);

    expect(fn).toHaveBeenCalled();
  });

  it('should disable submit button while loading', () => {
    const { getByRole } = render(
      <ResetPasswordDialog
        onSubmit={() => {}}
        open={true}
        hideDialog={() => {}}
        loading={true}
        error=''
      />
    );

    const button = getByRole('button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
  });

  it('should display given error', () => {
    const { getByText } = render(
      <ResetPasswordDialog
        onSubmit={() => {}}
        open={true}
        hideDialog={() => {}}
        loading={false}
        error='invalid email'
      />
    );

    getByText(/invalid email/i);
  });
});
