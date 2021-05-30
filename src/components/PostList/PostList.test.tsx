import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import PostList from '.';

const dummyPosts = [
  {
    numOfComments: 12,
    onDownVote: () => {},
    onSave: () => {},
    onShare: () => {},
    onReport: () => {},
    onUpVote: () => {},
    postHref: '/posts/3131fnu91h1e1',
    postId: '3131fnu91h1e1',
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
    isEditing: false,
    loadingDelete: false,
    loadingEdit: false,
    onDelete: () => {},
    onEdit: () => {},
    onToggleEditing: () => {},
    authorId: 'mv138g8vn1408f1',
    body: '123',
    edited: false,
    isAuthor: false,
  },
  {
    numOfComments: 12,
    onDownVote: () => {},
    onSave: () => {},
    onShare: () => {},
    onReport: () => {},
    onUpVote: () => {},
    postHref: '/posts/3131fnu91h1e2',
    postId: '3131fnu91h1e2',
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
    isEditing: false,
    loadingDelete: false,
    loadingEdit: false,
    onDelete: () => {},
    onEdit: () => {},
    onToggleEditing: () => {},
    authorId: 'mv138g8vn1408f1',
    body: '123',
    edited: false,
    isAuthor: false,
  },
  {
    numOfComments: 12,
    onDownVote: () => {},
    onSave: () => {},
    onShare: () => {},
    onReport: () => {},
    onUpVote: () => {},
    postHref: '/posts/3131fnu91h1e3',
    postId: '3131fnu91h1e3',
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
    isEditing: false,
    loadingDelete: false,
    loadingEdit: false,
    onDelete: () => {},
    onEdit: () => {},
    onToggleEditing: () => {},
    authorId: 'mv138g8vn1408f1',
    body: '123',
    edited: false,
    isAuthor: false,
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

  it('renders message for no posts', () => {
    const { getByText } = render(
      <MemoryRouter>
        <PostList posts={[]} loading={false} />
      </MemoryRouter>
    );

    getByText(/no posts found/i);
  });
});
