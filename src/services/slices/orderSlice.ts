import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import {
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrdersState = {
  isLoading: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: null | SerializedError;
  data: TOrder[];
};

export const initialState: TOrdersState = {
  isLoading: false,
  orderRequest: false,
  orderModalData: null,
  error: null,
  data: []
};

export const createOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[]
>('orders/create', async (data, { rejectWithValue }) => {
  const response = await orderBurgerApi(data);
  if (!response?.success) {
    return rejectWithValue(response);
  }
  return { order: response.order, name: response.name };
});

export const fetchOrder = createAsyncThunk<TOrder, number>(
  'orders/fetchOrder',
  async (data, { rejectWithValue }) => {
    const response = await getOrderByNumberApi(data);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    return response.orders[0];
  }
);

export const fetchOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchOrders',
  async () => await getOrdersApi()
);

const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderModalData(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error;
      });
  }
});

export const { resetOrderModalData } = slice.actions;

export default slice.reducer;
