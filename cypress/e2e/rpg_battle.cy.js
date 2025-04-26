describe('RPGバトル機能のE2Eテスト', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('RPGを遊ぶ').should('exist').click();
    cy.url().should('include', '/rpg/start');
  });

  it('バトルに勝利した場合、勝利画面が表示されること', () => {
    // まず名前入力して送信
    cy.get('input[name="heroName"]').should('exist').type('テスト勇者');
    cy.get('form').submit();

    // 名前登録後にセットアップAPI叩く
    cy.request('POST', '/rpg/test/force-battle', { heroHP: 30, monsterHP: 3 });

    // バトル画面に移動
    cy.visit('/rpg/battle');

    cy.contains('攻撃').should('exist').click();
    cy.url().should('include', '/rpg/result');
    cy.contains('テスト勇者');
    cy.contains('を倒した！');
  });

  it('バトルに敗北した場合、敗北画面が表示されること', () => {
    cy.get('input[name="heroName"]').should('exist').type('テスト勇者');
    cy.get('form').submit();

    cy.request('POST', '/rpg/test/force-battle', { heroHP: 3, monsterHP: 30 });

    cy.visit('/rpg/battle');

    cy.contains('攻撃').should('exist').click();
    cy.url().should('include', '/rpg/dead');
    cy.contains('テスト勇者');
    cy.contains('倒れてしまった');
  });
});
