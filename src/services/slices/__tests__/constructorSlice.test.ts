import {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  initialState,
} from '../constructorSlice';

import reducer from '../constructorSlice';

const bunMockData = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 2134,
  fat: 2134,
  carbohydrates: 124,
  calories: 421,
  price: 1234,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const ingredient1MockData = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '1234567890',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 214,
  fat: 4213,
  carbohydrates: 1243,
  calories: 214,
  price: 2143,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

const ingredient2MockData = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '0987654321',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 42134,
  fat: 2134,
  carbohydrates: 4321,
  calories: 214,
  price: 2134,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

describe('builderReducer', () => {
  let state: typeof initialState;

  beforeEach(() => {
    state = { ...initialState };
  });

  describe('Working with buns', () => {
    test('Set bun using setBun', () => {
      state = reducer(initialState, setBun(bunMockData));
      expect(state.bun).toEqual(bunMockData);
      expect(state.ingredients).toHaveLength(0);
    });

    test('Set bun using addIngredient', () => {
      state = reducer(initialState, addIngredient(bunMockData));
      const updatedObject = { ...state.bun } as Record<string, any>;
      delete updatedObject['id'];
      expect(updatedObject).toEqual(bunMockData);
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('Working with ingredients', () => {
    test('Add ingredient', () => {
      state = reducer(initialState, addIngredient(ingredient1MockData));
      expect(state.ingredients).toHaveLength(1);
      const updatedObject = { ...state.ingredients[0] } as Record<string, any>;
      delete updatedObject['id'];
      const initialObject = { ...ingredient1MockData } as Record<string, any>;
      delete initialObject['id'];
      expect(updatedObject).toEqual(initialObject);
      expect(state.bun).toBeNull();
    });

    test('Remove ingredient', () => {
      const _initialState = {
        bun: null,
        ingredients: [ingredient1MockData, ingredient2MockData],
      };
      state = reducer(_initialState, removeIngredient(ingredient1MockData.id));
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients).toEqual([ingredient2MockData]);
      expect(state.bun).toBeNull();
    });

    describe('Move ingredients', () => {
      test('Move down', () => {
        const _initialState = {
          bun: null,
          ingredients: [ingredient1MockData, ingredient2MockData],
        };
        state = reducer(_initialState, moveIngredient({ index: 0, upwards: false }));
        expect(state.ingredients).toHaveLength(2);
        expect(state.ingredients).toEqual([ingredient2MockData, ingredient1MockData]);
        expect(state.bun).toBeNull();
      });

      test('Move up', () => {
        const _initialState = {
          bun: null,
          ingredients: [ingredient1MockData, ingredient2MockData],
        };
        state = reducer(_initialState, moveIngredient({ index: 1, upwards: true }));
        expect(state.ingredients).toHaveLength(2);
        expect(state.ingredients).toEqual([ingredient2MockData, ingredient1MockData]);
        expect(state.bun).toBeNull();
      });
    });
  });

  test('Reset constructor', () => {
    const _initialState = {
      bun: bunMockData,
      ingredients: [ingredient1MockData, ingredient2MockData],
    };
    state = reducer(_initialState, resetConstructor());
    expect(state.ingredients).toHaveLength(0);
    expect(state.bun).toBeNull();
  });
});
