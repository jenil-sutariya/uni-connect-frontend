import {
	Box,
	Heading,
	Button,
	VStack,
	Flex,
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
	const headingColor = useColorModeValue("gray.700", "whiteAlpha.900");

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
			<Box py={{ base: 4, md: 8 }}>
				<Box textAlign="center">
					<Heading size="lg" color="red.500">
						Access Denied
					</Heading>
					<Text mt={4}>
						This page is only accessible to professors.
					</Text>
				</Box>
			</Box>
		);
	}

	return (
		<Box py={{ base: 4, md: 8 }}>
			<VStack spacing={{ base: 6, md: 8 }} align="stretch">
				{/* Header Card */}
				<Card bg={bgColor} shadow="lg" borderRadius="xl" overflow="hidden">
					<CardBody p={{ base: 5, md: 8 }}>
						<Flex
							justify="space-between"
							align={{ base: "stretch", md: "center" }}
							direction={{ base: "column", md: "row" }}
							gap={4}
						>
							<VStack align="start" spacing={2}>
								<Heading size={{ base: "lg", md: "xl" }} bgGradient="linear(to-r, blue.400, blue.600)" bgClip="text">
									Professor Dashboard
								</Heading>
								<Text color="gray.600" fontSize={{ base: "sm", md: "lg" }}>
									Welcome, {user?.name} - {user?.department?.fullName}
								</Text>
							</VStack>
							<Button
								colorScheme="blue"
								onClick={onOpen}
								size={{ base: "md", md: "lg" }}
								w={{ base: "full", md: "auto" }}
								px={{ base: 6, md: 8 }}
								py={{ base: 5, md: 6 }}
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
						</Flex>
					</CardBody>
				</Card>

				{/* Announcements Section */}
				<Card bg={bgColor} shadow="lg" borderRadius="xl" overflow="hidden">
					<CardHeader pb={4} px={{ base: 5, md: 6 }} pt={{ base: 5, md: 6 }}>
						<Flex justify="space-between" align={{ base: "flex-start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3}>
							<Heading size={{ base: "md", md: "lg" }} color={headingColor}>
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
						</Flex>
						<Divider mt={4} />
					</CardHeader>
					<CardBody pt={0} px={{ base: 5, md: 6 }} pb={{ base: 5, md: 6 }}>
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
										<Text color="gray.500" fontSize={{ base: "lg", md: "xl" }} fontWeight="medium">
											No announcements yet
										</Text>
										<Text color="gray.400" fontSize="md">
											Create your first announcement to get started
										</Text>
										<Button
											colorScheme="blue"
											mt={6}
											onClick={onOpen}
											size={{ base: "md", md: "lg" }}
											w={{ base: "full", sm: "auto" }}
											px={{ base: 6, md: 8 }}
											py={{ base: 5, md: 6 }}
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
		</Box>
	);
};

export default ProfessorDashboard;
