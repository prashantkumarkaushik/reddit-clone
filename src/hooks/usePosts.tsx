import { authModalState } from "@/atoms/authModalAtoms";
import { CommunityState } from "@/atoms/communitiesAtom";
import { Post, postState, PostVote } from "@/atoms/postAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState)
  const currentCommunity = useRecoilValue(CommunityState).currentCommunity

  const onVote = async (post: Post, vote: number, communityId: string) => {
    if(!user?.uid) {
        setAuthModalState({open: true, view: 'login'})
        return
      }
    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (vote) => vote.postId === post.id
      );

      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      if (!existingVote) {
        // add / subtract 1 to/from post.voteStatus
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote,
        };

        batch.set(postVoteRef, newVote);
        // create a new postVote document
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );

        // Removing vote
        if (existingVote.voteValue === vote) {
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          batch.delete(postVoteRef);
          voteChange *= -1;
        }
        // flipping their vote (up => down and down => vote)
        else {
          updatedPost.voteStatus = voteStatus + 2 * vote;
          const voteIdx = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );

          updatedPostVotes[voteIdx] = {
            ...existingVote,
            voteValue: vote,
          };
          // add/subtract to/from post.voteStatus

          // updating the existing postVote document
          batch.update(postVoteRef, {
            voteValue: vote,
          });
          voteChange = 2 * vote;
        }
      }

      const postIdx = postStateValue.posts.findIndex(
      (item) => item.id === post.id
      )

       updatedPosts[postIdx!] = updatedPost;

      setPostStateValue((prev) => ({
          ...prev, 
          posts: updatedPosts,
          postVotes: updatedPostVotes
        }))

      const postRef = doc(firestore, "posts", post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
      await batch.commit();


    } catch (error: any) {
      console.log("onvote error", error.message);
    }
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // check if there is an image , delete
      if (post.imageUrl) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      // delete the post document
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);

      // update recoil state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id != post.id),
      }));
      return true;
    } catch (error) {
      return false;
    }
  };

  const onSelectPost = () => {};

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
    }

    useEffect(() => {
        if(!user || !currentCommunity?.id) return
        getCommunityPostVotes(currentCommunity?.id)
      }, [user, currentCommunity])

    useEffect(() => {
        if(!user) {
            setPostStateValue((prev) => ({
                ...prev, 
                postVotes: []
              }))
          }
      }, [user])

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  };
};

export default usePosts;
