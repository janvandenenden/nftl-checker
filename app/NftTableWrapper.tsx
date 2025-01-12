"use client";

import { useAccumulatedNFTL } from "../hooks/useAccumulatedNFTL";
import NftTable from "./NftTable";
import { Listing, NFT } from "../types";
import Image from "next/image";
export default function NftTableWrapper({
  listings,
  nftlPrice,
  offers,
}: {
  listings: NFT[];
  nftlPrice: any;
  offers: any;
}) {
  const tokenIds = listings.map((nft) => Number(nft.tokenId));
  const { data, error, isLoading } = useAccumulatedNFTL(tokenIds);
  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Image src="/doge-dance.gif" alt="NFTL" width={200} height={200} />
        <p className="text-2xl font-bold">LOADING</p>
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  const enrichedNfts = listings.map((listing, index) => {
    return {
      ...listing,
      nftl:
        data?.[index]?.status === "success"
          ? Number((data[index].result as bigint) / BigInt(10 ** 18))
          : 0,
      nftlPrice:
        Number((data?.[index]?.result as bigint) / BigInt(10 ** 18)) *
        nftlPrice.data[0].prices[0].value,
      priceInUSD: listing.priceInETH * nftlPrice.data[1].prices[0].value,
      valueScore: (
        ((Number((data?.[index]?.result as bigint) / BigInt(10 ** 18)) *
          nftlPrice.data[0].prices[0].value) /
          (listing.priceInETH * nftlPrice.data[1].prices[0].value)) *
        100
      ).toFixed(1),
    };
  });

  return <NftTable data={enrichedNfts} />;
}
