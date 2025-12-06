import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import { ConnectionProvider } from "./context/connected_context";
import { LoadingProvider } from "./context/LoadingContext";
import { ToastContainer, Slide } from "react-toastify";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { CustomConfig } from "./config";

if (import.meta?.env?.PROD) {
  const noop = () => {};
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.warn = noop;
  console.error = noop;
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <LoadingProvider>
      <ConnectionProvider>
        <WagmiProvider config={CustomConfig}>
          <QueryClientProvider client={queryClient}>
            <App />
            <ToastContainer
              position="top-center"
              hideProgressBar={true}
              transition={Slide}
              autoClose={1200}
              theme="colored"
              closeButton={false}
            />
          </QueryClientProvider>
        </WagmiProvider>
      </ConnectionProvider>
    </LoadingProvider>
  </React.StrictMode>
);
