export interface NFT {
  tokenId: string;
  priceInETH: number;
  nftl: number;
  openseaLink: string;
  blurLink: string;
  imageUrl: string;
  nftlPrice: number;
  priceInUSD: number;
}

export interface Listing {
  order_hash: string;
  chain: string;
  type: string;
  price: {
    current: {
      value: number;
      decimals: number;
    };
  };
  protocol_data: {
    parameters: {
      offer: Array<{
        identifierOrCriteria: string;
      }>;
    };
  };
  protocol_address: string;
}

export interface ReservoirListing {
  id: string;
  kind: string;
  side: "sell" | "buy";
  status: "active" | "inactive" | "expired" | "cancelled" | "filled";
  tokenSetId: string;
  tokenSetSchemaHash: string;
  contract: string;
  contractKind: "erc721" | "erc1155";
  maker: string;
  taker: string;
  price: {
    currency: {
      contract: string;
      name: string;
      symbol: string;
      decimals: number;
    };
    amount: {
      raw: string;
      decimal: number;
      usd: number;
      native: number;
    };
    netAmount: {
      raw: string;
      decimal: number;
      usd: number;
      native: number;
    };
  };
  validFrom: number;
  validUntil: number;
  quantityFilled: number;
  quantityRemaining: number;
  dynamicPricing: null | object;
  criteria: {
    kind: string;
    data: object;
  };
  source: {
    id: string;
    domain: string;
    name: string;
    icon: string;
    url: string;
  };
  feeBps: number;
  feeBreakdown: Array<object>;
  expiration: number;
  isReservoir: boolean | null;
  isDynamic: boolean;
  createdAt: string;
  updatedAt: string;
  originatedAt: string;
}

export interface OpenSeaOffer {
  criteria: {
    trait: string | null;
    encoded_token_ids: string;
  };
  price: {
    value: string;
    decimals: number;
  };
  protocol_data: {
    parameters: {
      endTime: string;
    };
  };
}
