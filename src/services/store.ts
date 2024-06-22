import { configureStore, combineReducers } from '@reduxjs/toolkit';
import IngredientsSlice from './slices/IngredientsSlice';
import ingredientsList from './slices/constructorSlice';
import feedSlice from './slices/feedSlice';
import orderSlice from './slices/orderSlice';
import authSlice from './slices/authSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  ingredients: IngredientsSlice, // Adjust import based on your folder structure
  burgerConstructor: ingredientsList,
  feed: feedSlice,
  order: orderSlice,
  auth: authSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
