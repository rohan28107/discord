import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react"
import { Routes, useNavigate } from "react-router-dom"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
}

const RouterComponent = () => {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={process.env.VITE_CLERK_PUBLISHABLE_KEY} 
      navigate={(to) => navigate(to)}
    >
      <Routes>
        
      </Routes>
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </StrictMode>,
)
