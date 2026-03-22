import { Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const Actions = ({ post }) => {
	const user = useRecoilValue(userAtom);
	const [liked, setLiked] = useState(post.likes.includes(user?._id));
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [isLiking, setIsLiking] = useState(false);
	const showToast = useShowToast();
	const likedBg = useColorModeValue("red.50", "red.500");
	const likedBorder = useColorModeValue("red.100", "red.300");
	const likedColor = useColorModeValue("red.600", "red.100");
	const ghostText = useColorModeValue("gray.600", "gray.300");

	const handleLikeAndUnlike = async () => {
		if (!user) return showToast("Error", "You must be logged in to like a post", "error");
		if (isLiking) return;

		setIsLiking(true);
		try {
			const res = await fetch(`/api/posts/like/${post._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (data.error) return showToast("Error", data.error, "error");

			const updatedPosts = posts.map((currentPost) => {
				if (currentPost._id !== post._id) {
					return currentPost;
				}

				return {
					...currentPost,
					likes: liked
						? currentPost.likes.filter((id) => id !== user._id)
						: [...currentPost.likes, user._id],
				};
			});

			setPosts(updatedPosts);
			setLiked(!liked);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsLiking(false);
		}
	};

	return (
		<Flex alignItems='center' justifyContent='space-between' gap={3} flexWrap='wrap' onClick={(e) => e.preventDefault()}>
			<Flex gap={2} alignItems='center' flexWrap='wrap'>
				<Button
					onClick={handleLikeAndUnlike}
					isLoading={isLiking}
					variant='unstyled'
					className={`!h-9 !rounded-full !px-3.5 !text-sm !font-medium transition ${liked ? "" : "app-button-ghost"}`}
					bg={liked ? likedBg : undefined}
					borderWidth={liked ? "1px" : undefined}
					borderColor={liked ? likedBorder : undefined}
					color={liked ? likedColor : undefined}
					_hover={liked ? { filter: "brightness(0.98)" } : { bg: useColorModeValue("blackAlpha.50", "whiteAlpha.50") }}
				>
					<Flex align='center' gap={2}>
						<Box as='span' fontSize='sm'>
							{liked ? "♥" : "♡"}
						</Box>
						<Text>{liked ? "Liked" : "Like"}</Text>
					</Flex>
				</Button>

				<Text fontSize='sm' color={ghostText}>
					{post.likes.length} likes
				</Text>
			</Flex>

			<Flex gap={2} alignItems='center' flexWrap='wrap'>
				<Box className='metric-pill'>{post.replies.length} replies</Box>
				{post.likes.length > 0 && <Box className='metric-pill'>{post.likes.length} reactions</Box>}
			</Flex>
		</Flex>
	);
};

export default Actions;
