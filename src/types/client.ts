export interface Post {
  title: string;
  body: string;
  authorId: string;
  authorUsername: string | null;
  categoryId: string;
  postId: string;
  edited: boolean;
  rating: number;
  timestamp: number;
  postHref: string;
  userProfileHref: string;
  categoryHref: string;
  numOfComments: number;
}

export interface Comment {
  authorId: string;
  authorUsername: string;
  body: string;
  edited: boolean;
  rating: number;
  timestamp: number;
  replies: Comment[];
  path: string;
  userProfileHref: string;
  numOfComments: number;
  postId: string;
  categoryId: string;
  isAuthor: boolean;
  deleted: boolean;
}
