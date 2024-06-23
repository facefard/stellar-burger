import * as orderFixture from '../fixtures/order.json';

const testUrl = 'http://localhost:4000/';
const ingredientsSelector = '[ingredient-type="bun"], [ingredient-type="main"], [ingredient-type="sauce"]';
const bunSelector = '[ingredient-type="bun"]:first-of-type';
const mainSelector = '[ingredient-type="main"]:first-of-type';
const modalsSelector = '#modals';
const closeModalButtonSelector = '#modals button:first-of-type';
const overlaySelector = '#modals > div:nth-of-type(2)';
const orderButtonSelector = '[data-order-button]';

describe('E2E тест конструктора бургеров', () => {
  before(() => {
    // Загрузка фикстур для повторного использования
    cy.fixture('ingredients.json').as('ingredientsData');
    cy.fixture('order.json').as('orderData');
    cy.fixture('user.json').as('userData');
  });

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit(testUrl);
    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
    cy.log('Данные загружены, выполняем проверку элементов на странице');
  });

  it('Список ингредиентов доступен для выбора', () => {
    cy.get('[ingredient-type="bun"]').should('have.length.at.least', 1);
    cy.get(ingredientsSelector).should('have.length.at.least', 1);
  });

  describe('Проверка работы модальных окон описаний ингредиентов', () => {
    describe('Проверка открытия модальных окон', () => {
      it('Базовое открытие по карточке ингредиента', () => {
        cy.get(bunSelector).click();
        cy.get(modalsSelector).children().should('have.length', 2);
      });

      it('Модальное окно с ингредиентом будет открыто после перезагрузки страницы', () => {
        cy.get(bunSelector).click();
        cy.reload(true);
        cy.get(modalsSelector).children().should('have.length', 2);
      });
    });

    describe('Проверка закрытия модальных окон', () => {
      it('Через нажатие на крестик', () => {
        cy.get(bunSelector).click();
        cy.get(closeModalButtonSelector).click();
        cy.wait(500);
        cy.get(modalsSelector).children().should('have.length', 0);
      });

      it('Через нажатие на оверлей', () => {
        cy.get(bunSelector).click();
        cy.get(overlaySelector).click({ force: true });
        cy.wait(500);
        cy.get(modalsSelector).children().should('have.length', 0);
      });

      it('Через нажатие на Escape', () => {
        cy.get(bunSelector).click();
        cy.get('body').type('{esc}');
        cy.wait(500);
        cy.get(modalsSelector).children().should('have.length', 0);
      });
    });
  });

  describe('Процесс оформления заказа', () => {
    beforeEach(() => {
      // Перед выполнением теста создания заказа в localStorage и cookie подставляются фейковые токены авторизации
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      // Перехват запросов на проверку авторизации, оформление заказа и получения ингредиентов
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('postOrder');
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredientsAfterLogin');

      cy.visit(testUrl);
      cy.wait('@getIngredientsAfterLogin').its('response.statusCode').should('eq', 200);
    });

    it('Базовая процедура оформления ПОСЛЕ авторизации', () => {
      cy.get(orderButtonSelector).should('be.disabled');

      cy.get(`${bunSelector} button`).click();
      cy.get(`${mainSelector} button`).click();
      cy.get(orderButtonSelector).should('be.enabled');

      cy.get(orderButtonSelector).click();
      cy.wait('@postOrder').its('response.statusCode').should('eq', 200);

      cy.get(modalsSelector).children().should('have.length', 2);
      cy.get(`${modalsSelector} h2:first-of-type`).should('have.text', orderFixture.order.number);
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});