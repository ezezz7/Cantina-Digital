const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users');

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = require('./prisma');
const authMiddleware = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);

// Rota de teste
app.get('/health', (req, res) => {
  return res.json({
    status: 'OK',
    message: 'Cantina Digital API rodando',
  });
});

// |||||||| ROTAS DE AUTENTICAÇÃO |||||||| //

// POST /auth/register
// cadastro
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;

    // validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Nome, email e senha são obrigatórios',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Já existe um usuário com esse email',
      });
    }

    // hasheando
    const hashedPassword = await bcrypt.hash(password, 10);

    // 20 reais iniciais só por praticidade
    const INITIAL_BALANCE = 20;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        studentId: studentId || null,
        balance: INITIAL_BALANCE,
      },
    });

    // nunca devolvendo senha nem hash
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Erro no /auth/register:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// faz login e devolve um JWT
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // só uma validação básica
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios',
      });
    }

    // procurando o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
      });
    }

    // comparando a senha enviada com o hash salvo
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
      });
    }

    // gerando o token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d', // token válido por 1 dia
      }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
        balance: user.balance,
      },
    });
  } catch (error) {
    console.error('Erro no /auth/login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// |||||||||  ROTA PROTEGIDA DE TESTE ||||||||| //

// GET /me
app.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json({ user });
  } catch (error) {
    console.error('Erro no /me:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

//   ||||||||| PARTE PRA INICIAR SERVIDOR |||||||||||  //

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
