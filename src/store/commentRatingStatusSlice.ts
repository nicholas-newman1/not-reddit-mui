import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../services/firebase';

interface RatingStatusState {
  upVoteCommentIds: string[];
  downVoteCommentIds: string[];
  loadingUpVoteCommentIds: string[];
  loadingDownVoteCommentIds: string[];
  loading: boolean;
  error: string;
  isFirstFetch: boolean;
}

const initialState: RatingStatusState = {
  upVoteCommentIds: [],
  downVoteCommentIds: [],
  loadingUpVoteCommentIds: [],
  loadingDownVoteCommentIds: [],
  loading: true,
  error: '',
  isFirstFetch: false,
};

export const getVoteCommentIds = createAsyncThunk(
  'commentRatingStatus/getVoteCommentIds',
  async (commentIds: string[]) => {
    const upVoteSnap = await db
      .collectionGroup('upVoteIds')
      .where('commentId', 'in', commentIds)
      .where('uid', '==', auth.currentUser?.uid)
      .get();
    const upVoteItemIds = upVoteSnap.docs.map((doc) => doc.data().commentId);

    const downVoteSnap = await db
      .collectionGroup('downVoteIds')
      .where('commentId', 'in', commentIds)
      .where('uid', '==', auth.currentUser?.uid)
      .get();
    const downVoteItemIds = downVoteSnap.docs.map(
      (doc) => doc.data().commentId
    );

    return { upVoteItemIds, downVoteItemIds };
  }
);

export const upVote = createAsyncThunk(
  'commentRatingStatus/upVote',
  async (commentId: string, { rejectWithValue }) => {
    const uid = auth.currentUser?.uid;
    return db
      .doc(`comments/${commentId}/upVoteIds/${uid}`)
      .set({ commentId, uid })
      .then(() => commentId)
      .catch((err) => rejectWithValue(commentId));
  }
);

export const removeUpVote = createAsyncThunk(
  'commentRatingStatus/removeUpVote',
  async (commentId: string, { rejectWithValue }) => {
    const uid = auth.currentUser?.uid;
    return db
      .doc(`comments/${commentId}/upVoteIds/${uid}`)
      .delete()
      .then(() => commentId)
      .catch((err) => rejectWithValue(commentId));
  }
);

export const downVote = createAsyncThunk(
  'commentRatingStatus/downVote',
  async (commentId: string, { rejectWithValue }) => {
    const uid = auth.currentUser?.uid;
    return db
      .doc(`comments/${commentId}/downVoteIds/${uid}`)
      .set({ commentId, uid })
      .then(() => commentId)
      .catch((err) => rejectWithValue(commentId));
  }
);

export const removeDownVote = createAsyncThunk(
  'commentRatingStatus/removeDownVote',
  async (commentId: string, { rejectWithValue }) => {
    const uid = auth.currentUser?.uid;
    return db
      .doc(`comments/${commentId}/downVoteIds/${uid}`)
      .delete()
      .then(() => commentId)
      .catch((err) => rejectWithValue(commentId));
  }
);

export const commentRatingStatusSlice = createSlice({
  name: 'commentRatingStatus',
  initialState,
  reducers: {
    clearVoteCommentIds: (state) => {
      state.loadingUpVoteCommentIds = [];
      state.loadingDownVoteCommentIds = [];
      state.upVoteCommentIds = [];
      state.downVoteCommentIds = [];
      state.loading = false;
      state.error = '';
    },
    setIsFirstFetch: (state, action: { payload: boolean }) => {
      state.isFirstFetch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVoteCommentIds.pending, (state) => {
        state.upVoteCommentIds = [];
        state.downVoteCommentIds = [];
        state.loading = true;
        state.error = '';
      })
      .addCase(getVoteCommentIds.fulfilled, (state, action) => {
        state.upVoteCommentIds = action.payload?.upVoteItemIds;
        state.downVoteCommentIds = action.payload?.downVoteItemIds;
        state.loading = false;
      })
      .addCase(getVoteCommentIds.rejected, (state, action) => {
        state.loading = false;
        state.error = 'An error occurred';
      })
      .addCase(upVote.pending, (state, action) => {
        state.loadingUpVoteCommentIds.push(action.meta.arg);
        state.error = '';
      })
      .addCase(upVote.fulfilled, (state, action) => {
        state.upVoteCommentIds.push(action.payload);
        state.loadingUpVoteCommentIds = state.loadingUpVoteCommentIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(upVote.rejected, (state, action) => {
        state.error = 'An error occurred';
        state.loadingUpVoteCommentIds = state.loadingUpVoteCommentIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(removeUpVote.pending, (state, action) => {
        state.loadingUpVoteCommentIds.push(action.meta.arg);
        state.error = '';
      })
      .addCase(removeUpVote.fulfilled, (state, action) => {
        state.upVoteCommentIds = state.upVoteCommentIds.filter(
          (id) => id !== action.payload
        );
        state.loadingUpVoteCommentIds = state.loadingUpVoteCommentIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(removeUpVote.rejected, (state, action) => {
        state.error = 'An error occurred';
        state.loadingUpVoteCommentIds = state.loadingUpVoteCommentIds.filter(
          (id) => id !== action.payload
        );
      })
      .addCase(downVote.pending, (state, action) => {
        state.loadingDownVoteCommentIds.push(action.meta.arg);
        state.error = '';
      })
      .addCase(downVote.fulfilled, (state, action) => {
        state.downVoteCommentIds.push(action.payload);
        state.loadingDownVoteCommentIds =
          state.loadingDownVoteCommentIds.filter((id) => id !== action.payload);
      })
      .addCase(downVote.rejected, (state, action) => {
        state.error = 'An error occurred';
        state.loadingDownVoteCommentIds =
          state.loadingDownVoteCommentIds.filter((id) => id !== action.payload);
      })
      .addCase(removeDownVote.pending, (state, action) => {
        state.loadingDownVoteCommentIds.push(action.meta.arg);
        state.error = '';
      })
      .addCase(removeDownVote.fulfilled, (state, action) => {
        state.downVoteCommentIds = state.downVoteCommentIds.filter(
          (id) => id !== action.payload
        );
        state.loadingDownVoteCommentIds =
          state.loadingDownVoteCommentIds.filter((id) => id !== action.payload);
      })
      .addCase(removeDownVote.rejected, (state, action) => {
        state.error = 'An error occurred';
        state.loadingDownVoteCommentIds =
          state.loadingDownVoteCommentIds.filter((id) => id !== action.payload);
      });
  },
});

export const { clearVoteCommentIds, setIsFirstFetch } =
  commentRatingStatusSlice.actions;

export default commentRatingStatusSlice.reducer;
