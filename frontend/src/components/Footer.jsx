import styled from "styled-components";

export default function Footer() {
  return (
    <Wrapper>
      <Container>
        <LogoPensar
          src="src/assets/grupo-pensar-logo.png"
        />
        <DevText> Desenvolvido por José Vítor</DevText>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  background: ${({ theme }) => theme.colors.primaryBlue};
  padding: 5px 0;
  margin-top: 40px;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 6px;
  }
`;
const LogoPensar = styled.img`
  height: 90px;
  opacity: 1;
`;

const DevText = styled.p`
  color: white;
  font-size: 14px;
  margin: 0;
  opacity: 1;
  white-space: nowrap;
`;