import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

// Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      
  const [token, setToken] = useState(null);   
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

  // função de login
  async function login(email, password) {
    const response = await axios.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    // salvar no estado
    setToken(token);
    setUser(user);

    //salvar no localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    //  token no axios
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return user;
  }

  // function de logout!
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete axios.defaults.headers.common["Authorization"];
  }
  // function de update user!
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

// hook bem conveniente
export function useAuth() {
  return useContext(AuthContext);
}
