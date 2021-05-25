import { render } from '../../utils/testUtils';
import { MemoryRouter } from 'react-router';
import CommentList from '.';

const dummyComments = [
  {
    authorId: '222',
    authorUsername: 'name',
    body: 'comment',
    edited: false,
    rating: 2,
    timestamp: Date.now() / 1000,
    replies: [],
    path: 'comments/comment222/comments/comment222',
    authorProfileHref: '/profiles/222',
    numOfComments: 0,
    postId: 'post222',
    categoryId: 'category222',
    isAuthor: false,
    deleted: false,
    commentId: 'comment222',
  },
  {
    authorId: '333',
    authorUsername: 'name2',
    body: 'comment 2',
    edited: false,
    rating: 4,
    timestamp: Date.now() / 1000,
    replies: [],
    path: 'comments/comment333/comments/comment333',
    authorProfileHref: '/profiles/333',
    numOfComments: 0,
    postId: 'post333',
    categoryId: 'category333',
    isAuthor: false,
    deleted: false,
    commentId: 'comment333',
  },
];

describe('<CommentList />', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <CommentList comments={dummyComments} loading={false} />
      </MemoryRouter>
    );
  });

  it('renders a list', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <CommentList comments={dummyComments} loading={false} />
      </MemoryRouter>
    );

    getByRole('list');
  });

  it('renders a list item for each comment', () => {
    const { getAllByRole } = render(
      <MemoryRouter>
        <CommentList comments={dummyComments} loading={false} />
      </MemoryRouter>
    );

    expect(dummyComments.length).toBe(getAllByRole('listitem').length);
  });

  it('renders message for no comments', () => {
    const { getByText } = render(
      <MemoryRouter>
        <CommentList comments={[]} loading={false} />
      </MemoryRouter>
    );

    getByText(/no comments found/i);
  });
});
