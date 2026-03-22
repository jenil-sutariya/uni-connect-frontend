import { Badge, Box, Button, Flex, Heading, Text, VStack, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import AnnouncementCard from "../components/AnnouncementCard";
import CreateAnnouncementModal from "../components/CreateAnnouncementModal";
import AppButton from "../components/ui/AppButton";
import AppSurface from "../components/ui/AppSurface";
import EmptyState from "../components/ui/EmptyState";
import SectionHeader from "../components/ui/SectionHeader";

const ProfessorDashboard = () => {
	const user = useRecoilValue(userAtom);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [announcements, setAnnouncements] = useState([]);
	const [loading, setLoading] = useState(false);
	const showToast = useShowToast();
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");
	const emptyBadgeBg = useColorModeValue("blue.100", "blue.400");
	const emptyBadgeColor = useColorModeValue("blue.700", "gray.900");

	const fetchAnnouncements = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/announcements/professor");
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

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
		setAnnouncements((prev) => [newAnnouncement, ...prev]);
		onClose();
		showToast("Success", "Announcement created successfully!", "success");
	};

	const handleAnnouncementDeleted = (announcementId) => {
		setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== announcementId));
		showToast("Success", "Announcement deleted successfully!", "success");
	};

	if (user?.role !== "professor") {
		return (
			<Box py={{ base: 4, md: 8 }}>
				<Box className='glass-panel px-6 py-12 text-center'>
					<Heading size='lg' color='red.300'>
						Access Denied
					</Heading>
					<Text mt={4} color={bodyColor}>
						This page is only accessible to professors.
					</Text>
				</Box>
			</Box>
		);
	}

	return (
		<Box py={{ base: 4, md: 8 }}>
			<VStack spacing={{ base: 6, md: 8 }} align='stretch'>
				<AppSurface variant='strong' className='px-6 py-7 md:px-8 md:py-8'>
					<SectionHeader
						eyebrow='Faculty Broadcast Hub'
						title='Professor Dashboard'
						description={`Welcome, ${user?.name} • ${user?.department?.fullName}`}
						action={
							<AppButton onClick={onOpen} variant='secondary' className='!w-full md:!w-auto'>
							Create Announcement
							</AppButton>
						}
					/>
				</AppSurface>

				<AppSurface variant='default' className='px-5 py-5 md:px-6 md:py-6'>
					<Flex justify='space-between' align={{ base: "flex-start", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3} mb={5}>
						<Box>
							<Text className='section-eyebrow mb-2'>Announcements</Text>
							<Heading size={{ base: "md", md: "lg" }} color={titleColor}>
								My Announcements
							</Heading>
						</Box>
						<Badge bg={emptyBadgeBg} color={emptyBadgeColor} borderRadius='full' px={3} py={1.5} fontSize='sm' fontWeight='semibold'>
							{announcements.length}
						</Badge>
					</Flex>

					<VStack spacing={6} align='stretch'>
						{loading ? (
							<Box textAlign='center' py={12}>
								<Text color={bodyColor} fontSize='lg'>
									Loading announcements...
								</Text>
							</Box>
						) : announcements.length === 0 ? (
							<EmptyState
								title='No announcements yet'
								description='Create your first announcement to start broadcasting campus updates.'
								action={<AppButton onClick={onOpen} variant='secondary'>Create Announcement</AppButton>}
							/>
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
				</AppSurface>
			</VStack>

			<CreateAnnouncementModal
				isOpen={isOpen}
				onClose={onClose}
				onAnnouncementCreated={handleAnnouncementCreated}
			/>
		</Box>
	);
};

export default ProfessorDashboard;
