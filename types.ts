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
