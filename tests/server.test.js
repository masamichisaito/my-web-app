// tests/server.test.js
const request = require('supertest');
const app = require('../app');

describe('Server Initialization', () => {
  it('should respond to GET / with status 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
