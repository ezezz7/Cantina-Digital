const express = require('express');
const prisma = require('../prisma');
const authMiddleware = require('../middlewares/auth');
const adminOnly = require('../middlewares/isAdmin');
const router = express.Router();

// listar todos com get
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    });

    return res.json(products);
  } catch (error) {
    console.error('Erro em GET /products:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// detalhes de um produto com get
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Erro em GET /products/:id:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});
// POST /products - criar produto (pro adm)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ error: 'Preço inválido.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: numericPrice,
        imageUrl: imageUrl && imageUrl !== 'null' ? imageUrl : null,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Erro em POST /products:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});
// DELETE /products/:id - remover produto (adm)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    const itemCount = await prisma.orderItem.count({
      where: { productId }
    });

    if (itemCount > 0) {
      return res.status(400).json({
        error: 'Não é possível remover este produto porque ele já foi usado em pedidos.'
      });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return res.status(204).send(); // sem conteúdo, só sucesso
  } catch (error) {
    console.error('Erro em DELETE /products/:id:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});


module.exports = router;
