import { Alert, AlertDescription, AlertIcon, AlertTitle, CloseButton, Flex, Icon, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import { useRouter } from 'next/router';
import { User } from 'firebase/auth';
import { Post } from '@/src/atoms/postAtom';
import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firestore } from '@/src/firebase/clientApps';
import { uploadString } from 'firebase/storage';


type NewPostFormProps = {
    user: User;
};

const formTabs=[
	{
		title: 'Post',
		icon: IoDocumentText,
	},
	{
		title: 'Images & Video',
		icon: IoImageOutline,
	},
	{
		title: 'Poll',
		icon: BiPoll,
	},
	{
		title: 'Talk',
		icon: BsMic,
	},
];

export type TabItem = {
	title: string;
	icon: typeof Icon.arguments;
}

const NewPostForm:React.FC<NewPostFormProps> = ( {user} ) => {
	const router = useRouter();
	const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
	const [textInputs, setSetTextInputs] = useState({
		title: '',
		body: '',
	})
	const [selectedFile, setSelectedFile] = useState<string>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	
	const handleCreatePost = async () => {
		const {communityId} = router.query

		//create new post obect, type post
		const newPost: Post = {
			communityId: communityId as string,
			creatorId: user.uid,
			creatorDisplayName: user.email!.split("@")[0],
			title: textInputs.title,
			body: textInputs.body,
			numberOfComments: 0,
			voteStatus: 0,
			createdAt: serverTimestamp() as Timestamp,
		}; 
		setLoading(true);
		//store the post in db
		try{
			const postDocRef = await addDoc(collection(firestore, "posts"), newPost)

			//store image in db

		}catch(error:any){
			console.log("handleCreatePost error", error.message)
			setError(true);
		}
		setLoading(false);

		//check for selectedfile
			//store in storage => getDownloadURL(return imageURL)

	};

	const onSelectImage = () => {};

	const onTextChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const {
			target: { name, value},
		} = event;
		setSetTextInputs(prev => ({
			...prev,
			[name]: value,
		}))
	};
	
	
	return(
		<Flex direction ='column' bg='white' borderRadius={4} mt={2}>
			<Flex width="100%">
				{formTabs.map((item)=>(
					<TabItem item={item} 
						selected={item.title === selectedTab}
						setSelectedTab={setSelectedTab}/>
				))}
			</Flex>
			<Flex p={4}>
				{selectedTab === 'Post' && (
					<TextInputs
						textInputs={textInputs}
						handleCreatePost={handleCreatePost}
						onChange={onTextChange}
						loading={loading}
					/>
				)}
			</Flex>
			{error && (
			<Alert status='error'>
				<AlertIcon />
				<Text mr={2}>Error creating Post</Text>
			  </Alert>
			)
			}
		</Flex>
	)
}
export default NewPostForm;