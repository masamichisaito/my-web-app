// cypress/e2e/sample.cy.js

describe('ユーザー登録フォームのテスト', () => {
  it('正しい情報で登録できること', () => {
    cy.visit('http://localhost:3000');
    cy.contains('名前と年齢を入力する').click(); 
    cy.get('input[name="name"]').type('太郎');
    cy.get('input[name="age"]').type('25');
    cy.get('form').submit();
    cy.url().should('include', '/users');
  });
});

