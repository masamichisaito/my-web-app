const session = require('supertest-session');
const app = require('../app');

describe('RPG バトル機能のテスト', () => {
  let testSession = null;

  beforeEach(() => {
    testSession = session(app);
  });

  test('バトルに勝利した場合、勝利画面が表示されること', async () => {
    await testSession.post('/rpg/test/setup').send({
      heroHP: 30,          // 勇者HPは高く（余裕あり）
      monsterHP: 1,        // 敵HPをたった1にする（確実に倒す）
    });
  
    await testSession.get('/rpg/battle');
  
    const res = await testSession.post('/rpg/attack');
  
    expect(res.headers.location).toBe('/rpg/result');
  
    const resultRes = await testSession.get('/rpg/result');
    expect(resultRes.text).toContain('テスト勇者');
  });
  
  test('バトルに敗北した場合、敗北画面が表示されること', async () => {
    await testSession.post('/rpg/test/setup').send({
      heroHP: 1,           // 勇者HPはたった1（即死狙い）
      monsterHP: 50,       // 敵HPたっぷり（敵は死なない）
    });
  
    await testSession.get('/rpg/battle');
  
    const res = await testSession.post('/rpg/attack');
  
    expect(res.headers.location).toBe('/rpg/dead');
  
    const deadRes = await testSession.get('/rpg/dead');
    expect(deadRes.text).toContain('テスト勇者');
  });
});
