### Step-by-Step Plan for Building the **NFTL Claim Checker** App

This step-by-step guide is designed for an AI developer working iteratively and focusing on a minimal viable product (MVP) first. Testing functionality is prioritized before adding the UI.

---

### **Phase 1: Project Setup and Initial Commit**

- **Objective:** Set up the project structure and prepare the environment.

1. Create a new **Next.js 14** project using the App Router (`npx create-next-app@latest`).
2. Initialize **Tailwind CSS** and configure it (`npx tailwindcss init`).
3. Install core dependencies:
   ```bash
   npm install next react react-dom tailwindcss shadcn-ui viem wagmi date-fns lodash
   ```
4. Configure **shadcn/ui** (`npx shadcn init`) and Tailwind.
5. Set up **Git version control** and make the **first commit**.

---

### **Phase 2: Define Core Smart Contract Interaction (Backend Functionality)**

- **Objective:** Test the core functionality for retrieving claimable NFTL from the smart contract before building the UI.

1. Implement `/api/claimable-nftl` route in `pages/api/claimable-nftl.ts`.
2. Use `viem` and `wagmi` to fetch claimable NFTL from the smart contract.
3. **Test:** Confirm that calling the endpoint with an NFT ID returns the correct claimable NFTL amount.
4. **Commit:** After successful test, commit changes with the message: `"feat: added smart contract interaction endpoint"`

```const abi = [
  {
    inputs: [{ internalType: "uint256", name: "tokenIndex", type: "uint256" }],
    name: "accumulated",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
```

---

### **Phase 3: Fetch NFT Data from OpenSea API**

- **Objective:** Implement data fetching from OpenSea and prepare the API route.

1. Implement `/api/nfts` route to fetch NFT data from OpenSea API.
2. Ensure the route fetches NFT ID, image, price, tribe, and marketplace links.
3. **Test:** Verify data is fetched correctly and rate-limited.
4. **Commit:** `"feat: added OpenSea NFT data endpoint"`

```async function fetchListings(cursor: string | null) {
    let url = `https://api.opensea.io/api/v2/listings/collection/${collectionSlug}/all?limit=100`;
    if (cursor) {
      url += `&next=${cursor}`;
    }

    const response = await fetch(url, {
      headers: { "X-API-KEY": apiKey as string },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from OpenSea");
    }

    const data = await response.json();
    const processedListings = data.listings.map((listing: any) => ({
      priceInETH:
        listing.price.current.value /
        Math.pow(10, listing.price.current.decimals),
      tokenId: listing.protocol_data.parameters.offer[0].identifierOrCriteria,
    }));

    listings = listings.concat(processedListings);
    if (data.next) {
      await fetchListings(data.next);
    }
  }
```

---

### **Phase 4: Implement Core Data Fetch Logic (No UI Yet)**

- **Objective:** Fetch NFT data and claimable NFTL without UI.

1. Create a **data service** (`lib/fetchData.ts`) for reusable data fetching logic.
2. Implement fetching both **NFT data** and **claimable NFTL** in sequence.
3. Print results in the console for testing.
4. **Commit:** `"feat: added combined data fetching logic"`

---

### **Phase 5: Build Core UI Components (Table + Filters)**

- **Objective:** Start building the frontend with essential components.

1. **Table Component:**
   - Columns: NFT ID, Image, Claimable NFTL, Price, Tribe, Links.
   - Sorting and pagination logic using **lodash**.
2. **Filter Component:**
   - Slider for filtering **claimable NFTL** and **price**.
3. **Refresh Button:**
   - Add rate limiting with a simple timestamp check (`date-fns`).
4. **Test:** Ensure the components render correctly with mock data.
5. **Commit:** `"feat: added core UI components"`

---

### **Phase 6: Connect UI to API (Functional MVP)**

- **Objective:** Connect the frontend components to the API for dynamic data.

1. Update the **Table Component** to fetch data from `/api/nfts`.
2. Implement logic to call `/api/claimable-nftl` for each NFT.
3. **Test:** Verify full data flow from API call to UI rendering.
4. **Commit:** `"feat: connected frontend to API"`

---

### **Phase 7: Optimize Data Handling and Performance**

- **Objective:** Minimize unnecessary API calls and optimize performance.

1. **Caching:** Implement temporary in-memory caching for fetched data.
2. **Rate Limiting:** Ensure manual refresh logic limits the rate of API calls.
3. **Test:** Verify performance improvements and rate limiting.
4. **Commit:** `"chore: optimized data fetching and performance"`

---

### **Phase 8: Error Handling and UX Improvements**

- **Objective:** Ensure a smooth user experience with clear error messages.

1. Add error messages for:
   - Failed API requests (OpenSea or Smart Contract).
   - Invalid NFT IDs.
2. Display loading states during API calls.
3. **Test:** Simulate errors and verify handling.
4. **Commit:** `"fix: improved error handling and loading states"`

---

### **Phase 9: Mobile Responsiveness and Styling**

- **Objective:** Ensure the app works well on both desktop and mobile devices.

1. Improve mobile responsiveness using **Tailwind breakpoints**.
2. Adjust layout for smaller screens.
3. **Commit:** `"style: improved mobile responsiveness"`

---

### **Phase 10: Final Testing and Pre-Launch Checklist**

- **Objective:** Confirm everything is functional and production-ready.

1. Perform final manual testing:
   - Check NFT data loading.
   - Confirm smart contract calls.
   - Verify sorting, filtering, and rate limiting.
2. Run performance audits (`Lighthouse` in Chrome).
3. **Commit:** `"test: final testing and performance optimization"`

---

### **Phase 11: Deployment on Vercel**

- **Objective:** Deploy the production app.

1. Link the project to **Vercel**.
2. Deploy the app using the Vercel CLI or web UI.
3. Verify the live URL works correctly.
4. **Commit:** `"chore: deployed to Vercel"`

---

### **Phase 12: Post-Launch Enhancements**

- **Objective:** Incrementally improve the app after the MVP.

1. **Add Wallet Integration**: Using **wagmi** for wallet connections.
2. **Real-Time Updates:** Add WebSocket support for real-time claimable NFTL updates.
3. **Commit Notifications:** Automate reminders for frequent commits using **Husky**.

---

This plan ensures the project is built iteratively with clear milestones and functional checkpoints at every stage.
