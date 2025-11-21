import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import Container from "../components/Container";
import PageTitle from "../components/PageTitle";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  function validate() {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Informe seu nome.";
    }

    if (!email) {
      newErrors.email = "Informe seu e-mail.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "E-mail inválido.";
    }

    if (!password) {
      newErrors.password = "Informe uma senha.";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirme a senha.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "As senhas não conferem.";
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

      await axios.post("/auth/register", {
        name,
        email,
        password,
        studentId: studentId || null,
      });

      setToastVisible(true);

      setTimeout(() => {
        setToastVisible(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Erro no registro:", err);
      const msg = err?.response?.data?.error || "Não foi possível criar a conta.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <RegisterWrapper>
        <PageTitle>Criar conta</PageTitle>

        <Form onSubmit={handleSubmit}>
          {serverError && <ServerError>{serverError}</ServerError>}

          <Field>
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              $hasError={!!errors.name}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </Field>

          <Field>
            <Label htmlFor="studentId">Matrícula (opcional)</Label>
            <Input
              id="studentId"
              type="text"
              placeholder="Ex: 2025001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
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
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              $hasError={!!errors.password}
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </Field>

          <Field>
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              $hasError={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <ErrorText>{errors.confirmPassword}</ErrorText>
            )}
          </Field>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </SubmitButton>

          <HelperText>
            Já tem uma conta?{" "}
            <LinkStyled to="/login">Entrar</LinkStyled>
          </HelperText>
        </Form>

        {toastVisible && (
          <Toast>
            Conta criada com sucesso! Redirecionando para login...
          </Toast>
        )}
      </RegisterWrapper>
    </Container>
  );
}

export default Register;

// |||||||| estilos |||||||| //

const RegisterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
`;

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
  border: 1px solid
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

  animation: fadeInOut 2s ease forwards;

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