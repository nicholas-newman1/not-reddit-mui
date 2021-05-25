import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router';
import { createMemoryHistory } from 'history';
import Post from '.';

const post = {
  title: 'Hello if i looked at the sun I would see how beautiful it is',
  body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
  authorId: 'ovechking899',
  authorUsername: 'ovechking899',
  categoryId: 'meditation',
  commentsHref: '/posts/3131fnu91h1e#comments',
  postId: '3131fnu91h1e',
  edited: false,
  rating: 143,
  timestamp: 1614429965,
  postHref: '/posts/3131fnu91h1e',
  authorProfileHref: '/profiles/ovechking899',
  categoryHref: '/categories/meditation',
  numOfComments: 12,
  loadingRating: false,
  onUpVote: () => {},
  onDownVote: () => {},
  onSave: () => {},
  onShare: () => {},
  onReport: () => {},
  ratingStatus: 'up' as 'up',
};

describe('<Post />', () => {
  it('should render without crashing', () => {
    render(<Post loading={false} />);
  });

  it('should render a loader', () => {
    const { getByTestId } = render(<Post loading={true} />);
    getByTestId('loader');
  });

  it('should render a no post message', () => {
    const { getByText } = render(<Post loading={false} />);
    getByText(/no post found/i);
  });

  it('shound render rating', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={post} />
      </MemoryRouter>
    );
    getByText(post.rating);
  });

  it('should render username', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={post} />
      </MemoryRouter>
    );
    getByText(/ovechking899/i);
  });

  it('should render time ago string', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={post} />
      </MemoryRouter>
    );
    getByText(/ago/i);
  });

  it('should render category', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={post} />
      </MemoryRouter>
    );
    getByText(/meditation/i);
  });

  it('should render title', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={post} />
      </MemoryRouter>
    );
    getByText(/Hello if i looked at/i);
  });

  it('should render body', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={post} />
      </MemoryRouter>
    );
    getByText(/lorem ipsum/i);
  });

  it('should render comments link with correct number of comments', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={post} />
      </MemoryRouter>
    );
    getByText(/comments \(12\)/i);
  });

  it('should render save button', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={post} />
      </MemoryRouter>
    );
    getByText(/save/i);
  });

  it('should render share button', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={post} />
      </MemoryRouter>
    );
    getByText(/share/i);
  });

  it('should render report button', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={post} />
      </MemoryRouter>
    );
    getByText(/save/i);
  });

  it('should go to profile route', () => {
    const history = createMemoryHistory();
    history.push = jest.fn();
    const { getByText } = render(
      <Router history={history}>
        <Post loading={false} post={post} />
      </Router>
    );
    const username = getByText(/ovechking899/i);
    fireEvent.click(username);
    expect(history.push).toBeCalledWith('/profiles/ovechking899');
  });

  it('should go to category route', () => {
    const history = createMemoryHistory();
    history.push = jest.fn();
    const { getByText } = render(
      <Router history={history}>
        <Post loading={false} post={post} />
      </Router>
    );
    const category = getByText(/meditation/i);
    fireEvent.click(category);
    expect(history.push).toBeCalledWith('/categories/meditation');
  });

  it('should call onUpVote after clicking up arrow', () => {
    const onUpVote = jest.fn();
    const { getByTestId } = render(
      <MemoryRouter>
        <Post loading={false} post={{ ...post, onUpVote }} />
      </MemoryRouter>
    );
    const upArrow = getByTestId('up-arrow');
    expect(onUpVote).not.toHaveBeenCalled();
    fireEvent.click(upArrow);
    expect(onUpVote).toHaveBeenCalledTimes(1);
  });

  it('should call onDownVote after clicking down arrow', () => {
    const onDownVote = jest.fn();
    const { getByTestId } = render(
      <MemoryRouter>
        <Post loading={false} post={{ ...post, onDownVote }} />
      </MemoryRouter>
    );
    const downArrow = getByTestId('down-arrow');
    expect(onDownVote).not.toHaveBeenCalled();
    fireEvent.click(downArrow);
    expect(onDownVote).toHaveBeenCalledTimes(1);
  });

  it('should disable down vote button while loadingRating', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Post loading={false} post={{ ...post, loadingRating: true }} />
      </MemoryRouter>
    );
    const downArrow = getByTestId('down-arrow') as HTMLButtonElement;
    expect(downArrow.disabled).toBe(true);
  });

  it('should disable up vote button while loadingRating', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Post loading={false} post={{ ...post, loadingRating: true }} />
      </MemoryRouter>
    );
    const upArrow = getByTestId('up-arrow') as HTMLButtonElement;
    expect(upArrow.disabled).toBe(true);
  });

  it('should call onSave after clicking save button', () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={{ ...post, onSave }} />
      </MemoryRouter>
    );
    const saveBtn = getByText(/save/i);
    expect(onSave).not.toHaveBeenCalled();
    fireEvent.click(saveBtn);
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('should call onShare after clicking share button', () => {
    const onShare = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={{ ...post, onShare }} />
      </MemoryRouter>
    );
    const shareBtn = getByText(/share/i);
    expect(onShare).not.toHaveBeenCalled();
    fireEvent.click(shareBtn);
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it('should call onReport after clicking report button', () => {
    const onReport = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Post loading={false} post={{ ...post, onReport }} />
      </MemoryRouter>
    );
    const reportBtn = getByText(/report/i);
    expect(onReport).not.toHaveBeenCalled();
    fireEvent.click(reportBtn);
    expect(onReport).toHaveBeenCalledTimes(1);
  });
});
