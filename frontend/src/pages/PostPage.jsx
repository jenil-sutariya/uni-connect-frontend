import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
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
	console.log("currentPost", currentPost);

	return (
		<>
			<Flex
				justifyContent={"space-between"}
				alignItems={{ base: "flex-start", sm: "center" }}
				direction={{ base: "column", sm: "row" }}
				gap={3}
			>
				<Flex w={"full"} alignItems={"center"} gap={3} minW={0}>
					<Avatar src={user.profilePic} size={"md"} name='Mark Zuckerberg' />
					<Flex minW={0}>
						<Text fontSize={"sm"} fontWeight={"bold"} noOfLines={1}>
							{user.username}
						</Text>
						{/* <Image src='/verified.png' w='4' h={4} ml={4} /> */}
					</Flex>
				</Flex>
				<Flex gap={{ base: 2, md: 4 }} alignItems={"center"}>
					<Text fontSize={"xs"} whiteSpace='nowrap' textAlign={"right"} color={"gray.light"}>
						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
					</Text>

					{currentUser?._id === user._id && (
						<DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
					)}
				</Flex>
			</Flex>

			<Text my={3} wordBreak='break-word'>
				{currentPost.text}
			</Text>

			{currentPost.img && (
				<Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
					<Image src={currentPost.img} w={"full"} />
				</Box>
			)}

			<Flex gap={3} my={3}>
				<Actions post={currentPost} />
			</Flex>

			<Divider my={4} />

			{/* <Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>Get the app to like, reply and post.</Text>
				</Flex>
				<Button>Get</Button>
			</Flex> */}

			<Divider my={4} />
			
			{/* Comment Section */}
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
		</>
	);
};

export default PostPage;
