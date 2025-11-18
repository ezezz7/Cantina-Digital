import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

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
    </>
  );
}

export default App;
