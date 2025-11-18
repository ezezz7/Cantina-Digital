import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import Container from "../components/Container";
import PageTitle from "../components/PageTitle";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await axios.get("http://localhost:3333/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <Container>
        <PageTitle>Meus pedidos</PageTitle>
        <p>Carregando pedidos...</p>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container>
        <PageTitle>Meus pedidos</PageTitle>
        <p>Você ainda não fez nenhum pedido.</p>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>Meus pedidos</PageTitle>

      <OrdersList>
        {orders.map((order) => (
          <OrderCard key={order.id}>
            <OrderHeader>
              <div>
                <OrderId>Pedido #{order.id}</OrderId>
                <OrderDate>
                  {new Date(order.createdAt).toLocaleString("pt-BR")}
                </OrderDate>
              </div>

              <OrderStatus status={order.status}>
                {translateStatus(order.status)}
              </OrderStatus>
            </OrderHeader>

            <ItemsList>
              {order.items.map((item) => (
                <ItemRow key={item.id}>
                  <div>
                    <ItemName>
                      {item.product?.name || `Produto #${item.productId}`}
                    </ItemName>
                    <ItemDetails>
                      {item.quantity}x — R$ {Number(item.unitPrice).toFixed(2)}
                    </ItemDetails>
                  </div>

                  <ItemSubtotal>
                    R$ {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                  </ItemSubtotal>
                </ItemRow>
              ))}
            </ItemsList>

            <OrderFooter>
              <TotalLabel>Total</TotalLabel>
              <TotalValue>R$ {Number(order.total).toFixed(2)}</TotalValue>
            </OrderFooter>
          </OrderCard>
        ))}
      </OrdersList>
    </Container>
  );
}

export default Orders;


// --------- helpers e estilos ---------- //

function translateStatus(status) {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "PREPARING":
      return "Em preparo";
    case "READY":
      return "Pronto para retirada";
    default:
      return status;
  }
}

const OrdersList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OrderCard = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding: 16px 18px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.04);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderId = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const OrderDate = styled.p`
  font-size: 13px;
  color: #555;
`;

const OrderStatus = styled.span`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;

  ${({ status, theme }) => {
    if (status === "PENDING") {
      return `
        background: rgba(246, 192, 0, 0.15);
        color: ${theme.colors.primaryYellow};
      `;
    }
    if (status === "PREPARING") {
      return `
        background: rgba(76, 175, 80, 0.12);
        color: #2e7d32;
      `;
    }
    if (status === "READY") {
      return `
        background: rgba(25, 118, 210, 0.12);
        color: ${theme.colors.primaryBlue};
      `;
    }
    return `
      background: #eee;
      color: #555;
    `;
  }}
`;

const ItemsList = styled.div`
  margin-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding-top: 8px;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
`;

const ItemName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const ItemDetails = styled.p`
  font-size: 13px;
  color: #666;
`;

const ItemSubtotal = styled.p`
  font-size: 14px;
  font-weight: 500;
`;

const OrderFooter = styled.div`
  margin-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding-top: 8px;

  display: flex;
  justify-content: flex-end;
  gap: 6px;
  align-items: center;
`;

const TotalLabel = styled.span`
  font-size: 14px;
  color: #555;
`;

const TotalValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.darkBlue};
`;
