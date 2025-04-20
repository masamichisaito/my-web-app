// tests/index.test.js
const app = require('../app');
const rpgRoutes = require('./routes/rpg');
app.use('/rpg', rpgRoutes);

describe('App Module', () => {
  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
