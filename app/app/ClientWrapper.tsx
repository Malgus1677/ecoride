"use client";

import Navbar from "./components/navbar";
import { SearchProvider } from "./context/searchContext";
import { CovoiturageProvider } from "./context/convoiturageContext";
import { AuthProvider } from "./context/authContext";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
   <AuthProvider>
     <CovoiturageProvider>
      <SearchProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
      </SearchProvider>
    </CovoiturageProvider>
   </AuthProvider>
  );
}
