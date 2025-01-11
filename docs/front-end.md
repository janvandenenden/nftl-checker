# Frontend Documentation

## 1. Tech Stack

- **Framework:** Next.js (App Router)
- **UI Library:** shadcn/ui with Tailwind CSS (via `cn` for styling)
- **Blockchain Interaction:** viem and wagmi
- **API Integration:** OpenSea API and Alchemy for blockchain data
- **Deployment:** Vercel

## 2. UI Components

### Table Component

- **Purpose:** Display NFTs with sorting, filtering, and pagination.
- **Columns:**
  - **NFT ID:** Unique identifier for the NFT.
  - **Image:** Thumbnail of the NFT.
  - **Claimable NFTL:** Amount of NFTL the NFT can claim (fetched via smart contract call).
  - **Price:** Listed price on OpenSea.
  - **Tribe:** Category or trait of the NFT.
  - **Links:** Buttons to OpenSea and Blur for purchasing the NFT.
- **Features:**
  - **Sorting:** By claimable NFTL and price.
  - **Filtering:** Sliders for claimable NFTL and price ranges.
  - **Pagination:** Limit the number of NFTs displayed per page.

### Slider Filters

- **Purpose:** Allow users to filter NFTs by claimable NFTL and price ranges.
- **Implementation:** Use shadcn/ui's slider component with Tailwind CSS styling.

### Refresh Button

- **Purpose:** Allow users to manually refresh the data.
- **Implementation:** Button with a simple rate limit (one refresh every 10 seconds).

## 3. State Management

- **Local State:**
  - **Filters:** Store filter values (claimable NFTL range, price range).
  - **Pagination:** Track current page and items per page.
  - **Sorting:** Track the current sort column and direction.
- **Global State:**
  - **NFT Data:** Store fetched NFT data from OpenSea API and smart contract calls.
  - **Loading State:** Track loading states for API calls and smart contract interactions.

## 4. API Integration

### OpenSea API

- **Endpoint:** Fetch NFTs from the Nifty Degen collection.
- **Data Structure:** Extract NFT ID, image, price, and tribe.
- **Rate Limiting:** Ensure compliance with OpenSea API rate limits.

### Smart Contract Call

- **Function:** `accumulated` (from the NFTL smart contract).
- **Input:** NFT ID.
- **Output:** Claimable NFTL amount.
- **Library:** Use `viem` and `wagmi` to interact with the Ethereum blockchain.

## 5. Data Fetching Logic

- **Automatic Refresh:** Fetch data every 10 minutes using `setInterval`.
- **Manual Refresh:** Fetch data on button click with rate limiting.
- **Caching:** Temporarily cache fetched data to reduce API calls.

## 6. Error Handling

- **API Errors:** Display user-friendly messages for failed API calls.
- **Smart Contract Errors:** Handle failed contract calls gracefully.
- **Rate Limiting:** Prevent spamming of the manual refresh button.

## 7. Responsive Design

- **Breakpoints:** Ensure the table and filters are usable on both desktop and mobile devices.
- **Styling:** Use Tailwind CSS for responsive layouts and shadcn/ui for consistent components.

## Next Steps

1. **Backend Documentation:** Since there's no database or complex backend, this will focus on API communication and smart contract interaction.
2. **Third-Party Libraries Documentation:** List and describe the libraries used (e.g., viem, wagmi, shadcn/ui).
