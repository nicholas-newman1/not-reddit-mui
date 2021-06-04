import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../services/firebase';
import { DBComment, DBPost, DocumentSnapshot } from '../types/db';
import { Comment, Post } from '../types/client';

interface PostPageState {
  comments: Comment[];
  commentsError: string;
  commentsLoading: boolean;
  createCommentError: string;
  createCommentLoading: boolean;
  deletePostError: string;
  deletePostLoading: boolean;
  editPostError: string;
  editPostLoading: boolean;
  isCreateCommentDialogOpen: boolean;
  isEditing: boolean;
  moreCommentsError: string;
  moreCommentsExhausted: boolean;
  moreCommentsLoading: boolean;
  post: Post | null;
  postError: string;
  postLoading: boolean;
}

const initialState: PostPageState = {
  comments: [],
  commentsError: '',
  commentsLoading: true,
  createCommentError: '',
  createCommentLoading: false,
  deletePostError: '',
  deletePostLoading: false,
  editPostError: '',
  editPostLoading: false,
  isCreateCommentDialogOpen: false,
  isEditing: false,
  moreCommentsError: '',
  moreCommentsExhausted: false,
  moreCommentsLoading: false,
  post: null,
  postError: '',
  postLoading: true,
};

const commentsPageLength = 10;
let lastComment: DocumentSnapshot | null = null;

export const getPost = createAsyncThunk(
  'postPage/getPost',
  async (postId: string) => {
    const postDoc = await db.doc(`/posts/${postId}`).get();
    const post = postDoc.data() as DBPost;
    return {
      ...post,
      authorProfileHref: `/users/${post.authorId}`,
      categoryHref: `/categories/${post.categoryId}`,
      isAuthor: auth.currentUser?.uid === post.authorId,
      isOwnerOfCategory: auth.currentUser?.uid === post.ownerOfCategory,
      postHref: `/categories/${post.categoryId}/${postDoc.id}`,
      postId: postDoc.id,
      timestamp: post.timestamp.seconds,
    };
  }
);

export const getComments = createAsyncThunk(
  'postPage/getComments',
  async (postId: string) => {
    const snap = await db
      .collection(`/posts/${postId}/comments`)
      .orderBy('timestamp', 'desc')
      .limit(commentsPageLength)
      .get();

    lastComment = snap.docs[snap.docs.length - 1];
    return snap.docs.map((doc) => {
      const data = doc.data() as DBComment;
      return {
        ...data,
        authorProfileHref: `/profiles/${data.authorId}`,
        commentId: doc.id,
        isAuthor: auth.currentUser?.uid === data.authorId,
        isOwnerOfCategory: auth.currentUser?.uid === data.ownerOfCategory,
        path: doc.ref.path,
        replies: [] as Comment[],
        timestamp: data.timestamp.seconds,
      };
    });
  }
);

export const getMoreComments = createAsyncThunk(
  'postPage/getMoreComments',
  async (postId: string) => {
    const snap = await db
      .collection(`/posts/${postId}/comments`)
      .orderBy('timestamp', 'desc')
      .limit(commentsPageLength)
      .startAfter(lastComment)
      .get();
    lastComment = snap.docs[snap.docs.length - 1];
    return snap.docs.map((doc) => {
      const data = doc.data() as DBComment;
      return {
        ...data,
        authorProfileHref: `/profiles/${data.authorId}`,
        commentId: doc.id,
        isAuthor: auth.currentUser?.uid === data.authorId,
        isOwnerOfCategory: auth.currentUser?.uid === data.ownerOfCategory,
        path: doc.ref.path,
        replies: [] as Comment[],
        timestamp: data.timestamp.seconds,
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
      authorProfileHref: `/profiles/${auth.currentUser?.uid}`,
      commentId: ref.id,
      isAuthor: true,
      isOwnerOfCategory: auth.currentUser?.uid === data.ownerOfCategory,
      path: doc.ref.path,
      replies: [] as Comment[],
      timestamp: Date.now() / 1000,
    };
  }
);

export const editPost = createAsyncThunk(
  'postPage/editPost',
  async (
    { title, body, post }: { title: string; body: string; post: Post },
    { rejectWithValue }
  ) => {
    try {
      await db.doc(`posts/${post.postId}`).update({ title, body });
      return {
        ...post,
        title,
        body,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'postPage/deletePost',
  (postId: string) => db.doc(`posts/${postId}`).delete()
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
    toggleEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
    setPost: (state, action: { payload: Post }) => {
      state.post = action.payload;
    },
    setPostLoading: (state, action: { payload: boolean }) => {
      state.postLoading = action.payload;
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
        if (action.payload.length < commentsPageLength)
          state.moreCommentsExhausted = true;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.comments = [];
        state.commentsLoading = false;
        state.commentsError = 'An error occured';
      })
      .addCase(getMoreComments.pending, (state) => {
        state.moreCommentsLoading = true;
        state.moreCommentsError = '';
      })
      .addCase(getMoreComments.fulfilled, (state, action) => {
        state.comments = [...state.comments, ...action.payload];
        state.moreCommentsLoading = false;
        if (action.payload.length < commentsPageLength)
          state.moreCommentsExhausted = true;
      })
      .addCase(getMoreComments.rejected, (state) => {
        state.moreCommentsLoading = false;
        state.moreCommentsError = 'An error occurred';
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
      })
      .addCase(deletePost.pending, (state) => {
        state.deletePostLoading = true;
        state.deletePostError = '';
      })
      .addCase(deletePost.fulfilled, (state) => {
        state.deletePostLoading = false;
        state.deletePostError = '';
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.deletePostLoading = false;
        state.deletePostError = 'An error occured';
      })
      .addCase(editPost.pending, (state) => {
        state.editPostLoading = true;
        state.editPostError = '';
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.editPostLoading = false;
        state.editPostError = '';
        state.post = action.payload;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.editPostLoading = false;
        state.editPostError = 'An error occured';
      });
  },
});

export const {
  displayCreateCommentDialog,
  hideCreateCommentDialog,
  toggleEditing,
  setPost,
  setPostLoading,
} = postPageSlice.actions;

export default postPageSlice.reducer;
