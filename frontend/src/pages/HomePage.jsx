import {
	Badge,
	Box,
	Flex,
	HStack,
	SimpleGrid,
	Spinner,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import AnnouncementCard from "../components/AnnouncementCard";
import ErrorBoundary from "../components/ErrorBoundary";
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";
import EmptyState from "../components/ui/EmptyState";
import AppSurface from "../components/ui/AppSurface";
import SectionHeader from "../components/ui/SectionHeader";
import useShowToast from "../hooks/useShowToast";

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [announcements, setAnnouncements] = useState([]);
	const [loading, setLoading] = useState(true);
	const [announcementsLoading, setAnnouncementsLoading] = useState(true);
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");
	const mutedColor = useColorModeValue("gray.500", "gray.400");
	const statBg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
	const statBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const selectedPostBg = useColorModeValue("blue.50", "whiteAlpha.100");
	const selectedAnnouncementBg = useColorModeValue("purple.50", "purple.900");

	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch("/api/posts/feed");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts(Array.isArray(data) ? data : []);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setLoading(false);
			}
		};

		const getAnnouncements = async () => {
			if (user?.role !== "student") {
				setAnnouncements([]);
				setAnnouncementsLoading(false);
				return;
			}

			setAnnouncementsLoading(true);
			try {
				const res = await fetch("/api/announcements/feed");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setAnnouncements(Array.isArray(data) ? data : []);
			} catch (error) {
				showToast("Error", "Failed to fetch announcements", "error");
				setAnnouncements([]);
			} finally {
				setAnnouncementsLoading(false);
			}
		};

		getFeedPosts();
		getAnnouncements();
	}, [setPosts, showToast, user]);

	const metrics = [
		{ label: "Feed Posts", value: Array.isArray(posts) ? posts.length : 0 },
		{ label: "Announcements", value: Array.isArray(announcements) ? announcements.length : 0 },
		{ label: "Workspace", value: user?.role === "professor" ? "Faculty" : "Student" },
	];

	return (
		<Flex gap={{ base: 6, xl: 8 }} align='flex-start' direction={{ base: "column", xl: "row" }} justify="center">
			<Box flex={1} w='full' maxW={{ base: "100%", md: "840px" }} mx={{ base: "none", md: "auto", xl: "0" }}>
				<VStack align='stretch' spacing={{ base: 5, md: 6 }}>
					<AppSurface variant='strong' className='px-6 py-6 md:px-8 md:py-8'>
						<SectionHeader
							eyebrow='Campus Feed'
							title='A cleaner daily workspace for campus updates'
							description='Follow classmates, catch department announcements, and move between discussions without the UI feeling heavy.'
						/>

						<SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} mt={5}>
							{metrics.map((metric) => (
								<Box key={metric.label} bg={statBg} borderWidth='1px' borderColor={statBorder} borderRadius='20px' px={4} py={4}>
									<Text fontSize='xs' textTransform='uppercase' letterSpacing='0.16em' color={mutedColor}>
										{metric.label}
									</Text>
									<Text mt={2} className='font-display text-2xl font-semibold' color={titleColor}>
										{metric.value}
									</Text>
								</Box>
							))}
						</SimpleGrid>

						<AppSurface variant='subtleStrong' mt={4} className='px-4 py-3.5 md:px-5'>
							<Text color={titleColor} fontWeight='semibold'>
								Post sharing is now available from anywhere in the app
							</Text>
							<Text mt={1} color={bodyColor} fontSize='sm' lineHeight='1.6'>
								Use the floating create button to publish a new update from the feed, profile, chat, or dashboard.
							</Text>
						</AppSurface>
					</AppSurface>

					{user?.role === "student" ? (
						<Tabs variant='unstyled'>
							<TabList className='glass-panel inline-flex flex-wrap gap-2 p-2'>
								<Tab
									borderRadius='full'
									px={5}
									py={3}
									fontWeight='semibold'
									color={mutedColor}
									_selected={{ color: titleColor, bg: selectedPostBg }}
								>
									<HStack spacing={2}>
										<Text>Posts</Text>
										<Badge colorScheme='blue' borderRadius='full' px={2.5} py={1}>
											{Array.isArray(posts) ? posts.length : 0}
										</Badge>
									</HStack>
								</Tab>
								<Tab
									borderRadius='full'
									px={5}
									py={3}
									fontWeight='semibold'
									color={mutedColor}
									_selected={{ color: titleColor, bg: selectedAnnouncementBg }}
								>
									<HStack spacing={2}>
										<Text>Announcements</Text>
										<Badge colorScheme='purple' borderRadius='full' px={2.5} py={1}>
											{Array.isArray(announcements) ? announcements.length : 0}
										</Badge>
									</HStack>
								</Tab>
							</TabList>

							<TabPanels>
								<TabPanel px={0} pt={4}>
									{loading ? (
										<Flex justify='center' py={12}>
											<Spinner size='xl' color='brand.400' thickness='4px' />
										</Flex>
									) : Array.isArray(posts) && posts.length === 0 ? (
										<EmptyState
											title='No posts in your feed yet'
											description='Follow some classmates or professors to start seeing updates here.'
										/>
									) : (
										<VStack spacing={5} align='stretch'>
											{Array.isArray(posts) && posts.map((post) => <Post key={post._id} post={post} postedBy={post.postedBy} />)}
										</VStack>
									)}
								</TabPanel>

								<TabPanel px={0} pt={4}>
									{announcementsLoading ? (
										<Flex justify='center' py={12}>
											<Spinner size='xl' color='brand.400' thickness='4px' />
										</Flex>
									) : Array.isArray(announcements) && announcements.length === 0 ? (
										<EmptyState
											title='No department announcements right now'
											description='Check back later for faculty updates and academic notices.'
										/>
									) : (
										<VStack spacing={5} align='stretch'>
											{Array.isArray(announcements) &&
												announcements.map((announcement) => (
													<AnnouncementCard
														key={announcement._id}
														announcement={announcement}
														onDelete={() => {}}
														isProfessorView={false}
													/>
												))}
										</VStack>
									)}
								</TabPanel>
							</TabPanels>
						</Tabs>
					) : (
						<>
							{loading ? (
								<Flex justify='center' py={12}>
									<Spinner size='xl' color='brand.400' thickness='4px' />
								</Flex>
							) : Array.isArray(posts) && posts.length === 0 ? (
								<EmptyState title='No recent posts yet' description='Follow some users to start building your stream.' />
							) : (
								<VStack spacing={5} align='stretch'>
									{Array.isArray(posts) && posts.map((post) => <Post key={post._id} post={post} postedBy={post.postedBy} />)}
								</VStack>
							)}
						</>
					)}
				</VStack>
			</Box>

			<Box w={{ base: "full", xl: "320px" }} flexShrink={0}>
				<ErrorBoundary>
					<SuggestedUsers />
				</ErrorBoundary>
			</Box>
		</Flex>
	);
};

export default HomePage;
