const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'admin' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@cantina.com',
        password: hashedPassword,
        role: 'admin',
        balance: 20, 
      },
    });

    console.log('Admin criado via seed:', admin.email);
  } else {
    console.log('Admin já existe:', existingAdmin.email);
  }

  const productsCount = await prisma.product.count();

  if (productsCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: 'Café',
          description: 'Pequeno',
          price: 2.50,
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG',
        },
        {
          name: 'Coxinha',
          description: 'Coxinha de frango crocante',
          price: 6.50,
          imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaS5tgro3bPaqGcMvNBDOHZQpAG2pwhkyApA&s',
        },
        {
          name: 'Sanduíche',
          description: 'Sanduíche de presunto',
          price: 7.00,
          imageUrl: 'https://alegrafoods.com.br/wp-content/uploads/2024/01/3-lanches-para-curtir-as-ferias-de-verao-com-presunto-defumado-alegra-foods-2.jpg',
        },
        {
          name: 'Suco de Laranja',
          description: '300ml natural',
          price: 4.00,
          imageUrl: 'https://osterstatic.reciperm.com/webp/10251.webp',
        },
      ],
    });

    console.log('Produtos iniciais criados.');
  } else {
    console.log(`Já existem ${productsCount} produtos no banco. Seed de produtos ignorado.`);
  }

  console.log('Seed finalizado.');
}

main()
  .catch((err) => {
    console.error('Erro no seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
