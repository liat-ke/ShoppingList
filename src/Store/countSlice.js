import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  countItems: 0,
};

const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    setCountItems: (state, action) => {
      state.countItems = action.payload;
    },
  },
});

export const { setCountItems } = countSlice.actions;
export default countSlice.reducer;