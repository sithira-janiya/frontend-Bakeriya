import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import App from "./App.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";
import "./styles/animations.css";

// Google OAuth client ID (from Google Cloud Console). If unset, "Sign in with
// Google" buttons render disabled but the rest of the app works normally.
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <ThemeProvider>
            <LanguageProvider>
              <StoreProvider>
                <ToastProvider>
                  <App />
                </ToastProvider>
              </StoreProvider>
            </LanguageProvider>
          </ThemeProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
);
