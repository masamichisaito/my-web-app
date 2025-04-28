const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// ログの出力フォーマット
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// ロガー作成
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({ format: combine(colorize(), timestamp(), logFormat) }), // ターミナル出力
    new transports.File({ filename: 'logs/app.log' }) // ファイル出力（logsフォルダにapp.log）
  ],
});

module.exports = logger;
