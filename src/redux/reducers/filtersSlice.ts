import { createSlice } from "@reduxjs/toolkit";
import { SortType } from "../../common/sortingStates";

export interface Filters {
  sortBoards: SortType;
  sortComments: SortType;
}

export const DEFAULT_FILTERS: Filters = {
  sortBoards: SortType.BEST,
  sortComments: SortType.BEST,
};

type FilterActionType = { type: string; payload: SortType };

export const filterSlice = createSlice({
  name: "filters",
  initialState: {
    value: DEFAULT_FILTERS,
  },
  reducers: {
    setSortBoards: (state, action) => {
      state = {
        value: { ...state.value, sortBoards: action.payload },
      };
    },
    setSortComments: (state, action) => {
      state = { value: { ...state.value, sortComments: action.payload } };
    },
  },
});

export const { setSortBoards, setSortComments } = filterSlice.actions;
export default filterSlice.reducer;
