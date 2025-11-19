import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";
import styled from "styled-components";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";

import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <>
      <Background>
        <Navbar />

        <MainContent>
          <Routes>
            <Route path="/" element={<Navigate to="/menu" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route
              path="/meus-pedidos"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
          </Routes>
        </MainContent>

        <Footer />
      </Background>
    </>
  );
}
const Background = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1; 
`;
export default App;
