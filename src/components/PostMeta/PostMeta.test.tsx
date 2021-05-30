import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import PostMeta from '.';

const props = {
  authorUsername: 'ovechking899',
  authorProfileHref: '/profiles/ovechking899',
  timestamp: 1614429965,
  categoryId: 'meditation',
  categoryHref: '/categories/meditation',
};

describe('<PostMeta />', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <PostMeta {...props} />
      </MemoryRouter>
    );
  });

  it('renders username', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostMeta {...props} />
      </MemoryRouter>
    );

    getByText(/ovechking899/i);
  });

  it('renders time ago string', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostMeta {...props} />
      </MemoryRouter>
    );

    getByText(/ago/i);
  });

  it('renders category', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostMeta {...props} />
      </MemoryRouter>
    );

    getByText(/meditation/i);
  });

  it('should render edited tag if edited', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostMeta {...props} edited />
      </MemoryRouter>
    );

    getByText(/edited/i);
  });

  it('username link goes to correct route', async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();

    const { getByText } = render(
      <Router history={history}>
        <PostMeta {...props} />
      </Router>
    );

    fireEvent.click(getByText(/ovechking899/i));
    expect(history.push).toHaveBeenCalledWith(props.authorProfileHref);
  });

  it('category link goes to correct route', async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();

    const { getByText } = render(
      <Router history={history}>
        <PostMeta {...props} />
      </Router>
    );

    fireEvent.click(getByText(/meditation/i));
    expect(history.push).toHaveBeenCalledWith(props.categoryHref);
  });
});
