import {
	Box,
	Button,
	Textarea,
	HStack,
	Avatar,
	Text,
	useColorModeValue,
	Flex,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Portal,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const CommentInput = ({ onComment, type = "post", targetId, placeholder = "Write a comment..." }) => {
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showMentions, setShowMentions] = useState(false);
	const [mentionSearch, setMentionSearch] = useState("");
	const [mentionUsers, setMentionUsers] = useState([]);
	const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const textareaRef = useRef(null);
	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");

	const handleCommentChange = async (e) => {
		const value = e.target.value;
		setComment(value);

		// Check for @ mentions
		const cursorPosition = e.target.selectionStart;
		const textBeforeCursor = value.substring(0, cursorPosition);
		const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

		if (mentionMatch) {
			const searchTerm = mentionMatch[1];
			setMentionSearch(searchTerm);

			// Get cursor position for mention dropdown
			const textarea = textareaRef.current;
			const coords = getCaretCoordinates(textarea, cursorPosition);
			setMentionPosition({
				top: coords.top + 20,
				left: coords.left
			});

			// Search for users - only search if we have at least 1 character
			if (searchTerm.length >= 1) {
				try {
					const res = await fetch(`/api/users/search?query=${searchTerm}&limit=5`);
					const data = await res.json();
					if (!data.error && Array.isArray(data)) {
						setMentionUsers(data);
						setShowMentions(true);
					} else {
						setMentionUsers([]);
						setShowMentions(false);
					}
				} catch (error) {
					console.error("Error searching users:", error);
					setMentionUsers([]);
					setShowMentions(false);
				}
			} else if (searchTerm.length === 0) {
				// Show recent or suggested users when just typing @
				try {
					const res = await fetch(`/api/users/suggested?limit=5`);
					const data = await res.json();
					if (!data.error && Array.isArray(data)) {
						setMentionUsers(data);
						setShowMentions(true);
					}
				} catch (error) {
					console.error("Error getting suggested users:", error);
				}
			}
		} else {
			setShowMentions(false);
			setMentionUsers([]);
		}
	};

	const handleMentionSelect = (selectedUser) => {
		const cursorPosition = textareaRef.current.selectionStart;
		const textBeforeCursor = comment.substring(0, cursorPosition);
		const textAfterCursor = comment.substring(cursorPosition);
		
		// Replace the partial mention with the complete username
		const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
		if (mentionMatch) {
			const beforeMention = textBeforeCursor.substring(0, mentionMatch.index);
			const newComment = `${beforeMention}@${selectedUser.username} ${textAfterCursor}`;
			setComment(newComment);
		}

		setShowMentions(false);
		setMentionUsers([]);
		textareaRef.current.focus();
	};

	const handleSubmit = async () => {
		if (!comment.trim()) return;

		setIsSubmitting(true);
		try {
			// Extract mentions from comment
			const mentions = extractMentions(comment);

			const commentData = {
				text: comment,
				mentions: mentions
			};

			const endpoint = type === "post" 
				? `/api/posts/reply/${targetId}`
				: `/api/announcements/reply/${targetId}`;

			const res = await fetch(endpoint, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(commentData),
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			showToast("Success", "Comment posted successfully!", "success");
			setComment("");
			onComment(data);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsSubmitting(false);
		}
	};

	const extractMentions = (text) => {
		const mentionRegex = /@(\w+)/g;
		const mentions = [];
		let match;
		while ((match = mentionRegex.exec(text)) !== null) {
			mentions.push(match[1]);
		}
		return mentions;
	};

	// Function to get caret coordinates (simplified)
	const getCaretCoordinates = (element, position) => {
		const div = document.createElement('div');
		const copyStyle = getComputedStyle(element);
		for (const prop of copyStyle) {
			div.style[prop] = copyStyle[prop];
		}
		div.style.position = 'absolute';
		div.style.visibility = 'hidden';
		div.style.height = 'auto';
		div.style.width = copyStyle.width;
		div.style.whiteSpace = 'pre-wrap';
		div.style.wordWrap = 'break-word';
		
		div.textContent = element.value.substring(0, position);
		document.body.appendChild(div);
		
		const coordinates = {
			top: div.offsetHeight,
			left: div.offsetWidth
		};
		
		document.body.removeChild(div);
		return coordinates;
	};

	const renderCommentText = (text) => {
		const parts = text.split(/(@\w+)/g);
		return parts.map((part, index) => {
			if (part.startsWith('@')) {
				return (
					<Text key={index} as="span" color="blue.500" fontWeight="medium">
						{part}
					</Text>
				);
			}
			return part;
		});
	};

	if (!user) {
		return (
			<Box p={4} textAlign="center">
				<Text color="gray.500">Please log in to comment</Text>
			</Box>
		);
	}

	return (
		<Box position="relative">
			<HStack align="flex-start" spacing={3} mb={3}>
				<Avatar size="sm" src={user.profilePic} name={user.username} />
				<Box flex={1}>
					<Textarea
						ref={textareaRef}
						value={comment}
						onChange={handleCommentChange}
						placeholder={placeholder}
						resize="none"
						minH="40px"
						maxH="120px"
						border="1px solid"
						borderColor="gray.200"
						bg="white"
						fontSize="sm"
						borderRadius="md"
						_focus={{
							borderColor: "blue.400",
							boxShadow: "0 0 0 1px blue.400"
						}}
					/>
					<HStack justify="space-between" mt={2}>
						<Text fontSize="xs" color="gray.500">
							Type @ to mention someone
						</Text>
						<Button
							size="sm"
							colorScheme="blue"
							onClick={handleSubmit}
							isLoading={isSubmitting}
							isDisabled={!comment.trim()}
							borderRadius="md"
						>
							Comment
						</Button>
					</HStack>
				</Box>
			</HStack>

			{/* Mention dropdown */}
			{showMentions && mentionUsers.length > 0 && (
				<Portal>
					<Box
						position="absolute"
						top={`${mentionPosition.top}px`}
						left={`${mentionPosition.left}px`}
						bg={bgColor}
						border="1px solid"
						borderColor={borderColor}
						borderRadius="md"
						shadow="lg"
						maxH="200px"
						overflowY="auto"
						zIndex={1000}
						minW="200px"
					>
						{mentionUsers.map((mentionUser) => (
							<Flex
								key={mentionUser._id}
								p={2}
								align="center"
								cursor="pointer"
								_hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
								onClick={() => handleMentionSelect(mentionUser)}
							>
								<Avatar size="xs" src={mentionUser.profilePic} name={mentionUser.username} mr={2} />
								<Box>
									<Text fontSize="sm" fontWeight="medium">
										{mentionUser.username}
									</Text>
									<Text fontSize="xs" color="gray.500">
										{mentionUser.name}
									</Text>
								</Box>
							</Flex>
						))}
					</Box>
				</Portal>
			)}
		</Box>
	);
};

export default CommentInput;
