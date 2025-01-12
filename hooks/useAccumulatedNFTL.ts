"use client";

import { useReadContracts } from "wagmi";
import { abi } from "../abi";
import { Abi } from "viem";

export function useAccumulatedNFTL(tokenIndexes: number[]) {
  const result = useReadContracts({
    contracts: tokenIndexes.map((tokenIndex) => ({
      abi: abi as Abi,
      address: process.env.NEXT_PUBLIC_NFTL_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "accumulated",
      args: [tokenIndex],
    })),
  });
  return result;
}
