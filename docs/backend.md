# Backend Documentation

## 1. Overview

The app's backend logic is handled on the frontend using Next.js API routes and blockchain interactions. There is no traditional backend server or database. Instead, the app relies on:

- **OpenSea API:** To fetch NFT data.
- **Alchemy:** To interact with the Ethereum blockchain.
- **Smart Contract Calls:** To calculate claimable NFTL amounts.

## 2. API Routes (Next.js)

### Purpose

Next.js API routes will act as a proxy to handle sensitive operations (e.g., OpenSea API key usage) and reduce client-side exposure.

### Routes

1. `/api/nfts`
   - **Purpose:** Fetch NFT data from OpenSea API.
   - **Method:** `GET`
   - **Parameters:** None
   - **Response:**

```json
[
  {
    "id": "123",
    "image": "https://example.com/nft-image.png",
    "price": "0.5 ETH",
    "tribe": "Tribe A",
    "openseaLink": "https://opensea.io/assets/123",
    "blurLink": "https://blur.io/assets/123"
  }
]
```

2. `/api/claimable-nftl`
   - **Purpose:** Fetch claimable NFTL for a specific NFT using a smart contract call.
   - **Method:** `POST`
   - **Parameters:**

```json
{
  "nftId": "123"
}
```

- **Response:**

```json
{
  "nftId": "123",
  "claimableNFTL": "100"
}
```

## 3. Blockchain Interaction

### Libraries

- **viem:** A lightweight Ethereum client for interacting with smart contracts.
- **wagmi:** React hooks for Ethereum, simplifying wallet integration and contract calls.

### Smart Contract Call

- **Function:** `accumulated`
- **ABI:**

```json
[
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenIndex", "type": "uint256" }
    ],
    "name": "accumulated",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
]
```

- **Implementation:**

```javascript
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.ALCHEMY_RPC_URL),
});

const claimableNFTL = await client.readContract({
  address: "0xNFTLContractAddress",
  abi: NFTL_ABI,
  functionName: "accumulated",
  args: [nftId],
});
```

## 4. Rate Limiting

- **Manual Refresh:** Implement a simple rate limit (e.g., one refresh every 10 seconds) using a client-side timestamp check.
- **Example:**

```javascript
const [lastRefresh, setLastRefresh] = useState(0);

const handleRefresh = () => {
  const now = Date.now();
  if (now - lastRefresh < 10000) {
    alert("Please wait 10 seconds before refreshing again.");
    return;
  }
  setLastRefresh(now);
  fetchData();
};
```

## 5. Error Handling

- **OpenSea API Errors:** Display user-friendly messages for rate limits or failed requests.
- **Smart Contract Errors:** Handle failed contract calls gracefully (e.g., invalid NFT ID, network issues).
- **Example:**

```javascript
try {
  const data = await fetchOpenSeaData();
} catch (error) {
  console.error("Failed to fetch OpenSea data:", error);
  alert("Failed to fetch NFT data. Please try again later.");
}
```
