import { fireEvent, render } from '@testing-library/react';
import Rating from '.';

describe('<Rating />', () => {
  it('renders without crashing', () => {
    render(<Rating rating={1} onUpVote={() => {}} onDownVote={() => {}} />);
  });

  it('renders the correct rating', () => {
    const { getByText } = render(
      <Rating rating={24} onUpVote={() => {}} onDownVote={() => {}} />
    );
    getByText(/24/);
  });

  it('does not call onUpVote or onDownVote until they are clicked', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    render(<Rating rating={24} onUpVote={fn1} onDownVote={fn2} />);
    expect(fn1).not.toBeCalled();
    expect(fn2).not.toBeCalled();
  });

  it('fires onUpVote() upon clicking up arrow', () => {
    const fn = jest.fn();
    const { getByTestId } = render(
      <Rating rating={24} onUpVote={fn} onDownVote={() => {}} />
    );
    const upArrow = getByTestId('up-arrow');
    fireEvent.click(upArrow);
    expect(fn).toBeCalledTimes(1);
  });

  it('fires onDownVote() upon clicking down arrow', () => {
    const fn = jest.fn();
    const { getByTestId } = render(
      <Rating rating={24} onUpVote={() => {}} onDownVote={fn} />
    );
    const downArrow = getByTestId('down-arrow');
    fireEvent.click(downArrow);
    expect(fn).toBeCalledTimes(1);
  });
});
