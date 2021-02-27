import { fireEvent, render } from '@testing-library/react';
import Card from '.';

describe('<Card />', () => {
  it('renders without crashing', () => {
    render(<Card />);
  });

  it('applys props to wrapping element', () => {
    const fn = jest.fn();
    const { getByTestId } = render(<Card onClick={fn} />);
    const wrapper = getByTestId('wrapper');
    fireEvent.click(wrapper);
    expect(fn).toBeCalledTimes(1);
  });

  it('renders given children', () => {
    const { getByText } = render(<Card>Hello</Card>);
    getByText(/Hello/);
  });
});
