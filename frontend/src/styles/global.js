import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
  margin: 0;
  padding: 0;
  background: ${({ theme }) => theme.colors.pageBackground};
  font-family: "Poppins", sans-serif;
  color: ${({ theme }) => theme.colors.textDark};
}


  button {
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
