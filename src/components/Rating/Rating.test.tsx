import { fireEvent, render } from '@testing-library/react';
import Rating from '.';

const props = {
  rating: 1,
  onUpVote: () => {},
  onDownVote: () => {},
  loading: false,
};

describe('<Rating />', () => {
  it('renders without crashing', () => {
    render(<Rating {...props} />);
  });

  it('renders the correct rating', () => {
    const { getByText } = render(<Rating {...props} />);
    getByText(/1/);
  });

  it('does not call onUpVote or onDownVote until they are clicked', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    render(<Rating {...props} onUpVote={fn1} onDownVote={fn2} />);
    expect(fn1).not.toBeCalled();
    expect(fn2).not.toBeCalled();
  });

  it('fires onUpVote() upon clicking up arrow', () => {
    const fn = jest.fn();
    const { getByTestId } = render(<Rating {...props} onUpVote={fn} />);
    const upArrow = getByTestId('up-arrow');
    fireEvent.click(upArrow);
    expect(fn).toBeCalledTimes(1);
  });

  it('fires onDownVote() upon clicking down arrow', () => {
    const fn = jest.fn();
    const { getByTestId } = render(<Rating {...props} onDownVote={fn} />);
    const downArrow = getByTestId('down-arrow');
    fireEvent.click(downArrow);
    expect(fn).toBeCalledTimes(1);
  });

  it('should disable down vote button while loadingRating', () => {
    const { getByTestId } = render(<Rating {...props} loading={true} />);
    const downArrow = getByTestId('down-arrow') as HTMLButtonElement;
    expect(downArrow.disabled).toBe(true);
  });

  it('should disable up vote button while loadingRating', () => {
    const { getByTestId } = render(<Rating {...props} loading={true} />);
    const upArrow = getByTestId('up-arrow') as HTMLButtonElement;
    expect(upArrow.disabled).toBe(true);
  });

  it('should increase rating by 1 onUpVote when status is undefined', () => {
    const { getByText, getByTestId } = render(<Rating {...props} />);
    const upArrow = getByTestId('up-arrow') as HTMLButtonElement;
    fireEvent.click(upArrow);
    getByText(/2/);
  });

  it('should increase rating by 2 onUpVote when status is down', () => {
    const { getByText, getByTestId } = render(
      <Rating {...props} status='down' />
    );
    const upArrow = getByTestId('up-arrow') as HTMLButtonElement;
    fireEvent.click(upArrow);
    getByText(/3/);
  });

  it('should decrease rating by 1 onUpVote when status is up', () => {
    const { getByText, getByTestId } = render(
      <Rating {...props} status='up' />
    );
    const upArrow = getByTestId('up-arrow') as HTMLButtonElement;
    fireEvent.click(upArrow);
    getByText(/0/);
  });

  it('should decrease rating by 1 onDownVote when status is undefined', () => {
    const { getByText, getByTestId } = render(<Rating {...props} />);
    const downArrow = getByTestId('down-arrow') as HTMLButtonElement;
    fireEvent.click(downArrow);
    getByText(/0/);
  });

  it('should decrease rating by 2 onUpVote when status is up', () => {
    const { getByText, getByTestId } = render(
      <Rating {...props} status='up' />
    );
    const downArrow = getByTestId('down-arrow') as HTMLButtonElement;
    fireEvent.click(downArrow);
    getByText(/-1/);
  });

  it('should increase rating by 1 onUpVote when status is down', () => {
    const { getByText, getByTestId } = render(
      <Rating {...props} status='down' />
    );
    const downArrow = getByTestId('down-arrow') as HTMLButtonElement;
    fireEvent.click(downArrow);
    getByText(/2/);
  });
});
