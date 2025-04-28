const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const method = req.method;
  const url = req.originalUrl;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const now = new Date().toISOString();

    let statusColor = '';

    if (status >= 500) {
      statusColor = '\x1b[31m'; // 赤
    } else if (status >= 400) {
      statusColor = '\x1b[33m'; // 黄色
    } else if (status >= 200) {
      statusColor = '\x1b[32m'; // 緑
    } else {
      statusColor = '\x1b[0m';  // リセット
    }

    console.log(`${statusColor}🟢 [INFO] [${now}] ${method} ${url} from ${ip} -> ${status} (${duration}ms)\x1b[0m`);
  });

  next();
};

module.exports = requestLogger;
