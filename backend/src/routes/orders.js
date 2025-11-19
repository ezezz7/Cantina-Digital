const express = require('express');
const prisma = require('../prisma');
const authMiddleware = require('../middlewares/auth');
const adminOnly = require('../middlewares/isAdmin');
const router = express.Router();

// POST /orders
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items é obrigatório e tem que ser um array com pelo menos um item.' });
    }

    // validando
    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    if (products.length !== items.length) {
      return res.status(400).json({ error: 'Algum productId não existe.' });
    }

    let total = 0;

    const orderItemsData = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      const unitPrice = product.price;

      total += Number(unitPrice) * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: unitPrice
      };
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const currentBalance = Number(user.balance || 0);

    if (currentBalance < total) {
      return res.status(400).json({ error: 'Saldo insuficiente.' });
    }

    const [order, updatedUser] = await prisma.$transaction([
      prisma.order.create({
        data: {
          userId,
          total,
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      }),

      prisma.user.update({
        where: { id: userId },
        data: {
          balance: {
            decrement: total,
          },
        },
        select: {
          id: true,
          balance: true,
        },
      }),
    ]);

    return res.status(201).json({
      order,
      newBalance: updatedUser.balance,
    });
  } catch (error) {
    console.error('Erro em POST /orders:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});


// GET /orders - listar só pedidos do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            items: {
            include: {
                product: true
            }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
        });


    return res.json(orders);
  } catch (error) {
    console.error('Erro em GET /orders:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});
// PATCH /orders/:id/status - atualizar status do pedido (adm)
router.patch('/:id/status', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['PENDING', 'PREPARING', 'READY'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    const order = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.json(order);
  } catch (error) {
    console.error('Erro em PATCH /orders/:id/status:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});


// GET /orders/all - todos os pedidos (adm!)
router.get('/all', authMiddleware, adminOnly, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(orders);
  } catch (error) {
    console.error('Erro em GET /orders/all:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});


// GET /orders/:id - pedido específico
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
            items: {
            include: {
                product: true
            }
            }
        }
        });


    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ error: 'Acesso negado a este pedido' });
    }

    return res.json(order);
  } catch (error) {
    console.error('Erro em GET /orders/:id:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});


module.exports = router;
