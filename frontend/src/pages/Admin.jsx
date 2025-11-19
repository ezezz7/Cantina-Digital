import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import Container from "../components/Container";
import PageTitle from "../components/PageTitle";
import { useAuth } from "../contexts/AuthContext";

function Admin() {
  const { token, user } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [users, setUsers] = useState([]);       
  const [creditValues, setCreditValues] = useState({});   // esses 2 aqui são pro crédito

  // só se por algum motivo alguém tentar acessar admin sem ser adm
  if (!user || user.role !== "admin") {
    return (
      <Container>
        <PageTitle>Painel do Admin</PageTitle>
        <p>Você não tem permissão para acessar essa página.</p>
      </Container>
    );
  }

  async function loadProducts() {
    try {
      const response = await axios.get("http://localhost:3333/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      alert("Erro ao carregar produtos.");
    }
  }

  async function loadOrders() {
    try {
      const response = await axios.get("http://localhost:3333/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
      alert("Erro ao carregar pedidos.");
    }
  }

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreateProduct(e) {
    e.preventDefault();

    if (!name || !price) return;

    try {
      const response = await axios.post(
        "http://localhost:3333/products",
        {
          name,
          description,
          price,
          imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // adiciona o novo produto na lista
      setProducts((prev) => [...prev, response.data]);

      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
    } catch (err) {
      console.error("Erro ao criar produto:", err);
      const msg = err?.response?.data?.error || "Erro ao criar produto.";
      alert(msg);
    }
  }
    async function loadOrders() {
    try {
      const response = await axios.get("http://localhost:3333/orders/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
      alert("Erro ao carregar pedidos.");
    }
  }


  async function handleChangeStatus(orderId, newStatus) {
    try {
      await axios.patch(
        `http://localhost:3333/orders/${orderId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadOrders();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status.");
    }
  }

  async function handleDeleteProduct(id) {
    const confirmDelete = window.confirm(
      "Tem certeza que quer remover este produto?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3333/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erro ao remover produto:", err);

      const msg = err?.response?.data?.error;
      if (msg) {
        alert(msg);
      } else {
        alert("Erro ao remover produto.");
      }
    }
  }
    function handleChangeCreditInput(userId, value) {
    setCreditValues((prev) => ({
      ...prev,
      [userId]: value,
    }));
  }

  async function handleAddCredit(userId) {
    const amountStr = creditValues[userId];
    const amount = Number(amountStr);

    if (!amountStr || Number.isNaN(amount) || amount <= 0) {
      alert("Informe um valor válido para crédito.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3333/users/${userId}/credit`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // atualizar o user na lista 
      const updated = response.data;

      setUsers((prev) =>
        prev.map((u) => (u.id === updated.id ? { ...u, balance: updated.balance } : u))
      );

      // limpar o campo
      setCreditValues((prev) => ({
        ...prev,
        [userId]: "",
      }));
    } catch (err) {
      console.error("Erro ao adicionar saldo:", err);
      const msg = err?.response?.data?.error || "Erro ao adicionar saldo.";
      alert(msg);
    }
  }
  async function loadUsers() {
  try {
    const response = await axios.get("http://localhost:3333/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(response.data);
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
    alert("Erro ao carregar usuários.");
  }
}



  return (
    <Container>
      <PageTitle>Painel do Admin</PageTitle>
      <Section>
        <SectionTitle>Novo produto</SectionTitle>

        <FormRow onSubmit={handleCreateProduct}>
          <input
            type="text"
            placeholder="Nome do produto"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="text"
            placeholder="URL da imagem (opcional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <input
            type="number"
            step="0.01"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <PrimaryButton type="submit">Criar</PrimaryButton>
        </FormRow>

      </Section>

            <Section>
        <SectionTitle>Usuários e saldo</SectionTitle>

        {users.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <UsersList>
            {users.map((u) => (
              <UserRow key={u.id}>
                <UserInfo>
                  <strong>{u.name}</strong>
                  <span>{u.email}</span>
                  {u.role === "admin" && <RoleBadge>Admin</RoleBadge>}
                </UserInfo>

                <UserBalance>
                  Saldo atual:{" "}
                  <strong>R$ {Number(u.balance || 0).toFixed(2)}</strong>
                </UserBalance>

                <CreditForm
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddCredit(u.id);
                  }}
                >
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Valor"
                    value={creditValues[u.id] || ""}
                    onChange={(e) =>
                      handleChangeCreditInput(u.id, e.target.value)
                    }
                  />
                  <SmallButton type="submit">Adicionar</SmallButton>
                </CreditForm>
              </UserRow>
            ))}
          </UsersList>
        )}
      </Section>


      <Section>
        <SectionTitle>Produtos cadastrados</SectionTitle>

        {products.length === 0 ? (
          <p>Nenhum produto cadastrado.</p>
        ) : (
          <ProductsList>
            {products.map((product) => (
              <ProductRow key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  {product.description && (
                    <ProductDescription>
                      {product.description}
                    </ProductDescription>
                  )}
                  <ProductPrice>
                    R$ {Number(product.price).toFixed(2)}
                  </ProductPrice>
                </div>

                <DeleteButton
                  type="button"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Remover
                </DeleteButton>
              </ProductRow>
            ))}
          </ProductsList>
        )}
      </Section>

      <Section>
        <SectionTitle>Pedidos (todos os usuários)</SectionTitle>

        {orders.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <OrdersList>
            {orders.map((order) => (
              <OrderCard key={order.id}>
                <OrderHeader>
                  <div>
                    <strong>Pedido #{order.id}</strong>
                    <p>
                      {order.user?.name} ({order.user?.email})
                    </p>
                  </div>

                  <StatusSelect
                    value={order.status}
                    onChange={(e) =>
                      handleChangeStatus(order.id, e.target.value)
                    }
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="PREPARING">Em preparo</option>
                    <option value="READY">Pronto</option>
                  </StatusSelect>
                </OrderHeader>

                <ItemsList>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}x {item.product?.name} — R${" "}
                      {Number(item.unitPrice).toFixed(2)}
                    </li>
                  ))}
                </ItemsList>

                <TotalLine>
                  Total: R$ {Number(order.total).toFixed(2)}
                </TotalLine>
              </OrderCard>
            ))}
          </OrdersList>
        )}
      </Section>
    </Container>
  );
}

export default Admin;

// ||||||| estilos ||||||| //

const Section = styled.section`
  margin-top: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.darkBlue};
  margin-bottom: 10px;
`;

const FormRow = styled.form`
  display: grid;
  grid-template-columns: 2fr 3fr 3fr 1fr auto;
  gap: 8px;

  input {
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.borderLight};
    font-size: 14px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr auto;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr auto;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;

    input {
      width: 100%;
    }
  }
`;


const PrimaryButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.primaryYellow};
  color: ${({ theme }) => theme.colors.darkBlue};
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.colors.softYellow};
  }
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductRow = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProductDescription = styled.p`
  font-size: 13px;
  color: #555;
  margin-top: 2px;
`;

const ProductPrice = styled.p`
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.primaryBlue};
`;

const DeleteButton = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  background: #f56565;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: #e53e3e;
  }

  &:active {
    transform: scale(0.96);
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div p {
    font-size: 13px;
    color: #555;
  }
`;

const StatusSelect = styled.select`
  padding: 8px 12px;
  padding-right: 38px;
  border-radius: 8px;
  border: 1.5px solid ${({ theme }) => theme.colors.primaryBlue};
  background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23185fa3' d='M6 9L1 4h10z'/%3E%3C/svg%3E") no-repeat;
  background-position: calc(100% - 8px) center;
  background-size: 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.darkBlue};
  cursor: pointer;
  appearance: none;
  min-width: 140px;
  
  transition: 
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryBlue}08;
    border-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryBlue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryBlue}22;
  }

  option {
    background: #fff;
    color: ${({ theme }) => theme.colors.darkBlue};
    padding: 8px;
    font-weight: 500;
  }

  option:checked {
    background: ${({ theme }) => theme.colors.primaryBlue};
    color: #fff;
  }

  @media (max-width: 600px) {
    min-width: auto;
    width: 50px;
    padding: 8px 6px;
    padding-right: 28px;
    font-size: 0;
  }

  @media (max-width: 600px) {
    option {
      font-size: 14px;
    }
  }
`;

const ItemsList = styled.ul`
  margin-top: 8px;
  font-size: 13px;
  padding-left: 18px;
`;

const TotalLine = styled.p`
  margin-top: 6px;
  font-size: 14px;
  font-weight: 600;
  text-align: right;
`;
const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const UserRow = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};

  display: grid;
  grid-template-columns: 2fr 1.5fr auto;
  align-items: center;
  gap: 10px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  span {
    font-size: 13px;
    color: #555;
  }
`;

const RoleBadge = styled.span`
  margin-top: 4px;
  align-self: flex-start;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primaryBlue};
  color: #ffff !important;
  font-size: 11px;
  font-weight: 600;
`;

const UserBalance = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.darkBlue};

  strong {
    font-weight: 600;
  }
`;

const CreditForm = styled.form`
  display: flex;
  gap: 6px;
  justify-content: flex-end;

  input {
    width: 90px;
    padding: 6px 8px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.borderLight};
    font-size: 13px;
  }
`;

const SmallButton = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.primaryYellow};
  color: ${({ theme }) => theme.colors.darkBlue};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.softYellow};
  }

  &:active {
    transform: scale(0.97);
  }
`;
