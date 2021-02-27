import { render } from '@testing-library/react';
import CardMenu from '.';

describe('<CardMenu />', () => {
  it('renders without crashing', () => {
    render(<CardMenu />);
  });

  it('renders children', () => {
    const { getByText } = render(
      <CardMenu>
        <h1>child</h1>
      </CardMenu>
    );
    getByText(/child/);
  });
});
