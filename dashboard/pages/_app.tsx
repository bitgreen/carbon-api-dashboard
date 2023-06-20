import { AppProps } from "next/app";
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../components/Header";
import "../styles/globals.css";
import "@fontsource/roboto";

const theme = createTheme({
  palette: {
    primary: {
      main: "#C0FF00",
    },
    secondary: {
      main: "#ffffff",
    },
  },
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </div>
  );
};

export default App;
