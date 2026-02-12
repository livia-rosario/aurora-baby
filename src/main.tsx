import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexClientProvider } from "./components/ConvexClientProvider";

// Configuração do Umami Analytics
const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

if (analyticsEndpoint && analyticsWebsiteId) {
  const script = document.createElement("script");
  script.defer = true;
  script.src = `${analyticsEndpoint}/umami`;
  script.dataset.websiteId = analyticsWebsiteId;
  document.head.appendChild(script);
}

// Inicialização do App com Convex
createRoot(document.getElementById("root")!).render(
  <ConvexClientProvider>
    <App />
  </ConvexClientProvider>
);
