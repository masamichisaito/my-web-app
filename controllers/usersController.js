const usersModel = require('../models/usersModel');

// バリデーション関数
function validateUserData(name, age) {
  const errors = [];
  if (!name) errors.push('名前は必須です');
  else if (name.length > 255) errors.push('名前は255文字以内で入力してください');
  else if (/[^a-zA-Z0-9ぁ-んァ-ン一-龥ーａ-ｚＡ-Ｚ０-９]/.test(name)) {
    errors.push('名前に無効な文字が含まれています');
  }

  const ageNumber = Number(age);
  if (!age) errors.push('年齢は必須です');
  else if (isNaN(ageNumber)) errors.push('年齢は数字で入力してください');
  else if (!Number.isInteger(ageNumber) || ageNumber <= 0) {
    errors.push('年齢は正の整数で入力してください');
  } else if (ageNumber > 120) {
    errors.push('年齢は適切な範囲で入力してください');
  }

  return { errors, ageNumber };
}

// ユーザー登録
exports.createUser = (req, res, next) => {
  try {
    const { name, age } = req.body;
    const { errors, ageNumber } = validateUserData(name, age);

    if (errors.length > 0) {
      return res.status(400).send(errors.join('、')); // ←ここ修正
    }

    usersModel.addUser(name, ageNumber);
    res.redirect('/users');
  } catch (error) {
    next(error);
  }
};

// ユーザー一覧
exports.listUsers = (req, res, next) => {
  try {
    const users = usersModel.getAllUsers();
    res.render('users', { users });
  } catch (error) {
    next(error);
  }
};

// 編集画面
exports.showEditForm = (req, res, next) => {
  try {
    const user = usersModel.getUserById(parseInt(req.params.id, 10));
    if (!user) {
      const err = new Error('ユーザーが見つかりません');
      err.status = 404;
      throw err;
    }
    res.render('edit', { user });
  } catch (error) {
    next(error);
  }
};

// 更新処理
exports.updateUser = (req, res, next) => {
  try {
    const { name, age } = req.body;
    const { errors, ageNumber } = validateUserData(name, age);

    if (errors.length > 0) {
      return res.status(400).send(errors.join('、')); // ←ここ修正
    }

    usersModel.updateUser(parseInt(req.params.id, 10), name, ageNumber);
    res.redirect('/users');
  } catch (error) {
    next(error);
  }
};

// 削除処理
exports.deleteUser = (req, res, next) => {
  try {
    usersModel.deleteUser(parseInt(req.params.id, 10));
    res.redirect('/users');
  } catch (error) {
    next(error);
  }
};
