# Third-Party Libraries Documentation

## 1. Libraries Overview

The app relies on several third-party libraries to handle frontend, blockchain interactions, and UI components. Below is a detailed list of these libraries and their roles.

## 2. Frontend Libraries

### Next.js

- **Purpose:** React framework for building the app with server-side rendering (SSR) and static site generation (SSG).
- **Version:** Latest stable version.
- **Usage:** Handles routing, API routes, and overall app structure.
- **Documentation:** Next.js Docs

### shadcn/ui

- **Purpose:** A collection of reusable, accessible, and customizable UI components.
- **Version:** Latest stable version.
- **Usage:** Provides pre-built components like tables, sliders, and buttons.
- **Integration:** Used with Tailwind CSS for styling.
- **Documentation:** shadcn/ui Docs

### Tailwind CSS

- **Purpose:** Utility-first CSS framework for styling the app.
- **Version:** Latest stable version.
- **Usage:** Used for custom styling of components and layouts.
- **Integration:** Combined with `cn` from shadcn/ui for conditional class names.
- **Documentation:** Tailwind CSS Docs

## 3. Blockchain Libraries

### viem

- **Purpose:** Lightweight Ethereum client for interacting with smart contracts.
- **Version:** Latest stable version.
- **Usage:** Handles smart contract calls (e.g., fetching claimable NFTL).
- **Integration:** Used with wagmi for React hooks.
- **Documentation:** viem Docs

### wagmi

- **Purpose:** React hooks for Ethereum, simplifying wallet integration and contract interactions.
- **Version:** Latest stable version.
- **Usage:** Manages wallet connections and provides hooks for contract calls.
- **Integration:** Works seamlessly with viem.
- **Documentation:** wagmi Docs

### Alchemy

- **Purpose:** Ethereum development platform for interacting with the blockchain.
- **Usage:** Provides the RPC endpoint for smart contract calls.
- **Integration:** Used with viem to connect to the Ethereum network.
- **Documentation:** Alchemy Docs

## 4. API Libraries

### OpenSea API

- **Purpose:** Fetch NFT data for the Nifty Degen collection.
- **Usage:** Retrieves NFT listings, images, prices, and links.
- **Integration:** Accessed via Next.js API routes to hide the API key.
- **Documentation:** OpenSea API Docs

## 5. Utility Libraries

### date-fns

- **Purpose:** Modern date utility library for handling timestamps.
- **Usage:** Format timestamps for display (e.g., last refresh time).
- **Documentation:** date-fns Docs

### lodash

- **Purpose:** Utility library for simplifying array and object manipulations.
- **Usage:** Used for sorting, filtering, and pagination logic.
- **Documentation:** lodash Docs

## 6. Deployment Libraries

### Vercel

- **Purpose:** Platform for deploying and hosting the app.
- **Usage:** Handles CI/CD, automatic deployments, and scaling.
- **Integration:** Connected to the GitHub repository for seamless deployments.
- **Documentation:** Vercel Docs

## 7. Security Considerations

- **API Keys:** OpenSea API key is stored in environment variables and accessed via Next.js API routes to prevent client-side exposure.
- **Rate Limiting:** Implemented to prevent abuse of the OpenSea API and manual refresh button.
- **Error Handling:** Graceful handling of failed API and contract calls to ensure a smooth user experience.
