const session = require('supertest-session');
const app = require('../app');

describe('RPG バトル機能のテスト', () => {
  let testSession = null;

  beforeEach(() => {
    testSession = session(app);
  });

  test('バトルに勝利した場合、勝利画面が表示されること', async () => {
    await testSession.post('/rpg/test/setup').send({ heroHP: 30, monsterHP: 3 });

    await testSession.post('/rpg/start').send({ heroName: 'テスト勇者' });
    await testSession.get('/rpg/battle'); // ← enemy生成のため必須！！
  
    const res = await testSession.post('/rpg/attack');
  
    expect(res.headers.location).toBe('/rpg/result');
  
    const resultRes = await testSession.get('/rpg/result');
    expect(resultRes.text).toContain('テスト勇者');
    expect(resultRes.text).toContain('を倒した！');
  });

  test('バトルに敗北した場合、敗北画面が表示されること', async () => {
    await testSession.post('/rpg/test/setup').send({ heroHP: 3, monsterHP: 30 });
    await testSession.post('/rpg/start').send({ heroName: 'テスト勇者' });
    await testSession.get('/rpg/battle');

    const res = await testSession.post('/rpg/attack');

    expect(res.headers.location).toBe('/rpg/dead');

    const deadRes = await testSession.get('/rpg/dead');
    expect(deadRes.text).toContain('テスト勇者');
    expect(deadRes.text).toMatch(/倒れてしまった/); // ← ここが修正点！
  });
});
