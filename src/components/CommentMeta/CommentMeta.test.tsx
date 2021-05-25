import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import CommentMeta from '.';

const props = {
  authorUsername: 'ovechking899',
  authorProfileHref: '/profiles/ovechking899',
  timestamp: 1614429965,
};

describe('<CommentMeta />', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <CommentMeta {...props} />
      </MemoryRouter>
    );
  });

  it('renders username', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CommentMeta {...props} />
      </MemoryRouter>
    );

    getByText(/ovechking899/i);
  });

  it('renders time ago string', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CommentMeta {...props} />
      </MemoryRouter>
    );

    getByText(/ago/i);
  });

  it('username link goes to correct route', async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();

    const { getByText } = render(
      <Router history={history}>
        <CommentMeta {...props} />
      </Router>
    );

    fireEvent.click(getByText(/ovechking899/i));
    expect(history.push).toHaveBeenCalledWith(props.authorProfileHref);
  });

  it('should render edited tag', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CommentMeta {...props} edited />
      </MemoryRouter>
    );
    getByText(/edited/i);
  });
});
