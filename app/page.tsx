import Layout from "./layout";
import {
  fetchNFTL,
  fetchReservoirListings,
  fetchReservoirCollectionOffers,
} from "../lib/utils";
import NftTableWrapper from "./NftTableWrapper";
export default async function HomePage() {
  const nftlPrice = await fetchNFTL();
  const reservoirListings = await fetchReservoirListings();
  const reservoirCollectionOffers = await fetchReservoirCollectionOffers();
  return (
    <Layout>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <NftTableWrapper
          nftlPrice={nftlPrice}
          reservoirListings={reservoirListings}
          reservoirCollectionOffers={reservoirCollectionOffers}
        />
      </div>
    </Layout>
  );
}
