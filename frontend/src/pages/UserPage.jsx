import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Box, Flex, Spinner, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import AppSurface from "../components/ui/AppSurface";
import SectionHeader from "../components/ui/SectionHeader";
import EmptyState from "../components/ui/EmptyState";

const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");

	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

		getPosts();
	}, [username, showToast, setPosts, user]);

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user && !loading) {
		return (
			<EmptyState
				title='User not found'
				description='The profile you are trying to open does not exist or is no longer available.'
			/>
		);
	}

	return (
		<VStack align='stretch' spacing={5}>
			<UserHeader user={user} />

			<AppSurface variant='default' className='px-5 py-5 md:px-6 md:py-6'>
				<SectionHeader
					eyebrow='Profile Feed'
					title={`${user.name.split(" ")[0]}'s posts`}
					description='Recent updates, thoughts, and shared images from this profile.'
				/>
			</AppSurface>

			{!fetchingPosts && posts.length === 0 && (
				<EmptyState
					title='No posts yet'
					description={`${user.name} has not shared anything on the feed yet.`}
				/>
			)}
			{fetchingPosts && (
				<Flex justifyContent={"center"} my={12}>
					<Spinner size={"xl"} />
				</Flex>
			)}

			{posts.map((post) => (
				<Post key={post._id} post={post} postedBy={post.postedBy} />
			))}
		</VStack>
	);
};

export default UserPage;
