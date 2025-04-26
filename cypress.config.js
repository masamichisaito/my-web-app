const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CI ? 'http://web:3000' : 'http://localhost:3000',
    supportFile: false
  }
});
