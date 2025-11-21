import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import PageTitle from "../components/PageTitle";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react"; 

function Cart() {
  const { cartItems, updateQuantity, removeItem, clearCart, cartTotal } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  async function handleFinalizeOrder() {
    if (!user) {
      setToastMessage("Você precisa estar logado para fazer um pedido!");
      setToastVisible(true);

      setTimeout(() => {
        setToastVisible(false);
        navigate("/login");
      }, 1500);

      return;
    }

    if (cartItems.length === 0) return;

    try {
      const itemsPayload = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));
      const response = await axios.post("/orders", {
        items: itemsPayload,
      });

      const newBalance = response.data?.newBalance;
      if (typeof newBalance !== "undefined") {
        updateUser({ balance: newBalance });
      }

      clearCart();
      navigate("/meus-pedidos");

    } catch (err) {
      console.error("Erro ao finalizar pedido:", err);

      const msg = err?.response?.data?.error;

      if (msg === "Saldo insuficiente.") {
        alert("Seu saldo é insuficiente para esse pedido.");
      } else {
        alert("Erro ao finalizar pedido. Tente novamente.");
      }
    }
  }

  return (
    <Container>
      <PageTitle>Carrinho</PageTitle>
      {toastVisible && <Toast>{toastMessage}</Toast>}

      {cartItems.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <CartTable>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Preço uni.</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <QtyInput
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, Number(e.target.value))
                      }
                    />
                  </td>
                  <td>R$ {item.price.toFixed(2)}</td>
                  <td>R$ {(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <RemoveButton onClick={() => removeItem(item.id)}>
                      Remover
                    </RemoveButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </CartTable>

          <Summary>
            <TotalText>Total: R$ {cartTotal.toFixed(2)}</TotalText>

            <Actions>
              <ClearButton type="button" onClick={clearCart}>
                Limpar carrinho
              </ClearButton>

              <PrimaryButton type="button" onClick={handleFinalizeOrder}>
                Finalizar pedido
              </PrimaryButton>
            </Actions>
          </Summary>
        </>
      )}
    </Container>
  );
}

export default Cart;


// ||||||| estilos ||||||| //

const CartTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;

  th, td {
    padding: 8px;
    text-align: left;
    font-size: 14px;
  }

  thead {
    background: #f3f5ff;
  }

  tbody tr:nth-child(even) {
    background: #fafafa;
  }
`;

const QtyInput = styled.input`
  width: 60px;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const RemoveButton = styled.button`
  padding: 4px 8px;
  background: transparent;
  border-radius: 6px;
  border: 1px solid #d32f2f;
  color: #d32f2f;
  font-size: 12px;
  transition: 
  transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
  background-color 0.2s ease,
  box-shadow 0.2s ease,
  color 0.2s ease;

  &:hover {
    background: #d32f2f;
    color: #fff;
  }
`;

const Summary = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TotalText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const ClearButton = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  background: #fff;
  font-weight: 500;
  transition: 
  transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
  background-color 0.2s ease,
  box-shadow 0.2s ease,
  color 0.2s ease;

  &:hover {
    background: #f4f4f4;
  }
`;

const PrimaryButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.primaryYellow};
  color: ${({ theme }) => theme.colors.darkBlue};
  font-weight: 600;
  transition: 
  transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
  background-color 0.2s ease,
  box-shadow 0.2s ease,
  color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.softYellow};
  }
`;

const Toast = styled.div`
  position: fixed;
  top: 130px;
  right: 24px;
  background: ${({ theme }) => theme.colors.primaryBlue};
  color: #fff;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
  z-index: 1000;

  animation: fadeInOut 1.5s ease forwards;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    15% {
      opacity: 1;
      transform: translateY(0);
    }
    85% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;
