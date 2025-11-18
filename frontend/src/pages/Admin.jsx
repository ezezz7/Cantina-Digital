import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import Container from "../components/Container";
import PageTitle from "../components/PageTitle";

function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  async function loadProducts() {
    const response = await axios.get("http://localhost:3333/products");
    setProducts(response.data);
  }

  async function loadOrders() {
    const response = await axios.get("http://localhost:3333/orders/all");
    setOrders(response.data);
  }

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  async function handleCreateProduct(e) {
    e.preventDefault();

    if (!name || !price) return;

    try {
      await axios.post("http://localhost:3333/products", {
        name,
        description,
        price,
      });

      setName("");
      setDescription("");
      setPrice("");
      loadProducts();
    } catch (err) {
      console.error("Erro ao criar produto:", err);
      alert("Erro ao criar produto.");
    }
  }

  async function handleChangeStatus(orderId, newStatus) {
    try {
      await axios.patch(`http://localhost:3333/orders/${orderId}/status`, {
        status: newStatus,
      });
      loadOrders();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status.");
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

                <TotalLine>Total: R$ {Number(order.total).toFixed(2)}</TotalLine>
              </OrderCard>
            ))}
          </OrdersList>
        )}
      </Section>
    </Container>
  );
}

export default Admin;


// -------- estilos -------- //

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
  grid-template-columns: 2fr 3fr 1fr auto;
  gap: 8px;

  input {
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.borderLight};
    font-size: 14px;
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
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
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  font-size: 13px;
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
