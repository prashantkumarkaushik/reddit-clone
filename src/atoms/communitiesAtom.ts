import { atom } from "recoil";
import { Timestamp } from "firebase/firestore";

export interface Community {
  id: string,
  creatorId: string,
  numberOfMembers: number,
  privacyType: 'public' | 'restricted' | 'private',
  createdAt?: Timestamp,
  imageUrl?: string
}

export interface CommunitySnippet {
  communityId: string,
  isModerator?: boolean,
  imageUrl?: string
}

interface CommunityState {
  mySnippets: CommunitySnippet[]
  currentCommunity?: Community
}

const defaultCommunityState: CommunityState = {
  mySnippets: []
}

export const CommunityState = atom<CommunityState>({
  key: 'communitiesState',
  default: defaultCommunityState
})
