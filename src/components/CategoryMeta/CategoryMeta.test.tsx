import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router';
import { createMemoryHistory } from 'history';
import CategoryMeta from '.';

const props = {
  categoryName: 'hellokitty',
  owner: { name: 'bigboss', uid: 'id101' },
  numOfModerators: 3,
  numOfSubscribers: 867,
  onSubscribe: () => {},
};

describe('<CategoryMeta />', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <CategoryMeta {...props} />
      </MemoryRouter>
    );
  });

  it('renders given category name', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryMeta {...props} />
      </MemoryRouter>
    );
    getByText(/hellokitty/i);
  });

  it('renders given owner name', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryMeta {...props} />
      </MemoryRouter>
    );
    getByText(/bigboss/i);
  });

  it("changes to owner's profile upon clicking owner name", () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <CategoryMeta {...props} />
      </Router>
    );
    const ownerName = getByText(/bigboss/i);
    fireEvent.click(ownerName);
    expect(history.location.pathname).toBe('/profile/id101');
  });

  it('renders given numOfModerators', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryMeta {...props} />
      </MemoryRouter>
    );
    getByText(/3/i);
  });

  it('renders given numOfSubscribers', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CategoryMeta {...props} />
      </MemoryRouter>
    );
    getByText(/867/i);
  });

  it('renders subscribe button', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <CategoryMeta {...props} />
      </MemoryRouter>
    );
    getByRole('button');
  });

  it('calls onSubscribe on button click', () => {
    const fn = jest.fn();
    const { getByRole } = render(
      <MemoryRouter>
        <CategoryMeta {...props} onSubscribe={fn} />
      </MemoryRouter>
    );
    const subscribeBtn = getByRole('button');
    fireEvent.click(subscribeBtn);
    expect(fn).toBeCalledTimes(1);
  });
});
