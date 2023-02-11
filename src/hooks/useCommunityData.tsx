import React from "react";
import { CommunityState } from "@/atoms/communitiesAtom";
import { useRecoilState } from "recoil";

const useCommunityData = () => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(CommunityState);

  const joinCommunity = () => { };
  const leaveCommunity = () => { };

  return {
    communityStateValue,
    joinCommunity,
    leaveCommunity,
  };
};

export default useCommunityData;
