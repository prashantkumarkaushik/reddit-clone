import { Community, CommunityState } from "@/atoms/communitiesAtom";
import About from "@/components/community/About";
import CreatePostLink from "@/components/community/CreatePostLink";
import Header from "@/components/community/Header";
import CommunityNotFound from "@/components/community/Notfound";
import PageContent from "@/components/Layout/PageContent";
import Posts from "@/components/Posts/Posts";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  console.log("communityData", communityData);
  const setCommunityStateValue = useSetRecoilState(CommunityState);

  if (!communityData) return <CommunityNotFound />;

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  });

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
        <About communityData={communityData}/>
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
  } catch (error: any) {
    console.log("community page error", error.message);
  }
}

export default CommunityPage;
