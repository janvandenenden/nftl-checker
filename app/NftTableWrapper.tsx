"use client";

import { useAccumulatedNFTL } from "../hooks/useAccumulatedNFTL";
import NftTable from "./NftTable";
import { NFT, ReservoirListing } from "../types";
import Image from "next/image";
export default function NftTableWrapper({
  nftlPrice,
  reservoirListings,
  reservoirCollectionOffers,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nftlPrice: any;
  reservoirListings: NFT[];
  reservoirCollectionOffers: ReservoirListing[];
}) {
  const reservoirTokenIds = reservoirListings.map((nft) => Number(nft.tokenId));
  const validCollectionOffers = reservoirCollectionOffers
    ?.filter((offer) => {
      const sixHoursFromNow = Date.now() / 1000 + 6 * 60 * 60;
      return offer.validUntil > sixHoursFromNow;
    })
    .map((offer) => ({
      priceInETH: offer.price.netAmount.native,
      priceInUSD: offer.price.netAmount.usd,
      source: offer.source.name,
      expiration: new Date(offer.validUntil * 1000).toLocaleString(),
    }))
    .sort((a, b) => b.priceInETH - a.priceInETH);

  const highestCollectionOfferInUSD = Math.max(
    ...validCollectionOffers.map(
      (collectionOffer) => collectionOffer.priceInUSD
    )
  );
  const { data, error, isLoading } = useAccumulatedNFTL(reservoirTokenIds);
  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Image src="/doge-dance.gif" alt="NFTL" width={200} height={200} />
        <p className="text-2xl font-bold">LOADING</p>
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  const enrichedNfts = reservoirListings.map((listing, index) => {
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
      valueScore: (data?.[index]?.result === BigInt(0)
        ? 0
        : ((Number((data?.[index]?.result as bigint) / BigInt(10 ** 18)) *
            nftlPrice.data[0].prices[0].value +
            highestCollectionOfferInUSD) /
            (listing.priceInETH * nftlPrice.data[1].prices[0].value)) *
          100
      ).toFixed(1),
    };
  });

  return (
    <NftTable
      data={enrichedNfts}
      highestCollectionOfferInUSD={highestCollectionOfferInUSD}
    />
  );
}
