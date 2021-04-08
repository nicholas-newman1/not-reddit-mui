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
    rating: 143,
    ratingStatus: 'up' as 'up',
    title:
      'Hello if i looked at the sun I would see how beautiful it is, and then go blind',
    username: 'ovechking899',
    userProfileHref: '/profiles/ovechking899',
    timestamp: 1614429965,
    category: 'meditation',
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
    rating: 143,
    ratingStatus: 'up' as 'up',
    title:
      'Hello if i looked at the sun I would see how beautiful it is, and then go blind',
    username: 'ovechking899',
    userProfileHref: '/profiles/ovechking899',
    timestamp: 1614429965,
    category: 'meditation',
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
    rating: 143,
    ratingStatus: 'up' as 'up',
    title:
      'Hello if i looked at the sun I would see how beautiful it is, and then go blind',
    username: 'ovechking899',
    userProfileHref: '/profiles/ovechking899',
    timestamp: 1614429965,
    category: 'meditation',
    categoryHref: '/categories/meditation',
  },
];

describe('<PostList />', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <PostList posts={dummyPosts} />
      </MemoryRouter>
    );
  });

  it('renders a list', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <PostList posts={dummyPosts} />
      </MemoryRouter>
    );

    getByRole('list');
  });

  it('renders a list item for each post', () => {
    const { getAllByRole } = render(
      <MemoryRouter>
        <PostList posts={dummyPosts} />
      </MemoryRouter>
    );

    expect(dummyPosts.length).toBe(getAllByRole('listitem').length);
  });
});
