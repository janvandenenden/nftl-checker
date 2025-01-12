import Layout from "./layout";
import {
  fetchOpenSeaListings,
  fetchNFTL,
  fetchOpenSeaCollectionOffers,
} from "../lib/utils";
import NftTableWrapper from "./NftTableWrapper";
export default async function HomePage() {
  const listings = await fetchOpenSeaListings();
  const nftlPrice = await fetchNFTL();
  const offers = await fetchOpenSeaCollectionOffers();
  return (
    <Layout>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <NftTableWrapper
          listings={listings}
          nftlPrice={nftlPrice}
          offers={offers}
        />
      </div>
    </Layout>
  );
}
