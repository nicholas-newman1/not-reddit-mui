import { render } from '@testing-library/react';
import Portal from '.';

describe('<Portal />', () => {
  it('should render without crashing', () => {
    render(<Portal />);
  });

  it('should render children', () => {
    const { getByText } = render(
      <Portal>
        <h1>child</h1>
      </Portal>
    );

    getByText(/child/);
  });

  it('should render children as a direct child of document.body', () => {
    const { getByText } = render(
      <Portal>
        <h1>cool kid</h1>
      </Portal>
    );
    const child = getByText(/cool kid/);
    expect(child.parentElement?.tagName).toBe('BODY');
  });

  it('should render children as a direct child of given element', () => {
    const div = document.createElement('div');
    render(
      <Portal container={div}>
        <h1>bad kid</h1>
      </Portal>
    );
    expect(div.firstChild?.textContent).toBe('bad kid');
  });
});
