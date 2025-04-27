const request = require('supertest');
const app = require('../app'); // Express アプリケーションのインスタンス

describe('GET /', () => {
  it('should return 200 OK and render the index page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('ようこそ！');
  });
});

describe('POST /users', () => {
  it('should redirect to /users when valid data is sent', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Hanako', age: 25 });
    expect(res.statusCode).toBe(302); // リダイレクトのステータスコード
    expect(res.headers.location).toBe('/users'); // リダイレクト先の確認
  });

  it('should return 400 if name is missing', async () => {
    const res = await request(app)
      .post('/users')
      .send({ age: 20 });
    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('名前は必須です'); // エラーメッセージの確認
  });

  it('should return 400 if age is not a number', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Jiro', age: 'twenty' });
    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('年齢は数字で入力してください'); // エラーメッセージの確認
  });

  const request = require('supertest');
const app = require('../app');

describe('POST /users バリデーションテスト', () => {
  test('名前が空の場合、400エラーを返す', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: '', age: 25 });
    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('名前は必須です');
  });

  test('年齢が負の数の場合、400エラーを返す', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: '太郎', age: -1 });
    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('年齢は正の整数で入力してください');
  });

  test('年齢が非数値文字列の場合、400エラーを返す', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: '太郎', age: '二十' });
    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('年齢は数字で入力してください');
  });
  
  test('名前に特殊文字を含む場合、400エラーを返す', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: '<script>', age: 25 });
    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('名前に無効な文字が含まれています');
  });

  test('年齢が小数の場合、400エラーを返す', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: '太郎', age: 25.5 });
    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('年齢は正の整数で入力してください');
  });

  test('年齢が非常に大きな数の場合、400エラーを返す', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: '太郎', age: 1000 });
    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('年齢は適切な範囲で入力してください');
  });

  test('名前が非常に長い文字列の場合、400エラーを返す', async () => {
    const longName = 'あ'.repeat(256);
    const res = await request(app)
      .post('/users')
      .send({ name: longName, age: 25 });
    expect(res.statusCode).toBe(400);
    expect(res.text).toContain('名前は255文字以内で入力してください');
  });
});

// 例: ユーザー名のバリデーション関数
function isValidUsername(username) {
  return typeof username === 'string' && username.length > 0 && username.length <= 255;
}

// テストケース
test('ユーザー名が空文字の場合、falseを返す', () => {
  expect(isValidUsername('')).toBe(false);
});

test('ユーザー名が255文字以内の場合、trueを返す', () => {
  const validName = 'a'.repeat(255);
  expect(isValidUsername(validName)).toBe(true);
});

test('ユーザー名が256文字の場合、falseを返す', () => {
  const invalidName = 'a'.repeat(256);
  expect(isValidUsername(invalidName)).toBe(false);
});

});
