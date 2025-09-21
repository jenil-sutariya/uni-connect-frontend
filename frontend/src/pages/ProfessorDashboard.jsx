import {
	Box,
	Container,
	Heading,
	Button,
	VStack,
	HStack,
	Text,
	useDisclosure,
	Badge,
	useColorModeValue,
	Card,
	CardBody,
	CardHeader,
	Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import CreateAnnouncementModal from "../components/CreateAnnouncementModal";
import AnnouncementCard from "../components/AnnouncementCard";
import useShowToast from "../hooks/useShowToast";

const ProfessorDashboard = () => {
	const user = useRecoilValue(userAtom);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [announcements, setAnnouncements] = useState([]);
	const [loading, setLoading] = useState(false);
	const showToast = useShowToast();
	const bgColor = useColorModeValue("white", "gray.800");

	const fetchAnnouncements = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/announcements/professor");
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			// Debug: Check if announcements have photos
			console.log("Received announcements:", data.length);
			data.forEach((ann, index) => {
				console.log(`Frontend - Announcement ${index + 1}: ${ann.title}, Photos: ${ann.photos ? ann.photos.length : 0}`);
				if (ann.photos && ann.photos.length > 0) {
					console.log("Photo URLs received:", ann.photos);
				}
			});

			setAnnouncements(data);
		} catch (error) {
			showToast("Error", "Failed to fetch announcements", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user?.role === "professor") {
			fetchAnnouncements();
		}
	}, [user]);

	const handleAnnouncementCreated = (newAnnouncement) => {
		setAnnouncements(prev => [newAnnouncement, ...prev]);
		onClose();
		showToast("Success", "Announcement created successfully!", "success");
	};

	const handleAnnouncementDeleted = (announcementId) => {
		setAnnouncements(prev => prev.filter(ann => ann._id !== announcementId));
		showToast("Success", "Announcement deleted successfully!", "success");
	};

	if (user?.role !== "professor") {
		return (
			<Container maxW="container.md" py={8}>
				<Box textAlign="center">
					<Heading size="lg" color="red.500">
						Access Denied
					</Heading>
					<Text mt={4}>
						This page is only accessible to professors.
					</Text>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxW="container.xl" py={8}>
			<VStack spacing={8} align="stretch">
				{/* Header Card */}
				<Card bg={bgColor} shadow="lg" borderRadius="xl" overflow="hidden">
					<CardBody p={8}>
						<HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
							<VStack align="start" spacing={2}>
								<Heading size="xl" bgGradient="linear(to-r, blue.400, blue.600)" bgClip="text">
									Professor Dashboard
								</Heading>
								<Text color="gray.600" fontSize="lg">
									Welcome, {user?.name} - {user?.department?.fullName}
								</Text>
							</VStack>
							<Button
								colorScheme="blue"
								onClick={onOpen}
								size="lg"
								px={8}
								py={6}
								fontSize="md"
								fontWeight="semibold"
								_hover={{
									transform: "translateY(-2px)",
									shadow: "lg"
								}}
								transition="all 0.2s"
							>
								Create Announcement
							</Button>
						</HStack>
					</CardBody>
				</Card>

				{/* Announcements Section */}
				<Card bg={bgColor} shadow="lg" borderRadius="xl" overflow="hidden">
					<CardHeader pb={4}>
						<HStack justify="space-between" align="center">
							<Heading size="lg" color="gray.700">
								My Announcements
							</Heading>
							<Badge 
								colorScheme="blue" 
								borderRadius="full" 
								px={3} 
								py={1}
								fontSize="sm"
								fontWeight="bold"
							>
								{announcements.length}
							</Badge>
						</HStack>
						<Divider mt={4} />
					</CardHeader>
					<CardBody pt={0}>
						<VStack spacing={6} align="stretch">
							{loading ? (
								<Box textAlign="center" py={12}>
									<Text color="gray.500" fontSize="lg">
										Loading announcements...
									</Text>
								</Box>
							) : announcements.length === 0 ? (
								<Box textAlign="center" py={16}>
									<VStack spacing={4}>
										<Text color="gray.500" fontSize="xl" fontWeight="medium">
											No announcements yet
										</Text>
										<Text color="gray.400" fontSize="md">
											Create your first announcement to get started
										</Text>
										<Button
											colorScheme="blue"
											mt={6}
											onClick={onOpen}
											size="lg"
											px={8}
											py={6}
											_hover={{
												transform: "translateY(-2px)",
												shadow: "lg"
											}}
											transition="all 0.2s"
										>
											Create Announcement
										</Button>
									</VStack>
								</Box>
							) : (
								announcements.map((announcement) => (
									<AnnouncementCard
										key={announcement._id}
										announcement={announcement}
										onDelete={handleAnnouncementDeleted}
										isProfessorView={true}
									/>
								))
							)}
						</VStack>
					</CardBody>
				</Card>
			</VStack>

			{/* Create Announcement Modal */}
			<CreateAnnouncementModal
				isOpen={isOpen}
				onClose={onClose}
				onAnnouncementCreated={handleAnnouncementCreated}
			/>
		</Container>
	);
};

export default ProfessorDashboard;
