import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router';
import { createMemoryHistory } from 'history';
import CategoryMeta from '.';

const props = {
  categoryName: 'hellokitty',
  owner: { username: 'bigboss', uid: 'id101' },
  numOfModerators: 3,
  numOfSubscribers: 867,
  onToggleSubscribe: () => {},
  loadingToggleSubscribe: false,
  subscribed: false,
};

describe('<CategoryMeta />', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <CategoryMeta {...props} loading={false} />
      </MemoryRouter>
    );
  });

  it('renders given category name', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryMeta {...props} loading={false} />
      </MemoryRouter>
    );
    getByText(/hellokitty/i);
  });

  it('renders given owner name', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryMeta {...props} loading={false} />
      </MemoryRouter>
    );
    getByText(/bigboss/i);
  });

  it("changes to owner's profile upon clicking owner name", () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <CategoryMeta {...props} loading={false} />
      </Router>
    );
    const ownerName = getByText(/bigboss/i);
    fireEvent.click(ownerName);
    expect(history.location.pathname).toBe('/profile/id101');
  });

  it('renders given numOfModerators', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryMeta {...props} loading={false} />
      </MemoryRouter>
    );
    getByText(/3/i);
  });

  it('renders given numOfSubscribers', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryMeta {...props} loading={false} />
      </MemoryRouter>
    );
    getByText(/867/i);
  });

  it('renders subscribe button', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <CategoryMeta {...props} loading={false} />
      </MemoryRouter>
    );
    getByRole('button', {
      name: /subscribe/i,
    });
  });

  it('renders unsubscribe button when already subscribed', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <CategoryMeta {...props} loading={false} subscribed={true} />
      </MemoryRouter>
    );
    getByRole('button', {
      name: /unsubscribe/i,
    });
  });

  it('disables button when loadingToggleSubscribe', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <CategoryMeta
          {...props}
          loading={false}
          loadingToggleSubscribe={true}
        />
      </MemoryRouter>
    );
    const button = getByRole('button', {
      name: /subscribe/i,
    }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('calls onToggleSubscribe on button click', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <MemoryRouter>
        <CategoryMeta {...props} loading={false} onToggleSubscribe={fn} />
      </MemoryRouter>
    );
    const subscribeBtn = getByRole('button');
    fireEvent.click(subscribeBtn);
    expect(fn).toBeCalledTimes(1);
  });
});
