import {
  fetchOrder,
  fetchOrders,
  createOrder,
  resetOrderModalData,
  initialState
} from '../src/services/slices/orderSlice';

import reducer from '../src/services/slices/orderSlice';

const ordersMockData = [
  {
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093d'
    ],
    _id: '6622337897ede0001d0666b5',
    status: 'done',
    name: 'EXAMPLE_NAME',
    createdAt: '2024-04-19T09:03:52.748Z',
    updatedAt: '2024-04-19T09:03:58.057Z',
    number: 23144
  }
];

describe('Тестирование orderSlice', () => {
  let state: typeof initialState;

  beforeEach(() => {
    state = { ...initialState };
  });

  test('Сброс содержимого модального окна заказа: resetOrderModalData', () => {
    const currentState = {
      ...initialState,
      isOrderLoading: true,
      isOrdersLoading: true,
      orderRequest: false,
      orderModalData: ordersMockData[0],
      error: null,
      data: []
    };

    const newState = reducer(currentState, resetOrderModalData());

    expect(newState.orderModalData).toBeNull();
    expect(newState.data).toHaveLength(0);
    expect(newState.error).toBeNull();
    expect(newState.orderRequest).toBeFalsy();
  });

  describe('Асинхронная функция для получения заказов: fetchOrders', () => {
    test('Начало запроса: fetchOrders.pending', () => {
      const loadingState = reducer(initialState, fetchOrders.pending('pending'));

      expect(loadingState.isLoading).toBeTruthy();
      expect(loadingState.error).toBeNull();
    });

    test('Успешный результат запроса: fetchOrders.fulfilled', () => {
      const fulfilledState = reducer(initialState, fetchOrders.fulfilled(ordersMockData, 'fulfilled'));

      expect(fulfilledState.isLoading).toBeFalsy();
      expect(fulfilledState.error).toBeNull();
      expect(fulfilledState.data).toEqual(ordersMockData);
    });

    test('Ошибка запроса: fetchOrders.rejected', () => {
      const error = 'fetchOrders.rejected';
      const rejectedState = reducer(initialState, fetchOrders.rejected(new Error(error), 'rejected'));

      expect(rejectedState.isLoading).toBeFalsy();
      expect(rejectedState.error?.message).toEqual(error);
    });
  });

  describe('Асинхронная функция для получения заказа по номеру: fetchOrder', () => {
    test('Начало запроса: fetchOrder.pending', () => {
      const loadingState = reducer(initialState, fetchOrder.pending('pending', ordersMockData[0].number));

      expect(loadingState.isLoading).toBeTruthy();
    });

    test('Успешный результат запроса: fetchOrder.fulfilled', () => {
      const fulfilledState = reducer(initialState, fetchOrder.fulfilled(ordersMockData[0], 'fulfilled', ordersMockData[0].number));

      expect(fulfilledState.isLoading).toBeFalsy();
      expect(fulfilledState.orderModalData).toEqual(ordersMockData[0]);
    });

    test('Ошибка запроса: fetchOrder.rejected', () => {
      const error = 'fetchOrder.rejected';
      const rejectedState = reducer(initialState, fetchOrder.rejected(new Error(error), 'rejected', -1));

      expect(rejectedState.isLoading).toBeFalsy();
    });
  });

  describe('Асинхронная функция для создания заказа: createOrder', () => {
    test('Начало запроса: createOrder.pending', () => {
      const loadingState = reducer(initialState, createOrder.pending('pending', ordersMockData[0].ingredients));

      expect(loadingState.orderRequest).toBeTruthy();
    });

    test('Успешный результат запроса: createOrder.fulfilled', () => {
      const fulfilledState = reducer(
        initialState,
        createOrder.fulfilled(
          { order: ordersMockData[0], name: 'EXAMPLE' },
          'fulfilled',
          ordersMockData[0].ingredients
        )
      );

      expect(fulfilledState.orderRequest).toBeFalsy();
      expect(fulfilledState.orderModalData).toEqual(ordersMockData[0]);
    });

    test('Ошибка запроса: createOrder.rejected', () => {
      const error = 'createOrder.rejected';
      const rejectedState = reducer(initialState, createOrder.rejected(new Error(error), 'rejected', []));

      expect(rejectedState.orderRequest).toBeFalsy();
    });
  });
});