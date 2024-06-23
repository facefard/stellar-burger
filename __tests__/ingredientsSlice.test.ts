import { fetchIngredients, initialState } from '../src/services/slices/IngredientsSlice';
import reducer from '../src/services/slices/IngredientsSlice';

const ingredientsMockData = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 123,
    fat: 3241,
    carbohydrates: 4132,
    calories: 4321,
    price: 2341,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  }
];

describe('Тестирование IngredientsSlice', () => {
  let state: typeof initialState;

  beforeEach(() => {
    state = { ...initialState };
  });

  describe('fetchIngredients', () => {
    test('Начало запроса: fetchIngredients.pending', () => {
      const loadingState = reducer(initialState, fetchIngredients.pending('pending'));

      expect(loadingState.isLoading).toBeTruthy();
      expect(loadingState.error).toBeNull();
    });

    test('Успешный результат запроса: fetchIngredients.fulfilled', () => {
      const fulfilledState = reducer(initialState, fetchIngredients.fulfilled(ingredientsMockData, 'fulfilled'));

      expect(fulfilledState.isLoading).toBeFalsy();
      expect(fulfilledState.error).toBeNull();
      expect(fulfilledState.data).toEqual(ingredientsMockData);
    });

    test('Ошибка запроса: fetchIngredients.rejected', () => {
      const error = 'fetchIngredients.rejected';
      const rejectedState = reducer(initialState, fetchIngredients.rejected(new Error(error), 'rejected'));

      expect(rejectedState.isLoading).toBeFalsy();
      expect(rejectedState.error?.message).toEqual(error);
    });
  });
});
