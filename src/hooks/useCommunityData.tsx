import React, { useEffect, useState } from "react";
import {
  Community,
  CommunitySnippet,
  CommunityState,
} from "@/atoms/communitiesAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { auth, firestore } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { authModalState } from "@/atoms/authModalAtoms";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(CommunityState);
  const setAuthModalState = useSetRecoilState(authModalState)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    // check if the user signed in or not
    // if not => open auth model
    if (!user) {
      // open modal
      setAuthModalState({ view: 'login', open: true })
    }

    if (isJoined) {
      leaveCommunity(communityData.id);
    }
    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    setLoading(true);
    // get user snippets
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
      console.log("here are the snippets: ", snippets);
    } catch (error: any) {
      setError(error.message);
      console.log("getMySnippets errors: ", error);
    }
    setLoading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    // batch write
    // creating a new community snippet
    // update the number of memebers

    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageUrl: communityData.imageUrl || "",
      };

      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );

      batch.update(doc(firestore, "communities", communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      // update recoil state - communityState.mySnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log("join community error", error);
      setError(error.message);
    }
    setLoading(false);
  };
  const leaveCommunity = async (communityId: string) => {
    // batch write
    // deleting community snippet from user
    // update the number of memebers (-1)
    try {
      const batch = writeBatch(firestore);
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
      );

      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();
      // update recoil state - communityState.mySnippets
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log("leave community error: ", error.message);
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
        setCommunityStateValue(prev => ({
            ...prev,
            mySnippets: []
          }))
        return
      };
    getMySnippets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    loading,
    communityStateValue,
    onJoinOrLeaveCommunity,
  };
};

export default useCommunityData;
