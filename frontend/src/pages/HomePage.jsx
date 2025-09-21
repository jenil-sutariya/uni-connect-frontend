import { Box, Flex, Spinner, VStack, Heading, Text, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import AnnouncementCard from "../components/AnnouncementCard";
import ErrorBoundary from "../components/ErrorBoundary";

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [announcements, setAnnouncements] = useState([]);
	const [loading, setLoading] = useState(true);
	const [announcementsLoading, setAnnouncementsLoading] = useState(true);
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();
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
				console.log(data);
				setPosts(Array.isArray(data) ? data : []);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]); // Ensure posts is always an array
			} finally {
				setLoading(false);
			}
		};

		const getAnnouncements = async () => {
			if (user?.role === "student") {
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
					setAnnouncements([]); // Ensure announcements is always an array
				} finally {
					setAnnouncementsLoading(false);
				}
			}
		};

		getFeedPosts();
		getAnnouncements();
	}, [showToast, setPosts, user]);

	return (
		<Flex gap='10' alignItems={"flex-start"}>
			<Box flex={70}>
				{/* Tab Navigation for Students */}
				{user?.role === "student" ? (
					<Tabs variant="enclosed" colorScheme="blue">
						<TabList>
							<Tab>
								<HStack>
									<Text>Posts</Text>
									<Badge colorScheme="blue" borderRadius="full">
										{Array.isArray(posts) ? posts.length : 0}
									</Badge>
								</HStack>
							</Tab>
							<Tab>
								<HStack>
									<Text>Announcements</Text>
									<Badge colorScheme="red" borderRadius="full">
										{Array.isArray(announcements) ? announcements.length : 0}
									</Badge>
								</HStack>
							</Tab>
						</TabList>

						<TabPanels>
							{/* Posts Tab */}
							<TabPanel px={0}>
								{!loading && Array.isArray(posts) && posts.length === 0 && (
									<Text textAlign="center" py={8} color="gray.500">
										Follow some users to see the feed
									</Text>
								)}

								{loading && (
									<Flex justify='center' py={8}>
										<Spinner size='xl' />
									</Flex>
								)}

								{Array.isArray(posts) && posts.map((post) => (
									<Post key={post._id} post={post} postedBy={post.postedBy} />
								))}
							</TabPanel>

							{/* Announcements Tab */}
							<TabPanel px={0}>
								{!announcementsLoading && Array.isArray(announcements) && announcements.length === 0 && (
									<Box textAlign="center" py={8}>
										<Text color="gray.500" fontSize="lg">
											No announcements for your department
										</Text>
										<Text color="gray.400" mt={2} fontSize="sm">
											Check back later for updates from professors
										</Text>
									</Box>
								)}

								{announcementsLoading && (
									<Flex justify='center' py={8}>
										<Spinner size='xl' />
									</Flex>
								)}

								<VStack spacing={4} align="stretch">
									{Array.isArray(announcements) && announcements.map((announcement) => (
										<AnnouncementCard
											key={announcement._id}
											announcement={announcement}
											onDelete={() => {}}
											isProfessorView={false}
										/>
									))}
								</VStack>
							</TabPanel>
						</TabPanels>
					</Tabs>
				) : (
					// For professors and others, show only posts
					<>
						{!loading && Array.isArray(posts) && posts.length === 0 && (
							<Text textAlign="center" py={8} color="gray.500">
								Follow some users to see the feed
							</Text>
						)}

						{loading && (
							<Flex justify='center' py={8}>
								<Spinner size='xl' />
							</Flex>
						)}

						{Array.isArray(posts) && posts.map((post) => (
							<Post key={post._id} post={post} postedBy={post.postedBy} />
						))}
					</>
				)}
			</Box>
			<Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}
			>
				<ErrorBoundary>
					<SuggestedUsers />
				</ErrorBoundary>
			</Box>
		</Flex>
	);
};

export default HomePage;
