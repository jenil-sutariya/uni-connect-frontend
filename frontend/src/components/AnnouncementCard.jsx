import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Avatar,
	Badge,
	Box,
	Button,
	Flex,
	Icon,
	Image,
	SimpleGrid,
	Text,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
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
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");
	const mutedColor = useColorModeValue("gray.500", "gray.400");
	const threadColor = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
	const imageBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const dialogBg = useColorModeValue("white", "gray.900");

	const getPriorityColorScheme = (priority) => {
		switch (priority?.toLowerCase()) {
			case "urgent":
				return "red";
			case "high":
				return "orange";
			case "medium":
				return "yellow";
			case "low":
				return "green";
			default:
				return "gray";
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
			<Box className='glass-panel surface-hover px-5 py-5 md:px-6 md:py-6'>
				<Flex gap={{ base: 4, md: 5 }} alignItems='flex-start'>
					<Flex flexDirection='column' alignItems='center' gap={3}>
						<Avatar
							size='md'
							name={announcement.postedBy?.name || announcement.postedBy?.username}
							src={announcement.postedBy?.profilePic}
						/>
						<Box w='1px' h='full' bg={threadColor} />
						<Box position='relative' w='12' h='12'>
							{(!announcement.replies || announcement.replies?.length === 0) && (
								<Text textAlign='center' color={mutedColor}>
									•
								</Text>
							)}
							{announcement.replies?.[0] && (
								<Avatar size='xs' src={announcement.replies[0].userProfilePic} position='absolute' top='1' left='4' />
							)}
							{announcement.replies?.[1] && (
								<Avatar size='xs' src={announcement.replies[1].userProfilePic} position='absolute' bottom='1' right='0' />
							)}
							{announcement.replies?.[2] && (
								<Avatar size='xs' src={announcement.replies[2].userProfilePic} position='absolute' bottom='1' left='1' />
							)}
						</Box>
					</Flex>

					<Flex flex={1} flexDirection='column' gap={4} minW={0}>
						<Flex justifyContent='space-between' w='full' gap={3} alignItems={{ base: "flex-start", sm: "center" }} flexWrap='wrap'>
							<Flex flex={1} minW={0} alignItems='center' flexWrap='wrap' gap={2}>
								<Text className='font-display text-base font-semibold' color={titleColor} noOfLines={1}>
									{announcement.postedBy?.username}
								</Text>
								<Badge colorScheme={getPriorityColorScheme(announcement.priority)} borderRadius='full' px={3} py={1}>
									{announcement.priority?.toUpperCase()}
								</Badge>
								<Badge colorScheme='blue' variant='subtle' borderRadius='full' px={3} py={1}>
									Announcement
								</Badge>
							</Flex>

							<Flex gap={{ base: 2, md: 3 }} alignItems='center' flexShrink={0}>
								<Text fontSize='xs' whiteSpace='nowrap' color={mutedColor}>
									{formatTimeAgo(announcement.createdAt)}
								</Text>
								{isProfessorView && user?._id === announcement.postedBy?._id && (
									<Box as='button' onClick={onOpen} className='danger-soft-button !p-2'>
										<DeleteIcon boxSize={3.5} />
									</Box>
								)}
							</Flex>
						</Flex>

						<Box>
							<Text className='font-display text-xl font-semibold' color={titleColor} wordBreak='break-word'>
								{announcement.title}
							</Text>
							<Text mt={3} fontSize='sm' color={bodyColor} lineHeight='1.75' wordBreak='break-word'>
								{announcement.content}
							</Text>
						</Box>

						{announcement.photos && Array.isArray(announcement.photos) && announcement.photos.length > 0 && (
							<Box>
								{announcement.photos.length === 1 ? (
									<Box borderRadius='24px' overflow='hidden' borderWidth='1px' borderColor={imageBorder}>
										<Image
											src={announcement.photos[0]}
											alt='Announcement photo'
											w='full'
											maxH='460px'
											objectFit='cover'
											onError={(e) => {
												e.target.style.display = "none";
											}}
										/>
									</Box>
								) : (
									<Box>
										<Text fontSize='sm' color={mutedColor} mb={3}>
											{announcement.photos.length} supporting images
										</Text>
										<SimpleGrid columns={{ base: 1, sm: 2, md: announcement.photos.length === 3 ? 3 : 2 }} spacing={3}>
											{announcement.photos.slice(0, 4).map((photo, index) => (
												<Box key={index} position='relative' borderRadius='20px' overflow='hidden' borderWidth='1px' borderColor={imageBorder}>
													<Image
														src={photo}
														alt={`Announcement photo ${index + 1}`}
														w='full'
														h={{ base: "220px", sm: "180px" }}
														objectFit='cover'
														onError={(e) => {
															e.target.style.display = "none";
														}}
													/>
													{index === 3 && announcement.photos.length > 4 && (
														<Flex
															position='absolute'
															top={0}
															left={0}
															right={0}
															bottom={0}
															bg='blackAlpha.700'
															align='center'
															justify='center'
															color='white'
															fontSize='lg'
															fontWeight='bold'
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

						<Flex gap={2} my={1} fontSize='xs' flexWrap='wrap'>
							<Box className='metric-pill'>Departments: {announcement.targetDepartments?.join(", ")}</Box>
							<Box className='metric-pill'>Batches: {announcement.targetBatches?.join(", ")}</Box>
						</Flex>

						<Button
							variant='ghost'
							alignSelf='flex-start'
							leftIcon={<Icon as={liked ? FaHeart : FiHeart} color={liked ? "red.400" : mutedColor} />}
							onClick={handleLike}
							color={liked ? useColorModeValue("red.600", "red.200") : bodyColor}
							_hover={{ bg: useColorModeValue("blackAlpha.50", "whiteAlpha.100") }}
							borderRadius='full'
						>
							{likes} likes
						</Button>

						<CommentSection
							comments={announcement.replies || []}
							type='announcement'
							targetId={announcement._id}
							onAddComment={() => {}}
							onDeleteComment={() => {}}
						/>
					</Flex>
				</Flex>
			</Box>

			<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
				<AlertDialogOverlay backdropFilter='blur(6px)'>
					<AlertDialogContent bg={dialogBg} borderWidth='1px' borderColor={useColorModeValue("blackAlpha.100", "whiteAlpha.100")} borderRadius='24px'>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Delete Announcement
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure you want to delete this announcement? This action cannot be undone.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose} variant='ghost'>
								Cancel
							</Button>
							<Button colorScheme='red' onClick={handleDelete} ml={3} isLoading={isDeleting}>
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
