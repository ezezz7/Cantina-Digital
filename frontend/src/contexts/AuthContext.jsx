import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

// Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // dados do usuário
  const [token, setToken] = useState(null);    // JWT
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  // Função de login
  async function login(email, password) {
    const response = await axios.post("http://localhost:3333/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    // Salvar no estado
    setToken(token);
    setUser(user);

    // Salvar no localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    //  token no axios
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return user;
  }

  // Função de logout
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete axios.defaults.headers.common["Authorization"];
  }
  // Função de update user!
  function updateUser(partialUser) {
  setUser((prev) => {
    if (!prev) return prev;

    const newUser = { ...prev, ...partialUser };
    localStorage.setItem("user", JSON.stringify(newUser));
    return newUser;
    });
  }


  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook bem conveniente
export function useAuth() {
  return useContext(AuthContext);
}
