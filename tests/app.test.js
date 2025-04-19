const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('should return correct text content', async () => {
    const res = await request(app).get('/');
    expect(res.text).toBe('Hello, test!');
  });

  describe('POST /users', () => {
    it('should create user when valid data is sent', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Hanako', age: 25 });
  
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ name: 'Hanako', age: 25 });
    });
  
    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/users')
        .send({ age: 20 });
  
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Name is required');
    });
  
    it('should return 400 if age is not a number', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'Jiro', age: 'twenty' });
  
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Age must be a number');
    });
  });
  
});