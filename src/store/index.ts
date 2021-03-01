import { createStore, compose, applyMiddleware } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import rootReducer, { AppState } from './rootReducer';
import { AppActions } from './appActions';
import { verifyAuth } from './auth/actions';

const composeEnhancers =
  (process.env.NODE_ENV !== 'production' &&
    typeof window !== 'undefined' &&
    //@ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore<AppState, AppActions, {}, {}>(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunk as ThunkMiddleware<AppState, AppActions>
    )
  )
);

//@ts-ignore
store.dispatch(verifyAuth());

export default store;
