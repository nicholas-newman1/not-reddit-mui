import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter, Router } from 'react-router';
import { createMemoryHistory } from 'history';
import Comment from '.';
import { render as reduxRender } from '../../utils/testUtils';

const props = {
  authorId: '111',
  authorProfileHref: '/profiles/111',
  authorUsername: 'name',
  body: 'body of text',
  categoryId: 'category111',
  commentId: 'comment111',
  deleted: false,
  edited: false,
  editing: false,
  gotReplies: true,
  isAuthor: false,
  isOwnerOfCategory: false,
  loadingDelete: false,
  loadingEdit: false,
  loadingRating: false,
  loadingReplies: false,
  loadingReply: false,
  loadingSubscribe: false,
  numOfComments: 4,
  onDelete: () => {},
  onDownVote: () => {},
  onEdit: () => {},
  onReport: () => {},
  onReplies: () => {},
  onReply: () => {},
  onSignIn: () => {},
  onSubscribe: () => {},
  onUpVote: () => {},
  ownerOfCategory: 'randomowner',
  path: 'posts/post111/comments/comment111',
  postId: 'post111',
  rating: 2,
  replies: [],
  replying: false,
  setEditing: () => {},
  setReplying: () => {},
  timestamp: Date.now() / 1000,
};

interface KeyValueObject {
  [key: string]: any;
}

const comment = (extraProps: KeyValueObject = {}) => (
  <MemoryRouter>
    <Comment {...props} {...extraProps} />
  </MemoryRouter>
);

describe('<Comment />', () => {
  it('should render without crashing', () => {
    render(comment());
  });

  it('should render comment rating', () => {
    const { getByText } = render(comment());
    getByText(/2/);
  });

  it('should render props.authorUsername', () => {
    const { getByText } = render(comment());
    getByText(/name/i);
  });

  it('should go to authorProfileHref', () => {
    const history = createMemoryHistory();
    history.push = jest.fn();
    const { getByText } = render(
      <Router history={history}>
        <Comment {...props} />
      </Router>
    );
    const username = getByText(/name/i);
    fireEvent.click(username);
    expect(history.push).toBeCalledWith(props.authorProfileHref);
  });

  it('should render time ago string', () => {
    const { getByText } = render(comment());
    getByText(/ago/i);
  });

  it('should not render edit comment form if props.editing is false', () => {
    const { queryByRole } = render(comment());
    const textbox = queryByRole('textbox');
    expect(textbox).not.toBeInTheDocument();
  });

  it('should render edit comment form if props.editing is true', () => {
    const { getByRole } = render(comment({ editing: true }));
    getByRole('textbox');
  });

  it('should render edit comment form with default value set to current body', () => {
    const { getByRole } = render(comment({ editing: true }));
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe(props.body);
  });

  it('should render a show replies button', () => {
    const { getByRole } = render(comment());
    getByRole('button', {
      name: /replies/i,
    });
  });

  it('should call props.onReplies upon clicking show replies button', () => {
    const fn = jest.fn();
    const { getByRole } = render(comment({ onReplies: fn }));
    const button = getByRole('button', {
      name: /replies/i,
    });
    fireEvent.click(button);
    expect(fn).toBeCalled();
  });

  it('should disable replies button while props.loadingReplies is true', () => {
    const { getByRole } = render(comment({ loadingReplies: true }));
    const button = getByRole('button', {
      name: /replies/i,
    }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should not render a show replies button if numOfComments is < 1', () => {
    const { queryByRole } = render(comment({ numOfComments: 0 }));
    const button = queryByRole('button', {
      name: /replies/i,
    }) as HTMLButtonElement;
    expect(button).not.toBeInTheDocument();
  });

  it('should change show replies button text based on props.gotReplies', () => {
    const { getByText } = render(comment({ gotReplies: true }));
    getByText(/hide replies/i);
  });

  it('should render reply button', () => {
    const { getByRole } = render(comment());
    getByRole('button', {
      name: /reply/i,
    });
  });

  it('should call props.setReplying upon clicking reply button', () => {
    const fn = jest.fn();
    const { getByRole } = render(comment({ setReplying: fn }));
    const button = getByRole('button', {
      name: /reply/i,
    });
    fireEvent.click(button);
    expect(fn).toBeCalled();
  });

  it('should not render delete button if props.isAuthor and props.isOwnerOfCategory is false', () => {
    const { queryByRole } = render(comment());
    const button = queryByRole('button', {
      name: /delete/i,
    });
    expect(button).not.toBeInTheDocument();
  });

  it('should render delete button if props.isAuthor is true', () => {
    const { getByRole } = render(comment({ isAuthor: true }));
    getByRole('button', {
      name: /delete/i,
    });
  });

  it('should render delete button if props.isOwnerOfCategory is true', () => {
    const { getByRole } = render(comment({ isOwnerOfCategory: true }));
    getByRole('button', {
      name: /delete/i,
    });
  });

  it('should call props.onDelete upon clicking delete button', () => {
    const fn = jest.fn();
    const { getByRole } = render(comment({ onDelete: fn, isAuthor: true }));
    const button = getByRole('button', {
      name: /delete/i,
    });
    fireEvent.click(button);
    expect(fn).toBeCalled();
  });

  it('should not render edit button if !props.isAuthor', () => {
    const { queryByRole } = render(comment({ isOwnerOfCategory: true }));
    const button = queryByRole('button', {
      name: /^edit/i,
    });
    expect(button).not.toBeInTheDocument();
  });

  it('should render edit button if props.isAuthor is true', () => {
    const { getByRole } = render(comment({ isAuthor: true }));
    getByRole('button', {
      name: /^edit/i,
    });
  });

  it('should call props.setEditing upon clicking edit button', () => {
    const fn = jest.fn();
    const { getByRole } = render(comment({ setEditing: fn, isAuthor: true }));
    const button = getByRole('button', {
      name: /^edit/i,
    });
    fireEvent.click(button);
    expect(fn).toBeCalled();
  });

  it('should not render report button if props.isAuthor or props.isOwnerOfCategory is true', () => {
    const { queryByRole } = render(comment({ isAuthor: true }));
    const button = queryByRole('button', {
      name: /report/i,
    });
    expect(button).not.toBeInTheDocument();
  });

  it('should render report button if props.isAuthor and props.isOwnerOfCategory is false', () => {
    const { getByRole } = render(comment());
    getByRole('button', {
      name: /report/i,
    });
  });

  it('should call props.onReport upon clicking report button', () => {
    const fn = jest.fn();
    const { getByRole } = render(comment({ onReport: fn }));
    const button = getByRole('button', {
      name: /report/i,
    });
    fireEvent.click(button);
    expect(fn).toBeCalled();
  });

  it('should not render create comment form if props.replying is false', () => {
    const { queryByRole } = render(comment());
    const textbox = queryByRole('textbox');
    expect(textbox).not.toBeInTheDocument();
  });

  it('should render create comment form if props.replying is true', () => {
    const { getByRole } = render(comment({ replying: true }));
    getByRole('textbox');
  });

  it('should render replies', () => {
    const { getByText } = reduxRender(
      comment({
        replies: [
          {
            authorId: '222',
            authorUsername: 'name',
            body: 'this is a unique reply',
            edited: false,
            rating: 2,
            timestamp: Date.now() / 1000,
            replies: [],
            path: 'posts/post222/comments/comment222',
            authorProfileHref: '/profiles/222',
            numOfComments: 0,
            postId: 'post222',
            categoryId: 'category222',
            isAuthor: false,
            deleted: false,
            commentId: 'comment222',
          },
        ],
      })
    );

    getByText(/this is a unique reply/i);
  });
});
