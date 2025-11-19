import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import Container from "../components/Container";
import PageTitle from "../components/PageTitle";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Informe seu e-mail.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "E-mail inválido.";
    }

    if (!password) {
      newErrors.password = "Informe sua senha.";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);
      await login(email, password);
      navigate("/menu");
    } catch (err) {
      const msg =
        err?.response?.data?.error || "Não foi possível fazer login.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
  <Container>
    <LoginWrapper>
      <PageTitle>Entrar</PageTitle>

      <Form onSubmit={handleSubmit}>
        {serverError && <ServerError>{serverError}</ServerError>}

        <Field>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            $hasError={!!errors.email}
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            $hasError={!!errors.password}
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}
        </Field>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </SubmitButton>

        <HelperText>
          Ainda não tem conta?{" "}
          <LinkStyled to="/register">Criar conta</LinkStyled>
        </HelperText>
      </Form>
    </LoginWrapper>
  </Container>
);
}

export default Login;


// ||||||| estilos ||||||| //

const Form = styled.form`
  max-width: 370px;
  margin-top: 16px;
  width: 100%;
`;

const Field = styled.div`
  margin-bottom: 14px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.darkBlue};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 0.2px solid
    ${({ theme, $hasError }) =>
      $hasError ? "#d32f2f" : theme.colors.borderLight};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryBlue};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primaryBlue}22;
  }
`;

const ErrorText = styled.p`
  margin-top: 4px;
  font-size: 12px;
  color: #d32f2f;
`;

const ServerError = styled.div`
  margin-bottom: 12px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #ffebee;
  color: #c62828;
  font-size: 13px;
`;

const SubmitButton = styled.button`
  margin-top: 4px;
  width: 100%;
  padding: 10px 0;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.primaryBlue};
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;

  transition: background 0.2s ease, transform 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.darkBlue};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const HelperText = styled.p`
  margin-top: 10px;
  font-size: 13px;
`;

const LinkStyled = styled(Link)`
  color: ${({ theme }) => theme.colors.primaryBlue};
  font-weight: 600;
  

  &:hover {
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(50vh - 200px);
  padding: 50px 20px;
`;
