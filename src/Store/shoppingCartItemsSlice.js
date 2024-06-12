import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shoppingCartItems: [],
};

const shoppingCartItemsSlice = createSlice({
  name: 'shoppingCartItems',
  initialState,
  reducers: {
    setShoppingCartItems: (state, action) => {
      state.shoppingCartItems = action.payload;
    },
  },
});

export const { setShoppingCartItems } = shoppingCartItemsSlice.actions;
export default shoppingCartItemsSlice.reducer;