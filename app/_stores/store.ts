import { configureStore } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import mainReducer from "./mainSlice";
import cryptoReducers from "./crypto"
import memberReducers from "./member"

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    main: mainReducer,
    ...cryptoReducers,
    ...memberReducers
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
