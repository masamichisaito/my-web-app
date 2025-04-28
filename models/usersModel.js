const users = [];
let userId = 1;

// ユーザー一覧取得
exports.getAllUsers = () => users;

// ユーザー登録
exports.addUser = (name, age) => {
  users.push({ id: userId++, name, age });
};

// ユーザー取得
exports.getUserById = (id) => users.find(u => u.id === id);

// ユーザー更新
exports.updateUser = (id, name, age) => {
  const user = users.find(u => u.id === id);
  if (user) {
    user.name = name;
    user.age = age;
  }
};

// ユーザー削除
exports.deleteUser = (id) => {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) users.splice(index, 1);
};
