import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect } from "react";
import CommentSection from "../components/CommentSection";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
	const { user, loading } = useGetUserProfile();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const showToast = useShowToast();
	const { pid } = useParams();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");
	const mutedColor = useColorModeValue("gray.500", "gray.400");
	const imageBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const dividerColor = useColorModeValue("blackAlpha.100", "whiteAlpha.100");

	const currentPost = posts[0];

	useEffect(() => {
		const getPost = async () => {
			setPosts([]);
			try {
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, pid, setPosts]);

	const handleDeletePost = async () => {
		try {
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			navigate(`/${user.username}`);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!currentPost) return null;
	return (
		<Box className='glass-panel-strong px-5 py-5 md:px-7 md:py-7'>
			<Flex
				justifyContent={"space-between"}
				alignItems={{ base: "flex-start", sm: "center" }}
				direction={{ base: "column", sm: "row" }}
				gap={3}
			>
				<Flex w={"full"} alignItems={"center"} gap={3} minW={0}>
					<Avatar src={user.profilePic} size={"md"} name='Mark Zuckerberg' />
					<Flex minW={0} direction='column'>
						<Text fontSize={"sm"} fontWeight={"bold"} noOfLines={1} color={titleColor}>
							{user.name}
						</Text>
						<Text fontSize='xs' color={mutedColor} noOfLines={1}>
							{user.username}
						</Text>
					</Flex>
				</Flex>
				<Flex gap={{ base: 2, md: 4 }} alignItems={"center"}>
					<Text fontSize={"xs"} whiteSpace='nowrap' textAlign={"right"} color={mutedColor}>
						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
					</Text>

					{currentUser?._id === user._id && (
						<Button
							variant='unstyled'
							leftIcon={<DeleteIcon />}
							onClick={handleDeletePost}
							className='danger-soft-button !h-10 !px-4'
						>
							Delete
						</Button>
					)}
				</Flex>
			</Flex>

			<Text my={4} wordBreak='break-word' color={bodyColor} fontSize={{ base: "sm", md: "md" }}>
				{currentPost.text}
			</Text>

			{currentPost.img && (
				<Box borderRadius='20px' overflow={"hidden"} border={"1px solid"} borderColor={imageBorder}>
					<Image src={currentPost.img} w={"full"} />
				</Box>
			)}

			<Flex gap={3} my={3}>
				<Actions post={currentPost} />
			</Flex>

			<Divider my={5} borderColor={dividerColor} />
			
			<CommentSection
				comments={currentPost.replies}
				onAddComment={(newComment) => {
					const updatedPosts = posts.map((p) => {
						if (p._id === currentPost._id) {
							return { ...p, replies: [...p.replies, newComment] };
						}
						return p;
					});
					setPosts(updatedPosts);
				}}
				onDeleteComment={(commentId) => {
					const updatedPosts = posts.map((p) => {
						if (p._id === currentPost._id) {
							return { ...p, replies: p.replies.filter(reply => reply._id !== commentId) };
						}
						return p;
					});
					setPosts(updatedPosts);
				}}
				type="post"
				targetId={currentPost._id}
				showByDefault={true}
			/>
		</Box>
	);
};

export default PostPage;
