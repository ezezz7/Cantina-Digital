const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');


  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Formato do token inválido' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Formato do token inválido' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // salvando os dados do usuário na requisição
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    // continua para a próxima função 
    return next();
  } catch (error) {
    console.error('Erro no middleware de auth:', error);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;
