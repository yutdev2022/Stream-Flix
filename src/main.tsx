import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { TooltipProvider } from "./components/ui/tooltip";

import { ThemeProvider } from "./components/layout/theme-provider";
import "./index.css";
import HomePage from "./pages";
import BrowsePage from "./pages/browse";
import ContentDetailPage from "./pages/content/[id]";
import WatchPage from "./pages/watch/[id]";
import WatchlistPage from "./pages/watchlist";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import AdminPage from "./pages/admin";
import ProfilePage from "./pages/profile";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/content/:id" element={<ContentDetailPage />} />
            <Route path="/watch/:id" element={<WatchPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);