import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Listing, NFT } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchOpenSeaListings(next?: string): Promise<NFT[]> {
  const apiKey = process.env.NEXT_PUBLIC_OPENSEA;
  if (!apiKey) {
    throw new Error("OpenSea API key is not defined");
  }

  try {
    const url = `https://api.opensea.io/api/v2/listings/collection/${
      process.env.NEXT_PUBLIC_COLLECTION_SLUG
    }/all?limit=100${next ? `&next=${next}` : ""}`;
    const response = await fetch(url, {
      headers: { "X-API-KEY": apiKey as string },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from OpenSea");
    }
    const data = await response.json();
    const listings = data.listings.map((listing: Listing) => ({
      priceInETH:
        listing.price.current.value /
        Math.pow(10, listing.price.current.decimals),
      tokenId: listing.protocol_data.parameters.offer[0].identifierOrCriteria,
      nftl: 0,
      openseaLink: `https://opensea.io/assets/ethereum/0x986aea67c7d6a15036e18678065eb663fc5be883/${listing.protocol_data.parameters.offer[0].identifierOrCriteria}`,
      blurLink: `https://blur.io/eth/asset/0x986aea67c7d6a15036e18678065eb663fc5be883/${listing.protocol_data.parameters.offer[0].identifierOrCriteria}`,
      imageUrl: `https://app.niftyleague.com/img/degens/nfts/${listing.protocol_data.parameters.offer[0].identifierOrCriteria}.webp`,
    }));

    if (data.next) {
      const nextListings = await fetchOpenSeaListings(data.next);
      return [...listings, ...nextListings];
    }

    return listings;
  } catch (error) {
    console.error("Error fetching OpenSea listings:", error);
    return [];
  }
}

export async function fetchNFTL(): Promise<number> {
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
  if (!apiKey) {
    throw new Error("Alchemy API key is not defined");
  }
  const options = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      addresses: [
        {
          network: "eth-mainnet",
          address: "0x3c8D2FCE49906e11e71cB16Fa0fFeB2B16C29638",
        },
        {
          network: "eth-mainnet",
          address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
      ],
    }),
  };
  const response = await fetch(
    `https://api.g.alchemy.com/prices/v1/${apiKey}/tokens/by-address`,
    options
  );
  const data = await response.json();
  return data;
}

export async function fetchOpenSeaCollectionOffers(
  next?: string
): Promise<NFT[]> {
  const apiKey = process.env.NEXT_PUBLIC_OPENSEA;
  if (!apiKey) {
    throw new Error("OpenSea API key is not defined");
  }
  try {
    const url = `https://api.opensea.io/api/v2/offers/collection/${process.env.NEXT_PUBLIC_COLLECTION_SLUG}`;
    const response = await fetch(url, {
      headers: { "X-API-KEY": apiKey as string },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data from OpenSea");
    }
    const data = await response.json();
    const validOffers = data.offers.filter(
      (offer: any) =>
        offer.criteria.trait === null &&
        offer.criteria.encoded_token_ids === "*"
    );
    const offers = validOffers.map((offer: any) => ({
      priceInWETH:
        Number(offer.price.value) / Math.pow(10, offer.price.decimals),
      validUntil: new Date(
        Number(offer.protocol_data.parameters.endTime) * 1000
      ),
    }));
    return offers;
  } catch (error) {
    console.error("Error fetching OpenSea listings:", error);
    return [];
  }
}
