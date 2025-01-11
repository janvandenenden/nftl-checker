# Product Requirements Document (PRD)

## 1. App Overview

- **Name:** NFTL Claim Checker
- **Description:** A website that allows users to check how much NFTL (ERC20 token) NFTs from the Nifty Degen collection (listed on OpenSea) can claim. The app displays a paginated table with sorting and filtering options, including links to OpenSea and Blur for purchasing NFTs.
- **Tagline:** "Check claimable NFTL for Nifty Degen NFTs in seconds."

## 2. Target Audience

- **Primary Users:** NFT collectors and traders interested in the Nifty Degen collection.
- **User Goals:**
  - Quickly check claimable NFTL amounts for listed NFTs.
  - Compare NFTs based on price, claimable NFTL, and tribe.
  - Easily navigate to OpenSea or Blur to purchase NFTs.
- **Pain Points:**
  - Manually calculating claimable NFTL is time-consuming.
  - No centralized tool to compare NFTs based on claimable NFTL and price.

## 3. Key Features

1. **NFT Table:**
   - Displays NFT ID, image, claimable NFTL, price, tribe, and links to OpenSea and Blur.
   - Supports pagination, sorting (by claimable NFTL and price), and filtering (sliders for claimable NFTL and price ranges).
2. **Data Fetching:**
   - Fetches NFT data from OpenSea API.
   - Calculates claimable NFTL using a smart contract call (`accumulated` function).
3. **Refresh Mechanism:**
   - Automatic refresh every 10 minutes.
   - Manual refresh with a simple rate limit (one refresh every 10 seconds).
4. **No Authentication:**
   - Accessible to everyone without signing in.
5. **Responsive Design:**
   - Optimized for desktop and mobile devices.

## 4. Success Metrics

- **User Engagement:** Number of daily active users (DAU) and page views.
- **Performance:** Average page load time and API response time.
- **Adoption:** Number of users who click through to OpenSea or Blur to purchase NFTs.

## 5. Assumptions and Risks

- **Assumptions:**
  - OpenSea API will provide accurate and up-to-date NFT listings.
  - The smart contract for calculating claimable NFTL will remain stable and accessible.
- **Risks:**
  - OpenSea API rate limits could impact data fetching.
  - Smart contract calls may introduce latency.
  - Users may attempt to spam the manual refresh button.

## 6. Project structure

├── README.md
├── app
│ ├── favicon.ico
│ ├── fonts
│ │ ├── GeistMonoVF.woff
│ │ └── GeistVF.woff
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
├── components
│ └── ui
│ └── button.tsx
├── components.json
├── docs
│ ├── backend.md
│ ├── front-end.md
│ ├── prd.md
│ └── third-party-libraries.md
├── lib
│ └── utils.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
