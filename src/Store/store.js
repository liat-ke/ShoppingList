import { configureStore } from '@reduxjs/toolkit';
import countReducer from './countSlice';
import categoryReducer from './categorySlice';
import selectedCategoryReducer from './selectedCategorySlice';
import selectedProductReducer from './selectedProductSlice';
import shoppingCartItemsReducer from './shoppingCartItemsSlice';

const store = configureStore({
  reducer: {
    count: countReducer,
    category: categoryReducer,
    selectedCategory: selectedCategoryReducer,
    selectedProduct: selectedProductReducer,
    shoppingCartItems: shoppingCartItemsReducer,
  },
});

export default store;