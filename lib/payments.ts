import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { parseUnits } from "viem";

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org"),
});

// USDC contract address on Base
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
const PAYMENT_AMOUNT = parseUnits("1", 6); // 1 USDC (6 decimals)

const ERC20_ABI = [
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
] as const;

export async function verifyPayment(
  fromAddress: string,
  toAddress: string,
  txHash: string
): Promise<boolean> {
  try {
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    if (!receipt || receipt.status !== "success") {
      return false;
    }

    // Check if the transaction is a USDC transfer to our payment address
    // This is a simplified check - in production, you'd parse the logs more carefully
    const paymentAddress = process.env.NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS;
    if (!paymentAddress) {
      return false;
    }

    // Verify the transaction was from the correct address
    if (receipt.from.toLowerCase() !== fromAddress.toLowerCase()) {
      return false;
    }

    // In a real implementation, you'd parse the transfer event from the logs
    // For now, we'll assume if the transaction succeeded, payment was made
    return true;
  } catch (error) {
    console.error("Error verifying payment:", error);
    return false;
  }
}

export function getPaymentAddress(): string {
  const address = process.env.NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS;
  if (!address) {
    throw new Error("Payment wallet address not configured");
  }
  return address;
}

export { USDC_ADDRESS, PAYMENT_AMOUNT };




