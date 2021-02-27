import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import PostMeta from '.';

describe('<PostMeta />', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <PostMeta
          username='ovechking899'
          userProfileHref='/profiles/ovechking899'
          timestamp={1614429965}
          category='meditation'
          categoryHref='/categories/meditation'
        />
      </MemoryRouter>
    );
  });

  it('renders username', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostMeta
          username='ovechking899'
          userProfileHref='/profiles/ovechking899'
          timestamp={1614429965}
          category='meditation'
          categoryHref='/categories/meditation'
        />
      </MemoryRouter>
    );

    getByText(/ovechking899/i);
  });

  it('renders time ago string', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostMeta
          username='ovechking899'
          userProfileHref='/profiles/ovechking899'
          timestamp={1614429965}
          category='meditation'
          categoryHref='/categories/meditation'
        />
      </MemoryRouter>
    );

    getByText(/ago/i);
  });

  it('renders category', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostMeta
          username='ovechking899'
          userProfileHref='/profiles/ovechking899'
          timestamp={1614429965}
          category='meditation'
          categoryHref='/categories/meditation'
        />
      </MemoryRouter>
    );

    getByText(/meditation/i);
  });

  it('username link goes to correct route', async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();

    const { getByText } = render(
      <Router history={history}>
        <PostMeta
          username='ovechking899'
          userProfileHref='/profiles/ovechking899'
          timestamp={1614429965}
          category='meditation'
          categoryHref='/categories/meditation'
        />
      </Router>
    );

    fireEvent.click(getByText(/ovechking899/i));
    expect(history.push).toHaveBeenCalledWith('/profiles/ovechking899');
  });

  it('category link goes to correct route', async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();

    const { getByText } = render(
      <Router history={history}>
        <PostMeta
          username='ovechking899'
          userProfileHref='/profiles/ovechking899'
          timestamp={1614429965}
          category='meditation'
          categoryHref='/categories/meditation'
        />
      </Router>
    );

    fireEvent.click(getByText(/meditation/i));
    expect(history.push).toHaveBeenCalledWith('/categories/meditation');
  });
});
