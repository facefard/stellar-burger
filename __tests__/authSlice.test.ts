import {
  fetchUser,
  updateUser,
  register,
  login,
  logout,
  initialState,
} from '../src/services/slices/authSlice';

import reducer from '../src/services/slices/authSlice';

const userMockData = {
  email: 'example@example.mail',
  name: 'Example',
};

const registerMockData = {
  email: 'example@example.mail',
  name: 'Example',
  password: 'Example',
};

const loginMockData = {
  email: 'example@example.mail',
  password: 'Example',
};

describe('userReducer', () => {
  let state: typeof initialState;

  beforeEach(() => {
    state = { ...initialState };
  });

  describe('register', () => {
    test('pending', () => {
      state = reducer(state, register.pending('pending', registerMockData));
      expect(state.registerError).toBeUndefined();
      expect(state.isLoading).toBeTruthy();
    });

    test('fulfilled', () => {
      state = reducer(state, register.fulfilled(userMockData, 'fulfilled', registerMockData));
      expect(state.isAuthenticated).toBeTruthy();
      expect(state.registerError).toBeUndefined();
      expect(state.data).toEqual(userMockData);
      expect(state.isLoading).toBeFalsy();
    });

    test('rejected', () => {
      const error = 'register.rejected';
      state = reducer(state, register.rejected(new Error(error), 'rejected', registerMockData));
      expect(state.registerError?.message).toEqual(error);
      expect(state.isAuthenticated).toBeFalsy();
      expect(state.isLoading).toBeFalsy();
    });
  });

  describe('login', () => {
    test('pending', () => {
      state = reducer(state, login.pending('pending', loginMockData));
      expect(state.loginError).toBeUndefined();
      expect(state.isLoading).toBeTruthy();
    });

    test('fulfilled', () => {
      state = reducer(state, login.fulfilled(userMockData, 'fulfilled', loginMockData));
      expect(state.isAuthenticated).toBeTruthy();
      expect(state.loginError).toBeUndefined();
      expect(state.data).toEqual(userMockData);
      expect(state.isLoading).toBeFalsy();
    });

    test('rejected', () => {
      const error = 'login.rejected';
      state = reducer(state, login.rejected(new Error(error), 'rejected', loginMockData));
      expect(state.loginError?.message).toEqual(error);
      expect(state.isAuthenticated).toBeFalsy();
      expect(state.isLoading).toBeFalsy();
    });
  });

  describe('logout', () => {
    test('fulfilled', () => {
      state = reducer(state, logout.fulfilled(undefined, 'fulfilled'));
      expect(state.isAuthenticated).toBeFalsy();
      expect(state.data).toEqual({ email: '', name: '' });
      expect(state.isLoading).toBeFalsy();
    });
  });

  describe('fetchUser', () => {
    test('fulfilled', () => {
      state = reducer(state, fetchUser.fulfilled(userMockData, 'fulfilled'));
      expect(state.isAuthenticated).toBeTruthy();
      expect(state.isAuthChecked).toBeTruthy();
      expect(state.data).toEqual(userMockData);
      expect(state.isLoading).toBeFalsy();
    });

    test('rejected', () => {
      const error = 'fetchUser.rejected';
      state = reducer(state, fetchUser.rejected(new Error(error), 'rejected'));
      expect(state.isAuthenticated).toBeFalsy();
      expect(state.isAuthChecked).toBeTruthy();
      expect(state.isLoading).toBeFalsy();
    });
  });

  describe('updateUser', () => {
    test('fulfilled', () => {
      state = reducer(state, updateUser.fulfilled(userMockData, 'fulfilled', userMockData));
      expect(state.data).toEqual(userMockData);
      expect(state.isLoading).toBeFalsy();
    });
  });
});