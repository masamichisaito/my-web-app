const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// 新規登録
router.post('/', usersController.createUser);

// 一覧表示
router.get('/', usersController.listUsers);

// 編集画面
router.get('/:id/edit', usersController.showEditForm);

// 更新
router.post('/:id/edit', usersController.updateUser);

// 削除
router.get('/:id/delete', usersController.deleteUser);

module.exports = router;
