import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import PostOrder from '.';

const buttons = [
  { label: 'one', onClick: () => {}, disabled: true },
  { label: 'two', onClick: () => {}, disabled: false },
  { label: 'three', onClick: () => {}, disabled: false },
];

describe('<PostOrder />', () => {
  it('should render without crashing', () => {
    render(<PostOrder buttons={buttons} />);
  });

  it('should render given buttons', () => {
    const { getByRole } = render(<PostOrder buttons={buttons} />);
    getByRole('button', { name: /one/i });
    getByRole('button', { name: /two/i });
    getByRole('button', { name: /three/i });
  });

  it('should disable button one', () => {
    const { getByRole } = render(<PostOrder buttons={buttons} />);
    const button = getByRole('button', { name: /one/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should call onClick', async () => {
    const fn = jest.fn();
    const buttons = [
      { label: 'one', onClick: () => {}, disabled: true },
      { label: 'two', onClick: fn, disabled: false },
      { label: 'three', onClick: () => {}, disabled: false },
    ];
    const { getByRole } = render(<PostOrder buttons={buttons} />);
    const button = getByRole('button', { name: /two/i }) as HTMLButtonElement;
    await act(async () => {
      fireEvent.click(button);
    });
    expect(fn).toBeCalled();
  });
});
