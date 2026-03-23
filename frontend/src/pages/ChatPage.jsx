import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { GiConversation } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import AppSurface from "../components/ui/AppSurface";
import EmptyState from "../components/ui/EmptyState";
import SectionHeader from "../components/ui/SectionHeader";
import { useSocket } from "../context/SocketContext";
import useShowToast from "../hooks/useShowToast";

const ChatPage = () => {
	const [searchingUser, setSearchingUser] = useState(false);
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [searchText, setSearchText] = useState("");
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	const currentUser = useRecoilValue(userAtom);
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();
	const { socket, onlineUsers } = useSocket();
	const navigate = useNavigate();
	const safeConversations = Array.isArray(conversations)
		? conversations.filter((conversation) => conversation?.participants?.[0]?._id)
		: [];
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");
	const fieldBg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
	const fieldBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const skeletonStart = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const skeletonEnd = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
	const iconColor = useColorModeValue("brand.500", "brand.300");
	const showConversationPanel = Boolean(selectedConversation._id);

	const handleUnauthorized = useCallback(() => {
		localStorage.removeItem("user-threads");
		setUser(null);
		setConversations([]);
		showToast("Session expired", "Please log in again to open chat.", "warning");
		navigate("/auth?mode=login");
	}, [navigate, setConversations, setUser, showToast]);

	useEffect(() => {
		const handleMessagesSeen = ({ conversationId }) => {
			setConversations((prev) =>
				prev.map((conversation) =>
					conversation._id === conversationId
						? {
								...conversation,
								lastMessage: {
									...conversation.lastMessage,
									seen: true,
								},
						  }
						: conversation
				)
			);
		};

		socket?.on("messagesSeen", handleMessagesSeen);
		return () => socket?.off("messagesSeen", handleMessagesSeen);
	}, [socket, setConversations]);

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("/api/messages/conversations");
				const data = await res.json();
				if (res.status === 401) {
					handleUnauthorized();
					return;
				}
				if (!res.ok) {
					showToast("Error", data.error || data.message || "Failed to load conversations", "error");
					setConversations([]);
					return;
				}
				setConversations(Array.isArray(data) ? data : []);
			} catch (error) {
				showToast("Error", error.message, "error");
				setConversations([]);
			} finally {
				setLoadingConversations(false);
			}
		};

		getConversations();
	}, [handleUnauthorized, setConversations, showToast]);

	const handleConversationSearch = async (e) => {
		e.preventDefault();
		const query = searchText.trim();
		if (!query) return;

		setSearchingUser(true);
		try {
			const res = await fetch(`/api/users/profile/${query}`);
			const searchedUser = await res.json();
			if (searchedUser.error) {
				showToast("Error", searchedUser.error, "error");
				return;
			}

			if (searchedUser._id === currentUser._id) {
				showToast("Error", "You cannot message yourself", "error");
				return;
			}

			const conversationAlreadyExists = safeConversations.find(
				(conversation) => conversation.participants[0]._id === searchedUser._id
			);

			if (conversationAlreadyExists) {
				setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					userProfilePic: searchedUser.profilePic,
				});
				return;
			}

			const mockConversation = {
				mock: true,
				lastMessage: {
					text: "",
					sender: "",
				},
				_id: Date.now(),
				participants: [
					{
						_id: searchedUser._id,
						username: searchedUser.username,
						profilePic: searchedUser.profilePic,
					},
				],
			};
			setConversations((prevConvs) => [mockConversation, ...prevConvs]);
			setSelectedConversation({
				_id: mockConversation._id,
				userId: searchedUser._id,
				username: searchedUser.username,
				userProfilePic: searchedUser.profilePic,
				mock: true,
			});
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setSearchingUser(false);
		}
	};

	return (
		<Box w='full' h={{ base: "calc(100vh - 120px)", md: "calc(100vh - 140px)" }} display="flex" flexDirection="column" overflow="hidden">
			<AppSurface variant='strong' className='px-6 py-6 md:px-8 md:py-8 flex-shrink-0' display={{ base: showConversationPanel ? "none" : "block", lg: "block" }}>
				<SectionHeader
					eyebrow='Messaging'
					title='Direct conversations with classmates and faculty'
					description='Search any user by username and switch between active campus conversations from one focused workspace.'
				/>
			</AppSurface>

			<Flex gap={{ base: 4, lg: 6 }} mt={{ base: 0, lg: 5 }} pt={{ base: showConversationPanel ? 0 : 4, lg: 0 }} direction={{ base: "column", lg: "row" }} align='stretch' flex={1} overflow="hidden">
				<Flex
					direction='column'
					gap={4}
					w='full'
					flex={{ lg: "0 0 360px" }}
					display={{ base: showConversationPanel ? "none" : "flex", lg: "flex" }}
				>
					<AppSurface variant='strong' className='px-4 py-4 md:px-5 md:py-5'>
						<SectionHeader
							eyebrow='Inbox'
							title='Your Conversations'
							description='Jump into an existing thread or search for a new person to message.'
						/>

						<Box as='form' onSubmit={handleConversationSearch} mt={5}>
							<Flex align='center' gap={2}>
								<Input
									placeholder='Search by username'
									value={searchText}
									onChange={(e) => setSearchText(e.target.value)}
									borderRadius='18px'
									bg={fieldBg}
									borderColor={fieldBorder}
								/>
								<Button isLoading={searchingUser} onClick={handleConversationSearch} className='app-button app-button-primary'>
									<SearchIcon />
								</Button>
							</Flex>
						</Box>

						<Flex direction='column' gap={2} mt={5} flex={1} overflowY='auto' pr={1}>
							{loadingConversations &&
								[0, 1, 2, 3, 4].map((_, i) => (
									<Flex key={i} gap={4} alignItems='center' p={3} borderRadius='2xl' className='surface-subtle'>
										<SkeletonCircle size='10' startColor={skeletonStart} endColor={skeletonEnd} />
										<Flex w='full' flexDirection='column' gap={3}>
											<Skeleton h='10px' w='80px' startColor={skeletonStart} endColor={skeletonEnd} />
											<Skeleton h='8px' w='90%' startColor={skeletonStart} endColor={skeletonEnd} />
										</Flex>
									</Flex>
								))}

							{!loadingConversations &&
								safeConversations.map((conversation) => (
									<Conversation
										key={conversation._id}
										isOnline={onlineUsers.includes(conversation.participants[0]._id)}
										conversation={conversation}
									/>
								))}

							{!loadingConversations && safeConversations.length === 0 && (
								<EmptyState
									title='No conversations yet'
									description='Search for a username above to start your first message thread.'
									className='py-10'
								/>
							)}
						</Flex>
					</AppSurface>
				</Flex>

				<Box flex={1} w='full' display={{ base: showConversationPanel ? "flex" : "none", lg: "flex" }} flexDirection="column" overflow="hidden">
					{showConversationPanel ? (
						<MessageContainer />
					) : (
						<EmptyState
							title='Select a conversation to start messaging'
							description='Pick someone from the list or search for a user to open a new thread.'
							action={
								<Box color={iconColor}>
									<GiConversation size={72} />
								</Box>
							}
							className='min-h-[340px] flex items-center justify-center'
						/>
					)}
				</Box>
			</Flex>
		</Box>
	);
};

export default ChatPage;

