import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';

const storeTokens = (refreshToken: string, accessToken: string) => {
  localStorage.setItem('refreshToken', String(refreshToken));

  setCookie('accessToken', String(accessToken));
};

const clearTokens = () => {
  localStorage.removeItem('refreshToken');

  deleteCookie('accessToken');
};

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginError?: SerializedError;
  registerError?: SerializedError;
  userError?: SerializedError;
  isLoading: boolean;
  data: TUser;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  isLoading: false,
  data: {
    name: '',
    email: ''
  }
};

// Thunks
export const register = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data, { rejectWithValue }) => {
    const response = await registerUserApi(data);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    const { user, refreshToken, accessToken } = response;
    storeTokens(refreshToken, accessToken);
    return user;
  }
);

export const login = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data, { rejectWithValue }) => {
    const response = await loginUserApi(data);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    const { user, refreshToken, accessToken } = response;
    storeTokens(refreshToken, accessToken);
    return user;
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();
    if (!response?.success) {
      return rejectWithValue(response);
    }
    clearTokens();
  }
);

export const fetchUser = createAsyncThunk<TUser>(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    const response = await getUserApi();
    if (!response?.success) {
      return rejectWithValue(response);
    }
    return response.user;
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data, { rejectWithValue }) => {
    const response = await updateUserApi(data);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    return response.user;
  }
);

// Slice
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.registerError = undefined;
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registerError = undefined;
        state.isAuthenticated = true;
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.registerError = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
        state.isLoading = false;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loginError = undefined;
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginError = undefined;
        state.isAuthenticated = true;
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginError = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
        state.isLoading = false;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.data = { email: '', name: '' };
        state.isLoading = false;
      })
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.userError = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
        state.isLoading = false;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userError = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
        state.isLoading = false;
      });
  }
});

export const { setAuthChecked } = slice.actions;
export default slice.reducer;
