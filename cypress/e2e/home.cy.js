// cypress/e2e/sample.cy.js

describe('ユーザー登録フォームのテスト', () => {
  it('正しい情報で登録できること', () => {
    cy.visit('/');
    cy.contains('名前と年齢を入力する').click(); 
    cy.get('input[name="name"]').type('太郎');
    cy.get('input[name="age"]').type('25');
    cy.get('form').submit();
    cy.url().should('include', '/users');
  });
});

describe('ユーザー削除のテスト', () => {
  it('登録したユーザーを削除できること', () => {
    cy.visit('/');
    cy.contains('名前と年齢を入力する').click();
    cy.get('input[name="name"]').type('削除テスト');
    cy.get('input[name="age"]').type('30');
    cy.get('form').submit();

    cy.url().should('include', '/users');
    cy.contains('削除テスト').should('exist');

    cy.contains('削除テスト').parent().find('a:contains("削除")').click();
    cy.on('window:confirm', () => true); // confirmをOKする

    cy.url().should('include', '/users');

    // ここが超大事！！！リスト全体の再ロードを待つ
    cy.get('ul').should('exist'); // リスト存在確認
    cy.wait(500); // レンダリング待ち
    cy.contains('削除テスト').should('not.exist'); // ここで再確認！
  });
});


describe('ユーザー編集のテスト', () => {
  it('登録したユーザーを編集できること', () => {
    cy.visit('/');
    cy.contains('名前と年齢を入力する').click();
    cy.get('input[name="name"]').type('編集前');
    cy.get('input[name="age"]').type('22');
    cy.get('form').submit();

    cy.url().should('include', '/users');
    cy.contains('編集前').should('exist');

    cy.contains('編集前').parent().find('a:contains("編集")').click();

    cy.get('form').should('exist');
    cy.get('input[name="name"]').clear().type('編集後').should('have.value', '編集後');
    cy.get('input[name="age"]').clear().type('23').should('have.value', '23');

    cy.get('form').submit();

    // ★ URLリダイレクトだけまず確認
    cy.url().should('include', '/users');

    // ★ さらにリストじゃなく、直接「編集後」が出現するか待つ
    cy.contains('編集後', { timeout: 5000 }).should('exist');
    cy.contains('23歳').should('exist');
  });
});


