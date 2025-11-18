function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso permitido apenas para administradores' });
  }

  return next();
}

module.exports = adminOnly;
