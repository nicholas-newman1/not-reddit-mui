import { fireEvent, render } from '@testing-library/react';
import Rating from '.';

describe('<Rating />', () => {
  it('renders without crashing', () => {
    render(<Rating rating={1} onArrowUp={() => {}} onArrowDown={() => {}} />);
  });

  it('renders the correct rating', () => {
    const { getByText } = render(
      <Rating rating={24} onArrowUp={() => {}} onArrowDown={() => {}} />
    );
    getByText(/24/);
  });

  it('does not call onArrowUp or onArrowDown until they are clicked', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    render(<Rating rating={24} onArrowUp={fn1} onArrowDown={fn2} />);
    expect(fn1).not.toBeCalled();
    expect(fn2).not.toBeCalled();
  });

  it('fires onArrowUp() upon clicking up arrow', () => {
    const fn = jest.fn();
    const { getByTestId } = render(
      <Rating rating={24} onArrowUp={fn} onArrowDown={() => {}} />
    );
    const upArrow = getByTestId('up-arrow');
    fireEvent.click(upArrow);
    expect(fn).toBeCalledTimes(1);
  });

  it('fires onArrowDown() upon clicking down arrow', () => {
    const fn = jest.fn();
    const { getByTestId } = render(
      <Rating rating={24} onArrowUp={() => {}} onArrowDown={fn} />
    );
    const downArrow = getByTestId('down-arrow');
    fireEvent.click(downArrow);
    expect(fn).toBeCalledTimes(1);
  });

  it('neither arrow has an "arrowActive" class when status prop is undefined', () => {
    const { getByTestId } = render(
      <Rating rating={24} onArrowUp={() => {}} onArrowDown={() => {}} />
    );
    const upArrow = getByTestId('up-arrow');
    const downArrow = getByTestId('down-arrow');
    expect(upArrow.classList.contains('arrowActive')).toBe(false);
    expect(downArrow.classList.contains('downActive')).toBe(false);
  });

  it('downArrow has an "arrowActive" class when status === "down"', () => {
    const { getByTestId } = render(
      <Rating
        rating={24}
        onArrowUp={() => {}}
        onArrowDown={() => {}}
        status='down'
      />
    );
    const downArrow = getByTestId('down-arrow');
    expect(downArrow.classList.contains('arrowActive')).toBe(true);
  });

  it('upArrow has an "arrowActive" class when status === "up"', () => {
    const { getByTestId } = render(
      <Rating
        rating={24}
        onArrowUp={() => {}}
        onArrowDown={() => {}}
        status='up'
      />
    );
    const upArrow = getByTestId('up-arrow');
    expect(upArrow.classList.contains('arrowActive')).toBe(true);
  });

  it("adds given classNames from className prop in the wrapping element's classList", () => {
    const { getByTestId } = render(
      <Rating
        rating={24}
        onArrowUp={() => {}}
        onArrowDown={() => {}}
        className='test class names'
      />
    );
    const wrapper = getByTestId('wrapper');
    expect(wrapper.classList.contains('test')).toBe(true);
    expect(wrapper.classList.contains('class')).toBe(true);
    expect(wrapper.classList.contains('names')).toBe(true);
  });
});
