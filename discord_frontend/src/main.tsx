import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

import HomePage from "./pages/HomePage.tsx";
import RootLayout from "./layouts/RootLayout.tsx";
import CreateServerModal from "./components/modals/CreateServerModal.tsx";
import { ApolloProvider } from '@apollo/client';
import client from "./apolloClient.ts";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const RouterComponent = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="" element={<RootLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <CreateServerModal />
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <MantineProvider>
        <ClerkProvider
          publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
          // navigate={(to) => navigate(to)} // Not need for the new version of clerk
        >
          <BrowserRouter>
            <RouterComponent />
          </BrowserRouter>
        </ClerkProvider>
      </MantineProvider>
    </ApolloProvider>
  </StrictMode>
);

export default RouterComponent;
