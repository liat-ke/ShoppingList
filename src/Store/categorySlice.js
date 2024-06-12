import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categoryItems: [],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategoryItems: (state, action) => {
      state.categoryItems = action.payload;
    },
  },
});

export const { setCategoryItems } = categorySlice.actions;
export default categorySlice.reducer;