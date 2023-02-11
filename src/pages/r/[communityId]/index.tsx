import { Community } from "@/atoms/communitiesAtom";
import Header from "@/components/community/Header";
import CommunityNotFound from "@/components/community/Notfound";
import PageContent from "@/components/Layout/PageContent";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  console.log("communityData", communityData);
  if (!communityData) return <CommunityNotFound />;

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <div>LHS</div>
          <div>hello</div>
          <div>hello</div>
          <div>hello</div>
          <div>hello</div>
          <div>hello</div>
        </>
        <>
          <div>RHS</div>
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get community data and pass it to the client
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );

    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        // communityData: communityDoc.data(),
        communityData: communityDoc.exists()
          ? JSON.parse(
            safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
          )
          : "",
      },
    };
  } catch (error) { }
}

export default CommunityPage;
