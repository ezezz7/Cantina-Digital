import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartItems = [] } = useCart(); // Fallback aqui porque tava dando erro
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);



  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Wrapper>
      <TopBar />
      <NavContent>
  <Logo>Cantina Digital</Logo>

  <NavRight>
    {user && (
      <Balance>
        Saldo:&nbsp;
        <strong>R$ {Number(user.balance || 0).toFixed(2)}</strong>
      </Balance>
    )}

    <NavLinks>
      <StyledLink to="/menu">Cardápio</StyledLink>

      <CartLink to="/carrinho">
        🛒 Carrinho
        {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
      </CartLink>

      {user && user.role === "admin" && (
        <StyledLink to="/admin">Admin</StyledLink>
      )}

      {user && (
        <>
          <StyledLink to="/meus-pedidos">Meus pedidos</StyledLink>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </>
      )}

      {!user && (
        <>
          <StyledLink to="/login">Login</StyledLink>
          <PrimaryButton to="/register">Criar conta</PrimaryButton>
        </>
      )}
    </NavLinks>

    </NavRight>
  </NavContent>

    </Wrapper>
  );
}

export default Navbar;


// ----------------- ESTILOS ---------------- //

const Wrapper = styled.header`
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const TopBar = styled.div`
  background: ${({ theme }) => theme.colors.darkBlue};
  height: 6px;
  width: 100%;
`;

const NavContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledLink = styled(Link)`
  font-size: 16px;
  font-weight: 550;
  color: ${({ theme }) => theme.colors.primaryBlue};

  &:hover {
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;

const PrimaryButton = styled(Link)`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.primaryYellow};
  color: ${({ theme }) => theme.colors.darkBlue};
  font-weight: 600;
  border-radius: 6px;

  &:hover {
    background: ${({ theme }) => theme.colors.softYellow};
  }
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.primaryBlue};
  border-radius: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primaryBlue};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryBlue};
    color: white;
  }
    transition: 
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;
`;
const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Balance = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.darkBlue};

  strong {
    font-weight: 700;
  }
`;
const CartLink = styled(Link)`
  position: relative;
  font-weight: 550;
  color: ${({ theme }) => theme.colors.primaryBlue};
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  margin-top:-1px;

  display: flex;
  align-items: center;
  gap: 6px;

  transition: background 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;

const CartBadge = styled.span`
  background: ${({ theme }) => theme.colors.primaryYellow};
  color: ${({ theme }) => theme.colors.darkBlue};

  font-size: 12px;
  font-weight: 700;

  padding: 2px 7px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: -4px;
  right: -6px;

  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
`;


