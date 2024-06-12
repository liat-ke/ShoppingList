import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedProduct: "",
};

const selectedProductSlice = createSlice({
  name: 'selectedProduct',
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },
});

export const { setSelectedProduct } = selectedProductSlice.actions;
export default selectedProductSlice.reducer;