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
