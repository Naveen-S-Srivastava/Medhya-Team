// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// import { StrictMode } from 'react'
//   import { createRoot } from 'react-dom/client'
//   import './index.css'
//   import App from './App.jsx'
//   import { ClerkProvider } from '@clerk/clerk-react'

//   // Import your Publishable Key
//   const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

//   if (!PUBLISHABLE_KEY) {
//     throw new Error('Add your Clerk Publishable Key to the .env file')
//   }

//   createRoot(document.getElementById('root')).render(
//     <StrictMode>
//       <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
//         <App />
//       </ClerkProvider>
//     </StrictMode>,
//   )




// import React from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ClerkProvider } from "@clerk/clerk-react";
// import App from "./App";
// import Home from "./pages/Home";
// import SignupPage from "./pages/SignupPage";
// import LoginPage from "./pages/LoginPage";
// import Dashboard from "./pages/Dashboard";
// import "./index.css";

// const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// if (!publishableKey) throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env");

// createRoot(document.getElementById("root")).render(
//   <ClerkProvider publishableKey={publishableKey}>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </BrowserRouter>
//   </ClerkProvider>
// );



import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={publishableKey}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
