export interface Post {
  authorId: string;
  authorProfileHref: string;
  authorUsername: string;
  body: string;
  categoryHref: string;
  categoryId: string;
  edited: boolean;
  isAuthor: boolean;
  numOfComments: number;
  postHref: string;
  postId: string;
  rating: number;
  timestamp: number;
  title: string;
}

export interface Comment {
  authorId: string;
  authorProfileHref: string;
  authorUsername: string;
  body: string;
  categoryId: string;
  commentId: string;
  deleted: boolean;
  edited: boolean;
  isAuthor: boolean;
  numOfComments: number;
  path: string;
  postId: string;
  rating: number;
  replies: Comment[];
  timestamp: number;
}

export type Error =
  | {
      message?: string;
      type?: string;
    }
  | undefined;
