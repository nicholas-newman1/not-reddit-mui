import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../services/firebase';

interface RatingStatusState {
  upVotePostIds: string[];
  downVotePostIds: string[];
  loadingUpVotePostIds: string[];
  loadingDownVotePostIds: string[];
  loading: boolean;
  error: string;
  isFirstFetch: boolean;
}

const initialState: RatingStatusState = {
  upVotePostIds: [],
  downVotePostIds: [],
  loadingUpVotePostIds: [],
  loadingDownVotePostIds: [],
  loading: true,
  error: '',
  isFirstFetch: false,
};

export const getVotePostIds = createAsyncThunk(
  'ratingStatus/getVotePostIds',
  async (postIds: string[]) => {
    const upVoteSnap = await db
      .collectionGroup('upVoteIds')
      .where('postId', 'in', postIds)
      .where('uid', '==', auth.currentUser?.uid)
      .get();
    const upVotePostIds = upVoteSnap.docs.map((doc) => doc.data().postId);

    const downVoteSnap = await db
      .collectionGroup('downVoteIds')
      .where('postId', 'in', postIds)
      .where('uid', '==', auth.currentUser?.uid)
      .get();
    const downVotePostIds = downVoteSnap.docs.map((doc) => doc.data().postId);

    return { upVotePostIds, downVotePostIds };
  }
);

export const upVote = createAsyncThunk(
  'ratingStatus/upVote',
  async ({ postId, title }: { postId: string; title: string }) => {
    const uid = auth.currentUser?.uid;
    return db
      .doc(`posts/${postId}/upVoteIds/${uid}`)
      .set({
        postId,
        title,
        uid,
      })
      .then(() => postId);
  }
);

export const removeUpVote = createAsyncThunk(
  'ratingStatus/removeUpVote',
  async (postId: string) => {
    const uid = auth.currentUser?.uid;
    return db
      .doc(`posts/${postId}/upVoteIds/${uid}`)
      .delete()
      .then(() => postId);
  }
);

export const downVote = createAsyncThunk(
  'ratingStatus/downVote',
  async ({ postId, title }: { postId: string; title: string }) => {
    const uid = auth.currentUser?.uid;
    return db
      .doc(`posts/${postId}/downVoteIds/${uid}`)
      .set({
        postId,
        title,
        uid,
      })
      .then(() => postId);
  }
);

export const removeDownVote = createAsyncThunk(
  'ratingStatus/removeDownVote',
  async (postId: string) => {
    const uid = auth.currentUser?.uid;
    return db
      .doc(`posts/${postId}/downVoteIds/${uid}`)
      .delete()
      .then(() => postId);
  }
);

export const ratingStatusSlice = createSlice({
  name: 'ratingStatus',
  initialState,
  reducers: {
    clearVotePostIds: (state) => {
      state.loadingUpVotePostIds = [];
      state.loadingDownVotePostIds = [];
      state.upVotePostIds = [];
      state.downVotePostIds = [];
      state.loading = false;
      state.error = '';
    },
    setIsFirstFetch: (state, action: { payload: boolean }) => {
      state.isFirstFetch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVotePostIds.pending, (state) => {
        state.upVotePostIds = [];
        state.downVotePostIds = [];
        state.loading = true;
        state.error = '';
      })
      .addCase(getVotePostIds.fulfilled, (state, action) => {
        state.upVotePostIds = action.payload?.upVotePostIds;
        state.downVotePostIds = action.payload?.downVotePostIds;
        state.loading = false;
      })
      .addCase(getVotePostIds.rejected, (state, action) => {
        state.loading = false;
        state.error = 'An error occurred';
      })
      .addCase(upVote.pending, (state, action) => {
        state.loadingUpVotePostIds.push(action.meta.arg.postId);
        state.error = '';
      })
      .addCase(upVote.fulfilled, (state, action) => {
        state.upVotePostIds.push(action.payload);
        state.loadingUpVotePostIds = state.loadingUpVotePostIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(upVote.rejected, (state, action) => {
        state.error = 'An error occurred';
        state.loadingUpVotePostIds = state.loadingUpVotePostIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(removeUpVote.pending, (state, action) => {
        state.loadingUpVotePostIds.push(action.meta.arg);
        state.error = '';
      })
      .addCase(removeUpVote.fulfilled, (state, action) => {
        state.upVotePostIds = state.upVotePostIds.filter(
          (id) => id !== action.payload
        );
        state.loadingUpVotePostIds = state.loadingUpVotePostIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(removeUpVote.rejected, (state, action) => {
        state.error = 'An error occurred';
        state.loadingUpVotePostIds = state.loadingUpVotePostIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(downVote.pending, (state, action) => {
        state.loadingDownVotePostIds.push(action.meta.arg.postId);
        state.error = '';
      })
      .addCase(downVote.fulfilled, (state, action) => {
        state.downVotePostIds.push(action.payload);
        state.loadingDownVotePostIds = state.loadingDownVotePostIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(downVote.rejected, (state, action) => {
        state.error = 'An error occurred';
        state.loadingDownVotePostIds = state.loadingDownVotePostIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(removeDownVote.pending, (state, action) => {
        state.loadingDownVotePostIds.push(action.meta.arg);
        state.error = '';
      })
      .addCase(removeDownVote.fulfilled, (state, action) => {
        state.downVotePostIds = state.downVotePostIds.filter(
          (id) => id !== action.payload
        );
        state.loadingDownVotePostIds = state.loadingDownVotePostIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(removeDownVote.rejected, (state, action) => {
        state.error = 'An error occurred';
        state.loadingDownVotePostIds = state.loadingDownVotePostIds.filter(
          (id) => id !== action.payload
        );
      });
  },
});

export const { clearVotePostIds, setIsFirstFetch } = ratingStatusSlice.actions;

export default ratingStatusSlice.reducer;
