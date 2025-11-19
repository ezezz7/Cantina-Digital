import { useCart } from "../contexts/CartContext";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import Container from "../components/Container";
import PageTitle from "../components/PageTitle";

function Menu() {
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const { addItem } = useCart();
 const [toastVisible, setToastVisible] = useState(false);
 const [toastMessage, setToastMessage] = useState("");

  // Função nova pra parte de adicionar item no carrinho
  function handleAdd(product) {
    addItem(product);

    setToastMessage(`"${product.name}" adicionado ao carrinho`);
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, 1500);
  }



  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await axios.get("http://localhost:3333/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <Container>
        <PageTitle>Cardápio</PageTitle>
        <p>Carregando produtos...</p>
      </Container>
    );
  }

  return (
  <Container>
    <PageTitle>Cardápio</PageTitle>

    <Grid>
      {products.map((product) => (
        <Card key={product.id}>
          <ImageArea>
            {product.imageUrl && product.imageUrl !== "null" ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <NoImage>Sem imagem</NoImage>
            )}
          </ImageArea>

          <Name>{product.name}</Name>
          <Description>{product.description}</Description>
          <Price>R$ {Number(product.price).toFixed(2)}</Price>

          <AddButton onClick={() => handleAdd(product)}>
            Adicionar
          </AddButton>
        </Card>
      ))}
    </Grid>

    {toastVisible && (
      <Toast>
        {toastMessage || "Produto adicionado ao carrinho"}
      </Toast>
    )}
  </Container>
);
}

export default Menu;


// -------------- Estilos -------------- //

const Grid = styled.div`
  margin-top: 20px;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 22px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.04);

  display: flex;
  flex-direction: column;
`;

const ImageArea = styled.div`
  height: 140px;
  background: #f1f5ff;
  border-radius: 8px;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NoImage = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primaryBlue};
  font-weight: 500;
`;

const Name = styled.h2`
  margin-top: 12px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.darkBlue};
  margin-left:2px;
`;

const Description = styled.p`
  font-size: 14px;
  margin-top: 4px;
  color: #555;
  margin-left:2px;
`;

const Price = styled.p`
  margin-top: auto;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.primaryBlue};
  font-weight: 600;
  margin-left:2px;
`;

const AddButton = styled.button`
  margin-top: 12px;
  padding: 12px 24px;
  
  background: ${({ theme }) => theme.colors.primaryYellow};
  color: ${({ theme }) => theme.colors.darkBlue};
  
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.3px;
  border-radius: 12px;
  border: none;
  
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  transition: 
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.softYellow};
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: translateY(0) scale(0.98);
    background: ${({ theme }) => theme.colors.primaryBlue};
    color: #fff;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primaryYellow};
    outline-offset: 2px;
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



