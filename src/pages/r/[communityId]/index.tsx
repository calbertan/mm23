import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { Community } from "@/src/atoms/communitiesAtom";
import { firestore } from "@/src/firebase/clientApps";
import safeJsonStringify from "safe-json-stringify";
import NotFound from "@/src/components/Community/NotFound";
import Header from "@/src/components/Community/Header";
import PageContent from "@/src/components/Layout/PageContent";
import CreatePostLink from "@/src/components/Community/CreatePostLink";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  if (!communityData) {
    return <NotFound/>;
  }
  return <>
  <Header communityData={communityData}/>
  <PageContent>
    <><CreatePostLink/></>
    <><div>RHS</div></>
  </PageContent>
  </>
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  //get community data
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : ""
      }
    };
  } catch (error) {
    console.log("getserversideprops error", error);
  }
}

export default CommunityPage;
