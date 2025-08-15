const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Същият CORS като index.js
const allowlist = [
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/
];
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    const ok = allowlist.some(rx => rx.test(origin));
    cb(ok ? null : new Error(`Blocked by CORS: ${origin}`), ok);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

if (process.env.DEBUG_AUTH === '1') {
  app.use((req, _res, next) => {
    console.log('[CORS]', req.headers.origin, '| cookies:', Object.keys(req.cookies || {}));
    next();
  });
}

app.use(require('./middleware/attachUser')); // не вреди; auth() е на рутовете

const api = require('./router'); // <-- има го в Rest-api/router
app.use('/api', api);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
