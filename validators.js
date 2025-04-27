function isValidUsername(username) {
  return typeof username === 'string' && username.length > 0 && username.length <= 255;
}

module.exports = { isValidUsername };