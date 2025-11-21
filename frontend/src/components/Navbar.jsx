import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { User, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import logoCantina from "../assets/logo-cantina.png";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartItems = [] } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
    setMenuOpen(false);
  }

  return (
    <Wrapper>
      <NavContent>
        <Logo>
          <img src={logoCantina} alt="Logo Cantina" style={{ height: "40px" }} />
          <LogoText>Cantina<br />Digital</LogoText>
        </Logo>


        <NavRight>
          {user && (
            <Balance>
              Saldo: <strong>R$ {Number(user.balance || 0).toFixed(2)}</strong>
            </Balance>
          )}
          
          {user && (
            <UserIconWrapper>
              <IconArea>
                <User size={20} />
                {user.role === "admin" && (
                  <Settings className="gear" size={14} />
                )}
              </IconArea>

              <Tooltip className="tooltip">
                <p>{user.email}</p>
                {user.role === "admin" && (
                  <span className="adminTag">Administrador</span>
                )}
              </Tooltip>
            </UserIconWrapper>
          )}

          <HamburgerButton onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </HamburgerButton>

          <NavLinks $isOpen={menuOpen}>
            <StyledLink to="/menu" onClick={() => setMenuOpen(false)}>Cardápio</StyledLink>

            <CartLink to="/carrinho" onClick={() => setMenuOpen(false)}>
              🛒 Carrinho
              {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
            </CartLink>

            {user && user.role === "admin" && (
              <StyledLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</StyledLink>
            )}

            {user && (
              <>
                <StyledLink to="/meus-pedidos" onClick={() => setMenuOpen(false)}>Meus pedidos</StyledLink>
                <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
              </>
            )}

            {!user && (
              <>
                <StyledLink to="/login" onClick={() => setMenuOpen(false)}>Login</StyledLink>
                <PrimaryButton to="/register" onClick={() => setMenuOpen(false)}>Criar conta</PrimaryButton>
              </>
            )}
          </NavLinks>
        </NavRight>
      </NavContent>
    </Wrapper>
  );
}

export default Navbar;

// |||||| estilos |||||| //

const Wrapper = styled.header`
  background: ${({ theme }) => theme.colors.primaryBlue};
  color: white;
  padding: 14px 0;
  position: relative;
  z-index: 1000;
`;

const NavContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  position: relative; 
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: 600;
`;

const LogoText = styled.span`
  font-size: 18px;
  line-height: 1.2;
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;

  @media (max-width: 768px) {
    position: static; 
  }
`;


const Balance = styled.div`
  font-size: 15px;
  color: white;
  font-weight: 600;
  margin-top: 3px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserIconWrapper = styled.div`
  position: relative;
  cursor: pointer;

  &:hover .tooltip {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
`;

const IconArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffffff;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

  .gear {
    color: ${({ theme }) => theme.colors.primaryYellow};
    margin-left: -2px;
    margin-top: 1px;
  }

  &:hover {
    transform: scale(1.06);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  top: 36px;
  right: 0;

  background: white;
  color: ${({ theme }) => theme.colors.darkBlue};
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;

  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  opacity: 0;
  transform: translateY(-6px);
  pointer-events: none;
  transition: 0.22s ease;
  z-index: 999;

  p {
    margin: 0;
    font-weight: 500;
  }

  .adminTag {
    display: inline-block;
    margin-top: 4px;
    padding: 2px 6px;
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.primaryBlue};
    color: white;
    font-size: 11px;
    font-weight: 600;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    position: absolute;
    top: 100%;          
    left: 0;
    right: 0;

    flex-direction: column;
    background: ${({ theme }) => theme.colors.primaryBlue};

    overflow: hidden;
    max-height: ${({ $isOpen }) => ($isOpen ? "400px" : "0")};
    padding: ${({ $isOpen }) => ($isOpen ? "16px 24px" : "0")};

    pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};

    transition:
      max-height 0.3s ease,
      padding 0.3s ease,
      pointer-events 0s linear ${({ $isOpen }) => ($isOpen ? "0s" : "0.3s")};
`;



const StyledLink = styled(Link)`
  color: white;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryYellow};
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px 0;
  }
`;

const CartLink = styled(Link)`
  position: relative;
  font-weight: 500;
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryYellow};
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px 0;
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

const PrimaryButton = styled(Link)`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.primaryYellow};
  color: ${({ theme }) => theme.colors.darkBlue};
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.softYellow};
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.primaryYellow};
  color: ${({ theme }) => theme.colors.darkBlue};
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.softYellow};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;