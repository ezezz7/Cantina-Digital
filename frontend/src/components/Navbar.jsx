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
      <NavContent>
<Logo>
  <img src="/src/assets/logo-cantina.png" alt="Logo Cantina" style={{ height: "40px" }} />
  Cantina<br />Digital
</Logo>



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
  background: ${({ theme }) => theme.colors.primaryBlue};
  color: white;
  padding: 14px 0;
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

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  color: white;
  font-size: 20px;
  font-weight: 600;
`;

const LogoBall = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.primaryYellow};
  border-radius: 50%;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledLink = styled(Link)`
  color: white;
  font-weight: 500;
  transition: 
  transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
  background-color 0.2s ease,
  box-shadow 0.2s ease,
  color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryYellow};
  }
`;


const PrimaryButton = styled(Link)`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.primaryYellow};
  color: ${({ theme }) => theme.colors.darkBlue};
  border-radius: 8px;
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


const LogoutButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.primaryYellow};
  color: ${({ theme }) => theme.colors.darkBlue};
  border-radius: 8px;
  font-weight: 550;
  transition: 
  transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
  background-color 0.2s ease,
  box-shadow 0.2s ease,
  color 0.2s ease;
  border:none;

  &:hover {
    background: ${({ theme }) => theme.colors.softYellow};
  }
`;
const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Balance = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.primaryWhite};
  strong {
    font-weight: 600;
  }
  margin-top:2px;
`;
const CartLink = styled(Link)`
  position: relative;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primaryWhite};
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  margin-top:-1px;

  display: flex;
  align-items: center;
  gap: 6px;

  transition: background 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryYellow};
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


