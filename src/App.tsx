import React from "react";
import { ThemeProvider, DefaultTheme } from "styled-components";

import usePersistedState from "./utils/usePersistedState";

import GlobalStyle from "./styles/global";

import light from "./styles/themes/light";
import dark from "./styles/themes/dark";

import HomePage from "./Pages/Home";
import Header from "./components/Header";

function App() {
  const [theme, setTheme] = usePersistedState<DefaultTheme>("theme", light);

  const toggleTheme = () => {
    setTheme(theme.title === "light" ? dark : light);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header toggleTheme={toggleTheme} />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
