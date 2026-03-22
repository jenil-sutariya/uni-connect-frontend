import {
	Box,
	Text,
	Button,
	Collapse,
	useDisclosure,
	Icon,
	useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiMessageCircle } from "react-icons/fi";
import CommentInput from "./CommentInput";
import CommentsList from "./CommentsList";

const CommentSection = ({
	comments = [],
	onAddComment,
	onDeleteComment,
	type = "post",
	targetId,
	showByDefault = false,
}) => {
	const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: showByDefault });
	const [localComments, setLocalComments] = useState(comments);
	const panelBg = useColorModeValue("white", "gray.900");
	const panelBorder = useColorModeValue("gray.200", "whiteAlpha.200");
	const accentBg = useColorModeValue("blue.50", "whiteAlpha.100");
	const accentBorder = useColorModeValue("blue.100", "whiteAlpha.200");
	const mutedText = useColorModeValue("gray.600", "gray.300");

	useEffect(() => {
		setLocalComments(comments);
	}, [comments]);

	const handleAddComment = (newComment) => {
		setLocalComments((prev) => [...prev, newComment]);
		if (onAddComment) {
			onAddComment(newComment);
		}
	};

	const handleDeleteComment = (commentId) => {
		setLocalComments((prev) => prev.filter((comment) => comment._id !== commentId));
		if (onDeleteComment) {
			onDeleteComment(commentId);
		}
	};

	return (
		<Box>
			<Button
				variant="ghost"
				size="sm"
				onClick={onToggle}
				fontSize="sm"
				color={isOpen ? "blue.500" : mutedText}
				leftIcon={<Icon as={FiMessageCircle} />}
				bg={isOpen ? accentBg : "transparent"}
				borderWidth="1px"
				borderColor={isOpen ? accentBorder : "transparent"}
				borderRadius="full"
				_hover={{
					color: "blue.500",
					bg: accentBg,
				}}
				px={3}
				py={2}
				h="auto"
			>
				{localComments.length} {localComments.length === 1 ? "comment" : "comments"}
				{isOpen ? " • Hide" : " • Show"}
			</Button>

			<Collapse in={isOpen} animateOpacity>
				<Box
					mt={4}
					borderWidth="1px"
					borderColor={panelBorder}
					bg={panelBg}
					borderRadius="xl"
					overflow="hidden"
				>
					<Box px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }} bg={accentBg} borderBottomWidth="1px" borderColor={panelBorder}>
						<CommentInput
							onComment={handleAddComment}
							type={type}
							targetId={targetId}
							placeholder={`Write a ${type === "post" ? "comment" : "reply"}...`}
						/>
					</Box>

					{localComments.length > 0 ? (
						<Box px={{ base: 3, md: 4 }} py={{ base: 3, md: 4 }}>
							<CommentsList
								comments={localComments}
								onDeleteComment={handleDeleteComment}
								type={type}
								targetId={targetId}
							/>
						</Box>
					) : (
						<Box px={4} py={8} textAlign="center">
							<Text color={mutedText} fontSize="sm">
								No {type === "post" ? "comments" : "replies"} yet. Be the first to {type === "post" ? "comment" : "reply"}.
							</Text>
						</Box>
					)}
				</Box>
			</Collapse>
		</Box>
	);
};

export default CommentSection;
