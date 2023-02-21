import { Preahvihear } from "@next/font/google";
import {getDocs, collection, writeBatch, doc, increment} from "firebase/firestore";
import {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {useRecoilState} from "recoil";
import {Community, CommunitySnippet, communityState} from "../atoms/communitiesAtom";
import {auth, firestore} from "../firebase/clientApps";

const useCommunityData = () => {
    const [user] = useAuthState(auth);
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onJoinOrLeaveCommunity = (communityData : Community, isJoined : boolean) => {
        if (isJoined) {
            leaveCommunity(communityData.id);
            return;
        }
        joinCommunity(communityData);
    };

    const getMySnippets = async () => {
        setLoading(true);
        try {
            const snippetDocs = await getDocs(collection(firestore, `users/${
                user ?. uid
            }/communitySnippets`));
            const snippets = snippetDocs.docs.map((doc) => ({
                ...doc.data()
            }));

            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: snippets as CommunitySnippet[],
            }));

            console.log(snippets, "🙌🚀🚀");
        } catch (error : any) {
            console.log("Get My Snippet Error", error);
            setError(error.message);
        }
        setLoading(false);
    };
    const joinCommunity = async (communityData : Community) => {
      //batch write from firestore
      try{
        const batch = writeBatch(firestore)
        
        //creating a new community snippet
        const newSnippet: CommunitySnippet = {
          communityID: communityData.id,
          imageURL: communityData.imageURL || "",
        };
        batch.set(
          doc(firestore, 
            `user/${user?.uid}/communitySnippets`,
            communityData.id
            ),
            newSnippet
            )
            batch.update(
              doc(firestore, 
                `communities`,
                communityData.id
                ),
                {
                  //updating the numberOfMembers
                  numberOfMembers: increment(1),
                }
                )
        await batch.commit()

        //update recoil state - communitystate.mysnippet
        setCommunityStateValue((prev)=>({
          ...prev,
          mySnippets: [...prev.mySnippets, newSnippet]
        }))
      }catch(error: any){
        console.log("joinCommunity error, error");
        setError(error.message);
      }
      setLoading(false)

    };
    const leaveCommunity = async (communityID : string) => {
      //batch write
      //deleting a new community snippet
      //updating the numberOfMembers

      try{
        const batch = writeBatch(firestore)
        
        //deleting a community snippet
        batch.delete(
          doc(firestore, 
            `user/${user?.uid}/communitySnippets`,
            communityID
            ),
          )
        batch.update(
          doc(firestore, 
            "communities",
            communityID
            ),
            {
              //updating the numberOfMembers
              numberOfMembers: increment(-1),
            }
            )
        await batch.commit()

        //update recoil state - communitystate.mysnippet
        setCommunityStateValue((prev)=>({
          ...prev,
          mySnippets: prev.mySnippets.filter(
            item => item.communityID !== communityID)
        }))
      }catch(error: any){
        console.log("leaveCommunity error, error");
        setError(error.message);
      }


      //update recoil state - communitystate.mysnippet
    
    };
    
    
    useEffect(() => {
        if (!user) {
            return;
        }
        getMySnippets();
    }, [user]);

    return {communityStateValue, onJoinOrLeaveCommunity, loading};
};
export default useCommunityData;
