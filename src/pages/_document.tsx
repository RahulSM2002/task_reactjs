import { Html, Head, Main, NextScript } from "next/document";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ToastContainer } from "react-toastify";
import { StyledEngineProvider } from "@mui/material/styles";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <script src="https://apis.google.com/js/api.js"></script>
      <body>
        <StyledEngineProvider injectFirst>
          <AppRouterCacheProvider>
            <ToastContainer />
            <Main />
            <NextScript />
          </AppRouterCacheProvider>
        </StyledEngineProvider>
      </body>
    </Html>
  );
}
