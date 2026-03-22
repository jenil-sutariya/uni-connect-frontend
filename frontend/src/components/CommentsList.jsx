import {
	Box,
	VStack,
	HStack,
	Avatar,
	Text,
	Button,
	Flex,
	useColorModeValue,
	IconButton,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { BsThreeDots } from "react-icons/bs";
import { DeleteIcon } from "@chakra-ui/icons";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const CommentsList = ({ comments, onDeleteComment, type = "post", targetId }) => {
	const user = useRecoilValue(userAtom);
	const navigate = useNavigate();
	const showToast = useShowToast();
	const [localComments, setLocalComments] = useState(comments ?? []);
	const cardBg = useColorModeValue("gray.50", "whiteAlpha.50");
	const cardBorder = useColorModeValue("gray.200", "whiteAlpha.200");
	const mutedText = useColorModeValue("gray.500", "gray.400");

	useEffect(() => {
		setLocalComments(comments ?? []);
	}, [comments]);

	const isOwnedByCurrentUser = (comment) =>
		Boolean(
			user &&
				(comment.userId?.toString?.() === user._id?.toString?.() ||
					comment.userId === user._id ||
					user.role === "admin")
		);

	const isCommentLiked = (comment) =>
		Boolean(
			user &&
				Array.isArray(comment.likes) &&
				comment.likes.some((id) => id?.toString?.() === user._id?.toString?.() || id === user._id)
		);

	const handleDeleteComment = async (commentId) => {
		try {
			const endpoint =
				type === "post"
					? `/api/posts/${targetId}/reply/${commentId}`
					: `/api/announcements/${targetId}/reply/${commentId}`;

			const res = await fetch(endpoint, {
				method: "DELETE",
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			setLocalComments((prev) => prev.filter((comment) => comment._id !== commentId));
			showToast("Success", "Comment deleted successfully!", "success");
			onDeleteComment?.(commentId);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const handleLikeComment = async (commentId) => {
		if (!user) {
			showToast("Error", "You must be logged in to like comments", "error");
			return;
		}

		try {
			const endpoint =
				type === "post"
					? `/api/posts/${targetId}/reply/${commentId}/like`
					: `/api/announcements/${targetId}/reply/${commentId}/like`;

			const res = await fetch(endpoint, {
				method: "PUT",
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			setLocalComments((prev) =>
				prev.map((comment) => {
					if (comment._id !== commentId) {
						return comment;
					}

					const likes = Array.isArray(comment.likes) ? comment.likes : [];
					const alreadyLiked = likes.some(
						(id) => id?.toString?.() === user._id?.toString?.() || id === user._id
					);

					return {
						...comment,
						likes: alreadyLiked
							? likes.filter((id) => id?.toString?.() !== user._id?.toString?.() && id !== user._id)
							: [...likes, user._id],
					};
				})
			);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const renderCommentText = (text) => {
		if (!text) return "";

		const parts = text.split(/(@\w+)/g);
		return parts.map((part, index) => {
			if (part.startsWith("@")) {
				const username = part.substring(1);
				return (
					<Text
						key={index}
						as="span"
						color="blue.500"
						fontWeight="medium"
						cursor="pointer"
						_hover={{ color: "blue.600", textDecoration: "underline" }}
						onClick={(e) => {
							e.stopPropagation();
							navigate(`/${username}`);
						}}
					>
						{part}
					</Text>
				);
			}
			return part;
		});
	};

	const formatTimeAgo = (date) => {
		try {
			return formatDistanceToNow(new Date(date), { addSuffix: true });
		} catch (error) {
			return "recently";
		}
	};

	if (!localComments || localComments.length === 0) {
		return (
			<Box p={4} textAlign="center">
				<Text color={mutedText} fontSize="sm">
					No comments yet. Be the first to comment!
				</Text>
			</Box>
		);
	}

	return (
		<VStack align="stretch" spacing={3}>
			{localComments.map((comment) => (
				<Box
					key={comment._id}
					bg={cardBg}
					borderWidth="1px"
					borderColor={cardBorder}
					borderRadius="xl"
					p={{ base: 3, md: 4 }}
				>
					<HStack align="flex-start" spacing={3}>
						<Avatar size="sm" src={comment.userProfilePic} name={comment.username} />
						<Box flex={1} minW={0}>
							<Flex justify="space-between" align="flex-start" gap={3}>
								<Box minW={0}>
									<HStack spacing={2} align="center" flexWrap="wrap">
										<Text fontSize="sm" fontWeight="bold" noOfLines={1}>
											{comment.username}
										</Text>
										<Text fontSize="xs" color={mutedText}>
											{formatTimeAgo(comment.createdAt)}
										</Text>
									</HStack>
									<Text fontSize="sm" mt={1.5} wordBreak="break-word">
										{renderCommentText(comment.text)}
									</Text>
								</Box>
								{isOwnedByCurrentUser(comment) && (
									<Menu>
										<MenuButton
											as={IconButton}
											icon={<BsThreeDots />}
											variant="ghost"
											size="sm"
											aria-label="Comment options"
										/>
										<MenuList>
											<MenuItem
												icon={<DeleteIcon />}
												onClick={() => handleDeleteComment(comment._id)}
												color="red.500"
											>
												Delete
											</MenuItem>
										</MenuList>
									</Menu>
								)}
							</Flex>

							<HStack spacing={2} mt={3}>
								<Button
									variant="ghost"
									size="xs"
									leftIcon={
										<Icon as={isCommentLiked(comment) ? FaHeart : FiHeart} color={isCommentLiked(comment) ? "red.500" : mutedText} />
									}
									onClick={() => handleLikeComment(comment._id)}
									color={isCommentLiked(comment) ? "red.500" : mutedText}
									_hover={{
										color: isCommentLiked(comment) ? "red.600" : "red.400",
										bg: "transparent",
									}}
									px={2}
									py={1}
									h="auto"
								>
									{comment.likes?.length || 0}
								</Button>
							</HStack>

							{comment.mentions && comment.mentions.length > 0 && (
								<Box mt={2}>
									<Text fontSize="xs" color={mutedText}>
										Mentioned: {comment.mentions.map((mention) => `@${mention}`).join(", ")}
									</Text>
								</Box>
							)}
						</Box>
					</HStack>
				</Box>
			))}
		</VStack>
	);
};

export default CommentsList;
