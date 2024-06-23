import store, { rootReducer } from '../src/services/store';

describe('Тестирование rootReducer', () => {
  test('Обработка неизвестного экшена должна вернуть предыдущее состояние хранилища', () => {
    // Получаем текущее состояние хранилища до вызова rootReducer
    const currentState = store.getState();

    // Вызываем rootReducer с неизвестным экшеном
    const nextState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что состояние хранилища после не изменилось
    expect(nextState).toEqual(currentState);
  });
});
