import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router';
import { createMemoryHistory } from 'history';
import CategoryListing from '.';

const props = {
  categoryHref: '/categories/meditation',
  categoryId: 'meditation',
  numOfSubscribers: 123,
  onToggleSubscribe: () => {},
  subscribed: false,
  loading: false,
};

describe('<CategoryListing />', () => {
  it('should render without exploding', () => {
    render(
      <MemoryRouter>
        <CategoryListing {...props} />
      </MemoryRouter>
    );
  });

  it('should render category name', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryListing {...props} />
      </MemoryRouter>
    );
    getByText(/meditation/i);
  });

  it('should render number of subscribers', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryListing {...props} />
      </MemoryRouter>
    );
    getByText(/123/i);
  });

  it('should render a subscribe button', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <CategoryListing {...props} />
      </MemoryRouter>
    );
    getByRole('button', {
      name: /subscribe/i,
    });
  });

  it('should go to category page onClick category name', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <CategoryListing {...props} />
      </Router>
    );
    const name = getByText(/meditation/i);
    fireEvent.click(name);
    expect(history.location.pathname).toBe(props.categoryHref);
  });

  it('should call onToggleSubscribe on subscribe button click', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <MemoryRouter>
        <CategoryListing {...props} onToggleSubscribe={fn} />
      </MemoryRouter>
    );
    const button = getByRole('button', {
      name: /subscribe/i,
    });
    fireEvent.click(button);
    expect(fn).toBeCalled();
  });

  it('should have unsubscribe button when subscribed == true', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <CategoryListing {...props} subscribed={true} />
      </MemoryRouter>
    );
    getByRole('button', {
      name: /unsubscribe/i,
    });
  });

  it('should call onToggleSubscribe on unsubscribe button click', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <MemoryRouter>
        <CategoryListing {...props} subscribed={true} onToggleSubscribe={fn} />
      </MemoryRouter>
    );
    const button = getByRole('button', {
      name: /subscribe/i,
    });
    fireEvent.click(button);
    expect(fn).toBeCalled();
  });

  it('should disable subscribe button while loading', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <CategoryListing {...props} loading={true} />
      </MemoryRouter>
    );
    const button = getByRole('button', {
      name: /subscribe/i,
    }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
