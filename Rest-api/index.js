const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const allowlist = [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/];
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    const ok = allowlist.some(rx => rx.test(origin));
    cb(ok ? null : new Error('Blocked by CORS'), ok);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const api = require('./router');
app.use('/api', api);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
