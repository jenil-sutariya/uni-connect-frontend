import {
	Box,
	Button,
	Textarea,
	HStack,
	Avatar,
	Text,
	useColorModeValue,
	Flex,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const CommentInput = ({ onComment, type = "post", targetId, placeholder = "Write a comment..." }) => {
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showMentions, setShowMentions] = useState(false);
	const [mentionUsers, setMentionUsers] = useState([]);
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const textareaRef = useRef(null);
	const dropdownBg = useColorModeValue("white", "gray.800");
	const dropdownBorder = useColorModeValue("gray.200", "gray.600");
	const inputBg = useColorModeValue("white", "gray.900");
	const inputBorder = useColorModeValue("gray.200", "whiteAlpha.200");
	const mutedText = useColorModeValue("gray.500", "gray.400");
	const mentionHoverBg = useColorModeValue("gray.100", "gray.700");
	const emptyStateBg = useColorModeValue("gray.50", "whiteAlpha.50");

	const extractMentions = (text) => {
		const mentionRegex = /@(\w+)/g;
		const mentions = [];
		let match;

		while ((match = mentionRegex.exec(text)) !== null) {
			mentions.push(match[1]);
		}

		return mentions;
	};

	const handleCommentChange = async (e) => {
		const value = e.target.value;
		setComment(value);

		const cursorPosition = e.target.selectionStart;
		const textBeforeCursor = value.substring(0, cursorPosition);
		const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

		if (!mentionMatch) {
			setShowMentions(false);
			setMentionUsers([]);
			return;
		}

		const searchTerm = mentionMatch[1];

		if (searchTerm.length >= 1) {
			try {
				const res = await fetch(`/api/users/search?query=${searchTerm}&limit=5`);
				const data = await res.json();

				if (!data.error && Array.isArray(data)) {
					setMentionUsers(data);
					setShowMentions(data.length > 0);
				} else {
					setMentionUsers([]);
					setShowMentions(false);
				}
			} catch (error) {
				console.error("Error searching users:", error);
				setMentionUsers([]);
				setShowMentions(false);
			}
			return;
		}

		try {
			const res = await fetch("/api/users/suggested?limit=5");
			const data = await res.json();

			if (!data.error && Array.isArray(data)) {
				setMentionUsers(data);
				setShowMentions(data.length > 0);
			} else {
				setMentionUsers([]);
				setShowMentions(false);
			}
		} catch (error) {
			console.error("Error getting suggested users:", error);
			setMentionUsers([]);
			setShowMentions(false);
		}
	};

	const handleMentionSelect = (selectedUser) => {
		const cursorPosition = textareaRef.current?.selectionStart ?? 0;
		const textBeforeCursor = comment.substring(0, cursorPosition);
		const textAfterCursor = comment.substring(cursorPosition);
		const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

		if (mentionMatch) {
			const beforeMention = textBeforeCursor.substring(0, mentionMatch.index);
			setComment(`${beforeMention}@${selectedUser.username} ${textAfterCursor}`);
		}

		setShowMentions(false);
		setMentionUsers([]);
		textareaRef.current?.focus();
	};

	const handleSubmit = async () => {
		if (!comment.trim() || !targetId) return;

		setIsSubmitting(true);
		try {
			const endpoint =
				type === "post" ? `/api/posts/reply/${targetId}` : `/api/announcements/${targetId}/reply`;
			const method = type === "post" ? "PUT" : "POST";

			const res = await fetch(endpoint, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: comment,
					mentions: extractMentions(comment),
				}),
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			showToast("Success", "Comment posted successfully!", "success");
			setComment("");
			setShowMentions(false);
			setMentionUsers([]);
			onComment(data);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!user) {
		return (
			<Box
				p={4}
				textAlign="center"
				borderRadius="lg"
				bg={emptyStateBg}
				borderWidth="1px"
				borderColor={inputBorder}
			>
				<Text color={mutedText}>Please log in to comment</Text>
			</Box>
		);
	}

	return (
		<Box position="relative">
			<HStack align="flex-start" spacing={3}>
				<Avatar size="sm" src={user.profilePic} name={user.username} />
				<Box flex={1} position="relative">
					<Box position="relative">
						<Textarea
							ref={textareaRef}
							value={comment}
							onChange={handleCommentChange}
							placeholder={placeholder}
							resize="none"
							minH="84px"
							maxH="160px"
							border="1px solid"
							borderColor={inputBorder}
							bg={inputBg}
							fontSize="sm"
							borderRadius="xl"
							px={4}
							py={3}
							_focus={{
								borderColor: "blue.400",
								boxShadow: "0 0 0 1px blue.400",
							}}
						/>

						{showMentions && mentionUsers.length > 0 && (
							<Box
								position="absolute"
								top="calc(100% + 8px)"
								left={0}
								right={0}
								bg={dropdownBg}
								border="1px solid"
								borderColor={dropdownBorder}
								borderRadius="md"
								shadow="lg"
								maxH="200px"
								overflowY="auto"
								zIndex={10}
								maxW="320px"
							>
								{mentionUsers.map((mentionUser) => (
									<Flex
										key={mentionUser._id}
										p={3}
										align="center"
										cursor="pointer"
										_hover={{ bg: mentionHoverBg }}
										onClick={() => handleMentionSelect(mentionUser)}
									>
										<Avatar size="xs" src={mentionUser.profilePic} name={mentionUser.username} mr={2} />
										<Box>
											<Text fontSize="sm" fontWeight="medium">
												{mentionUser.username}
											</Text>
											<Text fontSize="xs" color={mutedText}>
												{mentionUser.name}
											</Text>
										</Box>
									</Flex>
								))}
							</Box>
						)}
					</Box>
					<HStack justify="space-between" mt={3} flexWrap="wrap" spacing={3}>
						<Text fontSize="xs" color={mutedText}>
							Type @ to mention someone
						</Text>
						<Button
							size="sm"
							colorScheme="blue"
							onClick={handleSubmit}
							isLoading={isSubmitting}
							isDisabled={!comment.trim()}
							borderRadius="full"
							px={5}
						>
							Post {type === "post" ? "Comment" : "Reply"}
						</Button>
					</HStack>
				</Box>
			</HStack>
		</Box>
	);
};

export default CommentInput;
