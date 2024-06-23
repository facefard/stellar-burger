import { fetchFeeds, initialState } from '../src/services/slices/feedSlice';
import reducer from '../src/services/slices/feedSlice';

const feedsMockData = {
  orders: [],
  total: 1,
  totalToday: 1,
};

describe('Тестирование feedSlice', () => {
  let state: typeof initialState;

  beforeEach(() => {
    state = { ...initialState };
  });

  describe('fetchFeeds', () => {
    test('Начало запроса: fetchFeeds.pending', () => {
      const loadingState = reducer(initialState, fetchFeeds.pending('pending'));

      expect(loadingState.isLoading).toBeTruthy();
      expect(loadingState.error).toBeNull();
    });

    test('Успешный результат запроса: fetchFeeds.fulfilled', () => {
      const fulfilledState = reducer(initialState, fetchFeeds.fulfilled(feedsMockData, 'fulfilled'));

      expect(fulfilledState.isLoading).toBeFalsy();
      expect(fulfilledState.error).toBeNull();
      expect(fulfilledState.data).toEqual(feedsMockData);
    });

    test('Ошибка запроса: fetchFeeds.rejected', () => {
      const error = 'fetchFeeds.rejected';
      const rejectedState = reducer(initialState, fetchFeeds.rejected(new Error(error), 'rejected'));

      expect(rejectedState.isLoading).toBeFalsy();
      expect(rejectedState.error?.message).toEqual(error);
    });
  });
});
