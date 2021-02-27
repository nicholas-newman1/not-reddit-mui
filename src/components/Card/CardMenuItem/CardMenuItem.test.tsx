import { render } from '@testing-library/react';
import CardMenuItem from '.';

describe('<CardMenuItem />', () => {
  it('renders without crashing', () => {
    render(<CardMenuItem />);
  });

  it('renders children', () => {
    const { getByText } = render(
      <CardMenuItem>
        <h1>child</h1>
      </CardMenuItem>
    );
    getByText(/child/);
  });
});
