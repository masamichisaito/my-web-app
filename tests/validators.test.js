const { isValidUsername } = require('../validators');

describe('ユーザー名バリデーション関数', () => {
  test('空文字列は無効と判定される', () => {
    expect(isValidUsername('')).toBe(false);
  });

  test('255文字以内なら有効と判定される', () => {
    const validName = 'a'.repeat(255);
    expect(isValidUsername(validName)).toBe(true);
  });

  test('256文字以上は無効と判定される', () => {
    const invalidName = 'a'.repeat(256);
    expect(isValidUsername(invalidName)).toBe(false);
  });
});
