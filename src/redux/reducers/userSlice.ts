import { createSlice } from "@reduxjs/toolkit";

export interface User {
  userId: string;
  name: string;
  imageUrl?: string;
}

type UserActionType = { type: string; payload: User | null };

export const userSlice = createSlice({
  name: "user",
  initialState: { value: null as User | null },
  reducers: {
    setUser: (state, action: UserActionType) => {
      if (action.payload === null) {
        state = { value: null };
      } else {
        state = { value: action.payload };
      }
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
