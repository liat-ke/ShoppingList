import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedCategory: 0,
};

const selectedCategorySlice = createSlice({
  name: 'selectedCategory',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setSelectedCategory } = selectedCategorySlice.actions;
export default selectedCategorySlice.reducer;