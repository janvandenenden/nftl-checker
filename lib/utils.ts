import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Listing, NFT, ReservoirListing, OpenSeaOffer } from "../types";

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

export async function fetchReservoirListings(): Promise<NFT[]> {
  const apiKey = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY;
  if (!apiKey) {
    throw new Error("Reservoir API key is not defined");
  }
  const options = {
    method: "GET",
    headers: { accept: "*/*", "x-api-key": apiKey },
  };

  const response = await fetch(
    `https://api.reservoir.tools/orders/asks/v5?contracts=${process.env.NEXT_PUBLIC_DEGEN_CONTRACT_ADDRESS}&limit=1000`,
    options
  );
  const data = await response.json();

  const listings = Array.isArray(data.orders)
    ? data.orders
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((order: any) => order.status === "active")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((order: any) => order.side === "sell")
        .map((listing: ReservoirListing) => {
          const tokenId = listing.tokenSetId?.split(":")[2] ?? "0";
          return {
            priceInETH: listing.price?.amount?.native ?? 0,
            tokenId,
            nftl: 0,
            openseaLink: `https://opensea.io/assets/ethereum/0x986aea67c7d6a15036e18678065eb663fc5be883/${tokenId}`,
            blurLink: `https://blur.io/eth/asset/0x986aea67c7d6a15036e18678065eb663fc5be883/${tokenId}`,
            imageUrl: `https://app.niftyleague.com/img/degens/nfts/${tokenId}.webp`,
          };
        })
    : [];

  const uniqueListings = Object.values(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listings?.reduce((acc: { [key: string]: NFT }, curr: any) => {
      if (
        !acc[curr.tokenId] ||
        acc[curr.tokenId].priceInETH > curr.priceInETH
      ) {
        acc[curr.tokenId] = curr;
      }
      return acc;
    }, {})
  );

  return uniqueListings as NFT[];
}

export async function fetchReservoirCollectionOffers(
  next?: string
): Promise<ReservoirListing[]> {
  const apiKey = process.env.NEXT_PUBLIC_RESERVOIR_API_KEY;
  if (!apiKey) {
    throw new Error("Reservoir API key is not defined");
  }
  const options = {
    method: "GET",
    headers: { accept: "*/*", "x-api-key": apiKey },
  };
  const response = await fetch(
    `https://api.reservoir.tools/collections/${
      process.env.NEXT_PUBLIC_DEGEN_CONTRACT_ADDRESS
    }/bids/v1?type=collection${next ? `&continuation=${next}` : ""}`,
    options
  );
  const data = await response.json();

  if (data.continuation) {
    const nextOrders = await fetchReservoirCollectionOffers(data.continuation);
    return [...data.orders, ...nextOrders];
  }
  return data.orders;
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

export async function fetchOpenSeaCollectionOffers(): Promise<NFT[]> {
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
    const validOffers = data.offers?.filter(
      (offer: OpenSeaOffer) =>
        offer.criteria.trait === null &&
        offer.criteria.encoded_token_ids === "*"
    );
    const offers = validOffers.map((offer: OpenSeaOffer) => ({
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
