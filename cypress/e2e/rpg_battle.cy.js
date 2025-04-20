describe('RPGバトル機能のE2Eテスト', () => {
  beforeEach(() => {
    // トップページからスタート
    cy.visit('/');
    cy.contains('RPGを遊ぶ').click(); // ボタンで /rpg/start へ遷移
  });

  it('バトルに勝利した場合、勝利画面が表示されること', () => {
    // テスト用に敵HPを3にセット
    cy.request('POST', '/rpg/test/setup', {
      heroHP: 30,
      monsterHP: 3
    });

    cy.get('input[name="heroName"]').type('テスト勇者');
    cy.get('form').submit(); // /rpg/start → /rpg/battle

    cy.contains('攻撃').click(); // /rpg/attack POST → /rpg/result

    cy.url().should('include', '/rpg/result');
    cy.contains('テスト勇者');
    cy.contains('を倒した！');
  });

  it('バトルに敗北した場合、敗北画面が表示されること', () => {
    // 勇者のHPを3にして負け確定にする
    cy.request('POST', '/rpg/test/setup', {
      heroHP: 3,
      monsterHP: 30
    });

    cy.get('input[name="heroName"]').type('テスト勇者');
    cy.get('form').submit(); // /rpg/start → /rpg/battle

    cy.contains('攻撃').click(); // /rpg/attack POST → /rpg/dead

    cy.url().should('include', '/rpg/dead');
    cy.contains('テスト勇者');
    cy.contains('倒れてしまった');
  });
});
