import PageContent from '@/src/components/Layout/PageContent';
import NewPostForm from '@/src/components/Posts/NewPostForm';
import { auth } from '@/src/firebase/clientApps';
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const submit:React.FC = () => {
	const [user] = useAuthState(auth)
	return (
		<PageContent>
			<>
				<Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
					<Text>Create a post</Text>
				</Box>
				<NewPostForm user={user} />
			</>
			<></>
		</PageContent>
	)
}
export default submit;