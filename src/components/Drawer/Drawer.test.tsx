import { render } from '@testing-library/react';
import Drawer from '.';

describe('<Drawer />', () => {
  it('should render without crashing', () => {
    render(<Drawer open={true} />);
  });
});
