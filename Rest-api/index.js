const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Разрешаваме cookies + динамичен origin (localhost/127.0.0.1 на всякакъв порт)
const allowlist = [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/];
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // Postman/Curl
    const ok = allowlist.some(rx => rx.test(origin));
    cb(ok ? null : new Error(`Blocked by CORS: ${origin}`), ok);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Диагностични лога: Origin, cookies + всеки входящ request
app.use((req, _res, next) => {
  if (process.env.DEBUG_AUTH === '1') {
    const hasAuth = !!(req.cookies && req.cookies['auth-cookie']);
    console.log('[CORS]', req.headers.origin, '| cookies:', Object.keys(req.cookies || {}));
    console.log(`[REQ] ${req.method} ${req.originalUrl} | Origin=${req.headers.origin || 'n/a'} | hasCookie=${hasAuth}`);
  }
  next();
});

// attachUser е безопасен; auth() се вика по рутове
app.use(require('./middleware/attachUser'));

// Бърз диагностичен рут (по желание)
app.get('/diag', (req, res) => {
  res.json({
    ok: true,
    origin: req.headers.origin || null,
    cookies: Object.keys(req.cookies || {}),
    hasAuthCookie: Boolean(req.cookies && req.cookies['auth-cookie'])
  });
});

const api = require('./router');
app.use('/api', api);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
