import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../services/firebase';
import { DBComment, DBPost } from '../types/db';
import { Comment, Post } from '../types/client';

interface PostPageState {
  post: Post | null;
  postLoading: boolean;
  postError: string;
  comments: Comment[];
  commentsLoading: boolean;
  commentsError: string;
  isCreateCommentDialogOpen: boolean;
  createCommentLoading: boolean;
  createCommentError: string;
}

const initialState: PostPageState = {
  post: null,
  postLoading: true,
  postError: '',
  comments: [],
  commentsLoading: true,
  commentsError: '',
  isCreateCommentDialogOpen: false,
  createCommentLoading: false,
  createCommentError: '',
};

export const getPost = createAsyncThunk(
  'postPage/getPost',
  async (postId: string) => {
    const snap = await db.doc(`/posts/${postId}`).get();
    const data = snap.data() as DBPost;
    return {
      ...data,
      postId: snap.id,
      timestamp: data.timestamp.seconds,
      postHref: `/categories/${data.categoryId}/${snap.id}`,
      authorProfileHref: `/users/${data.authorId}`,
      categoryHref: `/categories/${data.categoryId}`,
    };
  }
);

export const getComments = createAsyncThunk(
  'postPage/getComments',
  async (postId: string) => {
    const snap = await db
      .collection(`/posts/${postId}/comments`)
      .orderBy('timestamp', 'desc')
      .get();
    return snap.docs.map((doc) => {
      const data = doc.data() as DBComment;
      return {
        ...data,
        timestamp: data.timestamp.seconds,
        replies: [] as Comment[],
        path: doc.ref.path,
        authorProfileHref: `/profiles/${data.authorId}`,
        isAuthor: auth.currentUser?.uid === data.authorId,
      };
    });
  }
);

export const createComment = createAsyncThunk(
  'postPage/createComment',
  async ({ body, postId }: { body: string; postId: string }) => {
    const ref = await db
      .collection(`posts/${postId}/comments`)
      .add({ body, authorId: auth.currentUser?.uid });
    const doc = await db.doc(`posts/${postId}/comments/${ref.id}`).get();
    const data = doc.data() as DBComment;
    return {
      ...data,
      timestamp: data.timestamp.seconds,
      replies: [] as Comment[],
      path: doc.ref.path,
      authorProfileHref: `/profiles/${data.authorId}`,
      isAuthor: true,
    };
  }
);

export const postPageSlice = createSlice({
  name: 'postPage',
  initialState,
  reducers: {
    displayCreateCommentDialog: (state) => {
      state.isCreateCommentDialogOpen = true;
    },
    hideCreateCommentDialog: (state) => {
      state.isCreateCommentDialogOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPost.pending, (state) => {
        state.post = null;
        state.postLoading = true;
        state.postError = '';
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.post = action.payload;
        state.postLoading = false;
        state.postError = '';
      })
      .addCase(getPost.rejected, (state) => {
        state.post = null;
        state.postLoading = false;
        state.postError = 'An error occured';
      })
      .addCase(getComments.pending, (state) => {
        state.comments = [];
        state.commentsLoading = true;
        state.commentsError = '';
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.commentsLoading = false;
        state.commentsError = '';
      })
      .addCase(getComments.rejected, (state, action) => {
        state.comments = [];
        state.commentsLoading = false;
        state.commentsError = 'An error occured';
      })
      .addCase(createComment.pending, (state) => {
        state.createCommentLoading = true;
        state.createCommentError = '';
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
        state.createCommentLoading = false;
        state.createCommentError = '';
        state.isCreateCommentDialogOpen = false;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.createCommentLoading = false;
        state.createCommentError = 'An error occured';
      });
  },
});

export const { displayCreateCommentDialog, hideCreateCommentDialog } =
  postPageSlice.actions;

export default postPageSlice.reducer;
