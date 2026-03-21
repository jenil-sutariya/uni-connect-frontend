import {
	Box,
	Text,
	Button,
	Collapse,
	useDisclosure,
	Icon,
	Flex,
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
	showByDefault = false 
}) => {
	const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: showByDefault });
	const [localComments, setLocalComments] = useState(comments);

	useEffect(() => {
		setLocalComments(comments);
	}, [comments]);

	const handleAddComment = (newComment) => {
		setLocalComments(prev => [...prev, newComment]);
		if (onAddComment) {
			onAddComment(newComment);
		}
	};

	const handleDeleteComment = (commentId) => {
		setLocalComments(prev => prev.filter(comment => comment._id !== commentId));
		if (onDeleteComment) {
			onDeleteComment(commentId);
		}
	};

	return (
		<Box>
			{/* Toggle Comments Button */}
			<Button
				variant="ghost"
				size="sm"
				onClick={onToggle}
				fontSize="sm"
				color="gray.500"
				leftIcon={<Icon as={FiMessageCircle} />}
				_hover={{ 
					color: "blue.500",
					bg: "transparent"
				}}
				px={2}
				py={1}
				h="auto"
			>
				{localComments.length} {localComments.length === 1 ? 'comment' : 'comments'}
				{isOpen ? ' - Hide' : ' - Show'}
			</Button>

			{/* Comments Section with Thread Line */}
			<Collapse in={isOpen} animateOpacity>
				<Flex mt={3} position="relative">
					{/* Vertical Thread Line */}
					<Box
						position="absolute"
						left={{ base: "14px", md: "20px" }}
						top="0"
						bottom="0"
						width="2px"
						bg="gray.300"
						zIndex={1}
					/>
					
					{/* Comment Input */}
					<Box ml={{ base: "28px", md: "40px" }} flex={1}>
						<CommentInput
							onComment={handleAddComment}
							type={type}
							targetId={targetId}
							placeholder={`Write a ${type === 'post' ? 'comment' : 'reply'}...`}
						/>
					</Box>
				</Flex>

				{/* Comments List with Thread Line */}
				{localComments.length > 0 && (
					<Flex mt={2} position="relative">
						{/* Vertical Thread Line */}
						<Box
							position="absolute"
							left={{ base: "14px", md: "20px" }}
							top="0"
							bottom="0"
							width="2px"
							bg="gray.300"
							zIndex={1}
						/>
						
						<Box ml={{ base: "28px", md: "40px" }} flex={1}>
							<CommentsList
								comments={localComments}
								onDeleteComment={handleDeleteComment}
								type={type}
								targetId={targetId}
							/>
						</Box>
					</Flex>
				)}

				{localComments.length === 0 && isOpen && (
					<Box mt={4} textAlign="center">
						<Text color="gray.500" fontSize="sm">
							No {type === 'post' ? 'comments' : 'replies'} yet. Be the first to {type === 'post' ? 'comment' : 'reply'}!
						</Text>
					</Box>
				)}
			</Collapse>
		</Box>
	);
};

export default CommentSection;
