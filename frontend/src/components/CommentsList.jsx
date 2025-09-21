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
import { useState } from "react";
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
	const bgColor = useColorModeValue("gray.50", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	const handleDeleteComment = async (commentId) => {
		try {
			const endpoint = type === "post" 
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

			showToast("Success", "Comment deleted successfully!", "success");
			onDeleteComment(commentId);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const handleLikeComment = async (commentId) => {
		try {
			const endpoint = type === "post" 
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

			// Update comment likes in parent component
			// This would need to be handled by the parent component
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const renderCommentText = (text) => {
		if (!text) return "";
		
		const parts = text.split(/(@\w+)/g);
		return parts.map((part, index) => {
			if (part.startsWith('@')) {
				const username = part.substring(1); // Remove @ symbol
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

	if (!comments || comments.length === 0) {
		return (
			<Box p={4} textAlign="center">
				<Text color="gray.500" fontSize="sm">
					No comments yet. Be the first to comment!
				</Text>
			</Box>
		);
	}

	return (
		<VStack align="stretch" spacing={4}>
			{comments.map((comment) => (
				<Box key={comment._id}>
					<HStack align="flex-start" spacing={3}>
						<Avatar
							size="sm"
							src={comment.userProfilePic}
							name={comment.username}
						/>
						<Box flex={1}>
							<HStack justify="space-between" align="flex-start">
								<Box>
									<HStack spacing={2} align="center">
										<Text fontSize="sm" fontWeight="bold">
											{comment.username}
										</Text>
										<Text fontSize="xs" color="gray.500">
											{formatTimeAgo(comment.createdAt)}
										</Text>
									</HStack>
									<Text fontSize="sm" mt={1}>
										{renderCommentText(comment.text)}
									</Text>
								</Box>
								{user && (user._id === comment.userId || user.role === "admin") && (
									<Menu>
										<MenuButton
											as={IconButton}
											icon={<BsThreeDots />}
											variant="ghost"
											size="sm"
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
							</HStack>

							{/* Comment actions */}
							<HStack spacing={4} mt={2}>
								<Button
									variant="ghost"
									size="xs"
									leftIcon={
										<Icon as={comment.likes?.includes(user?._id) ? FaHeart : FiHeart} 
											color={comment.likes?.includes(user?._id) ? "red.500" : "gray.400"} 
										/>
									}
									onClick={() => handleLikeComment(comment._id)}
									color={comment.likes?.includes(user?._id) ? "red.500" : "gray.500"}
									_hover={{ 
										color: comment.likes?.includes(user?._id) ? "red.600" : "red.400",
										bg: "transparent"
									}}
									px={2}
									py={1}
									h="auto"
								>
									{comment.likes?.length || 0}
								</Button>
								<Button
									variant="ghost"
									size="xs"
									color="gray.500"
									_hover={{ color: "blue.500", bg: "transparent" }}
									px={2}
									py={1}
									h="auto"
								>
									Reply
								</Button>
							</HStack>

							{/* Show mentions if any */}
							{comment.mentions && comment.mentions.length > 0 && (
								<Box mt={2}>
									<Text fontSize="xs" color="gray.500">
										Mentioned: {comment.mentions.map(mention => `@${mention}`).join(', ')}
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
