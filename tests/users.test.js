const request = require('supertest');
const app = require('../app');

describe('ユーザー機能テスト', () => {

  describe('トップページアクセス', () => {
    test('200 OKで表示され、"ようこそ！"が含まれる', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('ようこそ！');
    });
  });

  describe('ユーザー登録', () => {
    describe('正常系', () => {
      test('正しいデータなら /users にリダイレクトする', async () => {
        const res = await request(app)
          .post('/users')
          .send({ name: 'Hanako', age: 25 });
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/users');
      });
    });

    describe('異常系（バリデーションエラー）', () => {
      const invalidCases = [
        { name: '', age: 25, expected: '名前は必須です' },
        { name: '太郎', age: -1, expected: '年齢は正の整数で入力してください' },
        { name: '太郎', age: '二十', expected: '年齢は数字で入力してください' },
        { name: '<script>', age: 25, expected: '名前に無効な文字が含まれています' },
        { name: '太郎', age: 25.5, expected: '年齢は正の整数で入力してください' },
        { name: '太郎', age: 1000, expected: '年齢は適切な範囲で入力してください' },
        { name: 'あ'.repeat(256), age: 25, expected: '名前は255文字以内で入力してください' },
      ];

      invalidCases.forEach(({ name, age, expected }) => {
        test(`無効データ name="${name}" age="${age}" → "${expected}"`, async () => {
          const res = await request(app)
            .post('/users')
            .send({ name, age });
          expect(res.statusCode).toBe(400);
          expect(res.text).toContain(expected);
        });
      });
    });
  });

});
