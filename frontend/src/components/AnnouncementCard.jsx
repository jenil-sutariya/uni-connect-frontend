import {
	Avatar,
	Box,
	Flex,
	Text,
	Image,
	Button,
	Badge,
	SimpleGrid,
	useColorModeValue,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	useDisclosure,
	Icon,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import CommentSection from "./CommentSection";

const formatTimeAgo = (date) => {
	const now = new Date();
	const created = new Date(date);
	const diffInSeconds = Math.floor((now - created) / 1000);

	const minutes = Math.floor(diffInSeconds / 60);
	const hours = Math.floor(diffInSeconds / 3600);
	const days = Math.floor(diffInSeconds / 86400);

	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;
	return new Date(date).toLocaleDateString();
};

const AnnouncementCard = ({ announcement, onDelete, isProfessorView = false }) => {
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef();
	const [liked, setLiked] = useState(announcement.likes?.includes(user?._id));
	const [likes, setLikes] = useState(announcement.likes?.length || 0);
	const [isDeleting, setIsDeleting] = useState(false);

	const getPriorityColor = (priority) => {
		switch (priority?.toLowerCase()) {
			case "urgent": return "red";
			case "high": return "orange";
			case "medium": return "yellow";
			case "low": return "green";
			default: return "gray";
		}
	};

	const handleLike = async () => {
		if (!user) {
			showToast("Error", "You must be logged in to like announcements", "error");
			return;
		}

		try {
			const res = await fetch(`/api/announcements/${announcement._id}/like`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			if (!liked) {
				setLikes(likes + 1);
				setLiked(true);
			} else {
				setLikes(likes - 1);
				setLiked(false);
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const res = await fetch(`/api/announcements/${announcement._id}`, {
				method: "DELETE",
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			showToast("Success", "Announcement deleted successfully", "success");
			onDelete(announcement._id);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsDeleting(false);
			onClose();
		}
	};

	if (!announcement.postedBy) return null;

	return (
		<>
			{/* Post-style layout */}
			<Flex gap={{ base: 2, md: 3 }} mb={4} py={5} alignItems='flex-start'>
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar
						size='md'
						name={announcement.postedBy?.name || announcement.postedBy?.username}
						src={announcement.postedBy?.profilePic}
					/>
					<Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
					<Box position={"relative"} w={"full"}>
						{(!announcement.replies || announcement.replies?.length === 0) && <Text textAlign={"center"}>📢</Text>}
						{announcement.replies?.[0] && (
							<Avatar
								size='xs'
								name='Reply 1'
								src={announcement.replies[0].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left='15px'
								padding={"2px"}
							/>
						)}

						{announcement.replies?.[1] && (
							<Avatar
								size='xs'
								name='Reply 2'
								src={announcement.replies[1].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								right='-5px'
								padding={"2px"}
							/>
						)}

						{announcement.replies?.[2] && (
							<Avatar
								size='xs'
								name='Reply 3'
								src={announcement.replies[2].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								left='4px'
								padding={"2px"}
							/>
						)}
					</Box>
				</Flex>
				<Flex flex={1} flexDirection={"column"} gap={2} minW={0}>
					<Flex
						justifyContent={"space-between"}
						w={"full"}
						gap={2}
						alignItems={{ base: "flex-start", sm: "center" }}
						flexWrap='wrap'
					>
						<Flex flex={1} minW={0} alignItems={"center"} flexWrap='wrap' gap={2}>
							<Text
								fontSize={"sm"}
								fontWeight={"bold"}
								noOfLines={1}
							>
								{announcement.postedBy?.username}
							</Text>
							<Badge
								colorScheme={getPriorityColor(announcement.priority)}
								variant="solid"
								fontSize="xs"
								px={2}
								py={1}
								borderRadius="md"
							>
								{announcement.priority?.toUpperCase()}
							</Badge>
						</Flex>
						<Flex gap={{ base: 2, md: 4 }} alignItems={"center"} flexShrink={0}>
							<Text fontSize={"xs"} whiteSpace='nowrap' textAlign={"right"} color={"gray.light"}>
								{formatTimeAgo(announcement.createdAt)}
							</Text>
							{isProfessorView && user?._id === announcement.postedBy?._id && (
								<DeleteIcon 
									size={20} 
									onClick={onOpen}
									cursor="pointer"
									color="red.500"
									_hover={{ color: "red.600" }}
								/>
							)}
						</Flex>
					</Flex>

					{/* Title */}
					<Text fontSize={"md"} fontWeight={"semibold"} color={useColorModeValue("gray.800", "whiteAlpha.900")} wordBreak='break-word'>
						{announcement.title}
					</Text>

					{/* Content */}
					<Text fontSize={"sm"} wordBreak='break-word'>
						{announcement.content}
					</Text>

					{/* Photos - Post-style display */}
					{announcement.photos && Array.isArray(announcement.photos) && announcement.photos.length > 0 && (
						<Box>
							{announcement.photos.length === 1 ? (
								// Single photo - full width like posts
								<Box 
									borderRadius={6} 
									overflow="hidden" 
									border="1px solid" 
									borderColor={"gray.light"}
								>
									<Image
										src={announcement.photos[0]}
										alt="Announcement photo"
										w="full"
										onError={(e) => {
											console.log("Image failed to load:", announcement.photos[0]);
											e.target.style.display = 'none';
										}}
									/>
								</Box>
							) : (
								// Multiple photos - grid layout
								<Box>
									<Text fontSize="sm" color="gray.500" mb={2}>
										📸 {announcement.photos.length} photos
									</Text>
									<SimpleGrid 
										columns={{ base: 1, sm: 2, md: announcement.photos.length === 3 ? 3 : 2 }} 
										spacing={2}
									>
										{announcement.photos.slice(0, 4).map((photo, index) => (
											<Box key={index} position="relative">
												<Box 
													borderRadius={6} 
													overflow="hidden" 
													border="1px solid" 
													borderColor={"gray.light"}
												>
													<Image
														src={photo}
														alt={`Announcement photo ${index + 1}`}
														w="full"
														h={{ base: "220px", sm: "150px" }}
														objectFit="cover"
														onError={(e) => {
															console.log("Image failed to load:", photo);
															e.target.style.display = 'none';
														}}
													/>
												</Box>
												{/* Show "+X more" overlay for 4th photo when more than 4 */}
												{index === 3 && announcement.photos.length > 4 && (
													<Flex
														position="absolute"
														top={0}
														left={0}
														right={0}
														bottom={0}
														bg="blackAlpha.700"
														borderRadius={6}
														align="center"
														justify="center"
														color="white"
														fontSize="lg"
														fontWeight="bold"
													>
														+{announcement.photos.length - 4} more
													</Flex>
												)}
											</Box>
										))}
									</SimpleGrid>
								</Box>
							)}
						</Box>
					)}

					{/* Targeting Info */}
					<Flex gap={3} my={1} fontSize="xs" color="gray.500" flexWrap='wrap' direction={{ base: "column", sm: "row" }}>
						<Text>📍 {announcement.targetDepartments?.join(', ')}</Text>
						<Text>🎓 {announcement.targetBatches?.join(', ')}</Text>
					</Flex>

					{/* Actions - Post style */}
					<Flex gap={4} my={2}>
						<Button
							variant="ghost"
							size="sm"
							leftIcon={
								<Icon as={liked ? FaHeart : FiHeart} 
									color={liked ? "red.500" : "gray.500"} 
								/>
							}
							onClick={handleLike}
							fontSize="sm"
							px={2}
							py={1}
							h="auto"
							color={liked ? "red.500" : "gray.500"}
							_hover={{ 
								color: liked ? "red.600" : "red.400",
								bg: "transparent"
							}}
						>
							{likes}
						</Button>
					</Flex>

					{/* Comment Section */}
					<CommentSection
						comments={announcement.replies || []}
						type="announcement"
						targetId={announcement._id}
						onAddComment={(newComment) => {
							// Update the announcement replies in parent component if needed
						}}
						onDeleteComment={(commentId) => {
							// Handle comment deletion in parent component if needed
						}}
					/>
				</Flex>
			</Flex>

			{/* Delete confirmation dialog */}
			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Delete Announcement
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure you want to delete this announcement? This action cannot be undone.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose}>
								Cancel
							</Button>
							<Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={isDeleting}>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default AnnouncementCard;
