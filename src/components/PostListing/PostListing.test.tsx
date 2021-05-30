import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import PostListing from '.';

describe('<PostListing />', () => {
  const props = {
    commentsHref: '/posts/3131fnu91h1e#comments',
    numOfComments: 12,
    onDownVote: () => {},
    onSave: () => {},
    onShare: () => {},
    onReport: () => {},
    onUpVote: () => {},
    postHref: '/posts/3131fnu91h1e',
    postId: '3131fnu91h1e',
    rating: 143,
    ratingStatus: 'up' as 'up',
    title:
      'Hello if i looked at the sun I would see how beautiful it is, and then go blind',
    authorUsername: 'ovechking899',
    authorProfileHref: '/profiles/ovechking899',
    timestamp: 1614429965,
    categoryId: 'meditation',
    categoryHref: '/categories/meditation',
    loadingRating: false,

    loadingDelete: false,
    onDelete: () => {},
    onEdit: () => {},
    authorId: 'nvrebvpwvbe',
    body: '123',
    edited: false,
    isAuthor: false,
  };

  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <PostListing {...props} />
      </MemoryRouter>
    );
  });

  it('should render rating', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} />
      </MemoryRouter>
    );
    getByText(/143/);
  });

  it('should render username', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} />
      </MemoryRouter>
    );
    getByText(/ovechking899/i);
  });

  it('should render time ago string', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} />
      </MemoryRouter>
    );
    getByText(/ago/i);
  });

  it('should render category', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} />
      </MemoryRouter>
    );
    getByText(/meditation/i);
  });

  it('should render title', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} />
      </MemoryRouter>
    );
    getByText(/Hello if i looked at/i);
  });

  it('should render comments link with correct number of comments', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} />
      </MemoryRouter>
    );
    getByText(/comments \(12\)/i);
  });

  it('should render save button', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} />
      </MemoryRouter>
    );
    getByText(/save/i);
  });

  it('should render share button', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} />
      </MemoryRouter>
    );
    getByText(/share/i);
  });

  it('should render report button', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} />
      </MemoryRouter>
    );
    getByText(/save/i);
  });

  it('should not render report button if isAuthor', () => {
    const { queryByText } = render(
      <MemoryRouter>
        <PostListing {...props} isAuthor />
      </MemoryRouter>
    );
    const button = queryByText(/report/i);
    expect(button).not.toBeInTheDocument();
  });

  it('should render delete button if isAuthor', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} isAuthor />
      </MemoryRouter>
    );
    getByText(/delete/i);
  });

  it('should render edit button if isAuthor', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} isAuthor />
      </MemoryRouter>
    );
    getByText(/^edit/i);
  });

  it('should render edited tag if edited', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} edited />
      </MemoryRouter>
    );
    getByText(/edited/i);
  });

  it('should go to profile route', () => {
    const history = createMemoryHistory();
    history.push = jest.fn();
    const { getByText } = render(
      <Router history={history}>
        <PostListing {...props} />
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
        <PostListing {...props} />
      </Router>
    );
    const category = getByText(/meditation/i);
    fireEvent.click(category);
    expect(history.push).toBeCalledWith('/categories/meditation');
  });

  it('should go to comments route', () => {
    const history = createMemoryHistory();
    history.push = jest.fn();
    const { getByText } = render(
      <Router history={history}>
        <PostListing {...props} />
      </Router>
    );
    const comments = getByText(/comments/i);
    fireEvent.click(comments);
    expect(history.push).toBeCalledWith('/posts/3131fnu91h1e');
  });

  it('should call onUpVote after clicking up arrow', () => {
    const onUpVote = jest.fn();
    const { getByTestId } = render(
      <MemoryRouter>
        <PostListing {...props} onUpVote={onUpVote} />
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
        <PostListing {...props} onDownVote={onDownVote} />
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
        <PostListing {...props} loadingRating={true} />
      </MemoryRouter>
    );
    const downArrow = getByTestId('down-arrow') as HTMLButtonElement;
    expect(downArrow.disabled).toBe(true);
  });

  it('should disable up vote button while loadingRating', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <PostListing {...props} loadingRating={true} />
      </MemoryRouter>
    );
    const upArrow = getByTestId('up-arrow') as HTMLButtonElement;
    expect(upArrow.disabled).toBe(true);
  });

  it('should call onSave after clicking save button', () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} onSave={onSave} />
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
        <PostListing {...props} onShare={onShare} />
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
        <PostListing {...props} onReport={onReport} />
      </MemoryRouter>
    );
    const reportBtn = getByText(/report/i);
    expect(onReport).not.toHaveBeenCalled();
    fireEvent.click(reportBtn);
    expect(onReport).toHaveBeenCalledTimes(1);
  });

  it('should call onEdit after clicking edit button', () => {
    const fn = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} onEdit={fn} isAuthor />
      </MemoryRouter>
    );
    const button = getByText(/^edit?/i);
    expect(fn).not.toHaveBeenCalled();
    fireEvent.click(button);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete after clicking delete button', () => {
    const fn = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <PostListing {...props} onDelete={fn} isAuthor />
      </MemoryRouter>
    );
    const button = getByText(/delete/i);
    expect(fn).not.toHaveBeenCalled();
    fireEvent.click(button);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
