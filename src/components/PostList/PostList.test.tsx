import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import PostList from '.';

const dummyPosts = [
  {
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
    userProfileHref: '/profiles/ovechking899',
    timestamp: 1614429965,
    categoryId: 'meditation',
    categoryHref: '/categories/meditation',
  },
  {
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
    userProfileHref: '/profiles/ovechking899',
    timestamp: 1614429965,
    categoryId: 'meditation',
    categoryHref: '/categories/meditation',
  },
  {
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
    userProfileHref: '/profiles/ovechking899',
    timestamp: 1614429965,
    categoryId: 'meditation',
    categoryHref: '/categories/meditation',
  },
];

describe('<PostList />', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <PostList posts={dummyPosts} loading={false} />
      </MemoryRouter>
    );
  });

  it('renders a list', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <PostList posts={dummyPosts} loading={false} />
      </MemoryRouter>
    );

    getByRole('list');
  });

  it('renders a list item for each post', () => {
    const { getAllByRole } = render(
      <MemoryRouter>
        <PostList posts={dummyPosts} loading={false} />
      </MemoryRouter>
    );

    expect(dummyPosts.length).toBe(getAllByRole('listitem').length);
  });
});
