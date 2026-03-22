import { Avatar, Box, Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import Actions from "./Actions";

const Post = ({ post, postedBy }) => {
	const [user, setUser] = useState(null);
	const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const navigate = useNavigate();
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");
	const mutedColor = useColorModeValue("gray.500", "gray.400");
	const imageBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const dividerColor = useColorModeValue("blackAlpha.100", "whiteAlpha.100");

	useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch(`/api/users/profile/${postedBy}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};

		getUser();
	}, [postedBy, showToast]);

	const handleDeletePost = async (e) => {
		try {
			e.preventDefault();
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${post._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			showToast("Success", "Post deleted", "success");
			setPosts(posts.filter((currentPost) => currentPost._id !== post._id));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	if (!user) return null;

	return (
		<Link to={`/${user.username}/post/${post._id}`} className='block'>
			<Box className='glass-panel surface-hover px-4 py-4 md:px-5 md:py-5'>
				<Flex direction='column' gap={4}>
					<Flex justifyContent='space-between' alignItems='flex-start' gap={3}>
						<Flex align='center' gap={3} minW={0}>
							<Avatar
								size='md'
								name={user.name}
								src={user?.profilePic}
								onClick={(e) => {
									e.preventDefault();
									navigate(`/${user.username}`);
								}}
							/>
							<Box minW={0}>
								<Flex align='center' gap={2.5} wrap='wrap'>
									<Text
										className='font-display text-base font-semibold'
										color={titleColor}
										noOfLines={1}
										onClick={(e) => {
											e.preventDefault();
											navigate(`/${user.username}`);
										}}
									>
										{user?.username}
									</Text>
									<Box className='metric-pill'>Student post</Box>
								</Flex>
								<Text mt={0.5} fontSize='xs' color={mutedColor}>
									{formatDistanceToNow(new Date(post.createdAt))} ago
								</Text>
							</Box>
						</Flex>

						{currentUser?._id === user._id && (
							<Box as='button' onClick={handleDeletePost} className='danger-soft-button !p-2'>
								<DeleteIcon boxSize={3.5} />
							</Box>
						)}
					</Flex>

					{post.text && (
						<Text fontSize={{ base: "sm", md: "md" }} color={bodyColor} wordBreak='break-word' lineHeight='1.75'>
							{post.text}
						</Text>
					)}

					{post.img && (
						<Box borderRadius='22px' overflow='hidden' borderWidth='1px' borderColor={imageBorder}>
							<Image src={post.img} w='full' maxH='520px' objectFit='cover' />
						</Box>
					)}

					<Box pt={3} borderTopWidth='1px' borderColor={dividerColor}>
						<Actions post={post} />
					</Box>
				</Flex>
			</Box>
		</Link>
	);
};

export default Post;
