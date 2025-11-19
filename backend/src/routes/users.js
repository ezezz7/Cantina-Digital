const express = require('express');
const prisma = require('../prisma');
const authMiddleware = require('../middlewares/auth');
const adminOnly = require('../middlewares/isAdmin');

const router = express.Router();

// GET /users - listar todos os usuários (só pro adm)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        role: true,
        balance: true,
        createdAt: true,
      },
    });

    return res.json(users);
  } catch (error) {
    console.error('Erro em GET /users:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// PATCH /users/:id/credit - rota pra o adm adicionar crédito
router.patch('/:id/credit', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body; // quanto quer creditar

    const numericAmount = Number(amount);

    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Valor de crédito inválido.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        balance: {
          increment: numericAmount,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        balance: true,
      },
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error('Erro em PATCH /users/:id/credit:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

module.exports = router;
