const request = require('supertest');
const app = require('../app'); // Express アプリケーションのインスタンス

describe('GET /rpg/start', () => {
  it('should return 200 OK and render the start page', async () => {
    const res = await request(app).get('/rpg/start');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('RPG開始'); // start.ejs に含まれるテキストを確認
  });
});

describe('POST /rpg/start', () => {
  it('should redirect to /rpg/battle when valid name is provided', async () => {
    const res = await request(app)
      .post('/rpg/start')
      .send({ heroName: '勇者' });
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/rpg/battle');
  });

  it('should return 200 and show error when name is missing', async () => {
    const res = await request(app)
      .post('/rpg/start')
      .send({ heroName: '' });
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('名前は必須です');
  });
});
