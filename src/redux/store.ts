import { configureStore } from "@reduxjs/toolkit";
import { default as filtersReducer } from "./reducers/filtersSlice";
import { default as userReducer } from "./reducers/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
