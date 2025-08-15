const decodeJwt = (token) => {
  try {
    const part = token.split('.')[1];
    return JSON.parse(Buffer.from(part, 'base64').toString('utf8'));
  } catch {
    return null;
  }
};

module.exports = (req, _res, next) => {
  let id =
    req.user?._id ||
    req.user?.id ||
    req.cookies?.userId ||
    req.session?.userId ||
    req.headers['x-user-id'] ||
    req.query?.uid ||
    req.body?.userId ||
    null;

  if (!id && req.cookies?.user) {
    try {
      const u = JSON.parse(req.cookies.user);
      id = u?._id || u?.id || null;
    } catch {}
  }

  if (!id && req.cookies?.auth) {
    const p = decodeJwt(req.cookies.auth);
    id = p?.sub || p?.id || p?._id || null;
  }

  const auth = req.headers?.authorization || '';
  if (!id && auth.startsWith('Bearer ')) {
    const p = decodeJwt(auth.slice(7));
    id = p?.sub || p?.id || p?._id || null;
  }

  if (id && !req.user) req.user = { id: String(id) };

  next();
};
