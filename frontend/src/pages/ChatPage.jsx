import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
	const [searchingUser, setSearchingUser] = useState(false);
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [searchText, setSearchText] = useState("");
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	const currentUser = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const { socket, onlineUsers } = useSocket();

	useEffect(() => {
		const handleMessagesSeen = ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		};

		socket?.on("messagesSeen", handleMessagesSeen);

		return () => socket?.off("messagesSeen", handleMessagesSeen);
	}, [socket, setConversations]);

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("/api/messages/conversations");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				console.log(data);
				setConversations(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingConversations(false);
			}
		};

		getConversations();
	}, [showToast, setConversations]);

	const handleConversationSearch = async (e) => {
		e.preventDefault();
		setSearchingUser(true);
		try {
			const res = await fetch(`/api/users/profile/${searchText}`);
			const searchedUser = await res.json();
			if (searchedUser.error) {
				showToast("Error", searchedUser.error, "error");
				return;
			}

			const messagingYourself = searchedUser._id === currentUser._id;
			if (messagingYourself) {
				showToast("Error", "You cannot message yourself", "error");
				return;
			}

			const conversationAlreadyExists = conversations.find(
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
			setConversations((prevConvs) => [...prevConvs, mockConversation]);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setSearchingUser(false);
		}
	};

	return (
		<Box w='full' py={{ base: 2, md: 4 }}>
			<Flex
				gap={{ base: 4, lg: 6 }}
				flexDirection={{ base: "column", lg: "row" }}
				alignItems='stretch'
				mx={"auto"}
			>
				<Flex
					flexDirection={"column"}
					gap={3}
					w='full'
					flex={{ lg: "0 0 320px" }}
					bg={useColorModeValue("white", "gray.dark")}
					borderRadius='xl'
					p={{ base: 3, md: 4 }}
				>
					<Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
						Your Conversations
					</Text>
					<form onSubmit={handleConversationSearch} style={{ width: "100%" }}>
						<Flex alignItems={"center"} gap={2}>
							<Input placeholder='Search for a user' onChange={(e) => setSearchText(e.target.value)} />
							<Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
								<SearchIcon />
							</Button>
						</Flex>
					</form>

					{loadingConversations &&
						[0, 1, 2, 3, 4].map((_, i) => (
							<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								<Flex w={"full"} flexDirection={"column"} gap={3}>
									<Skeleton h={"10px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90%"} />
								</Flex>
							</Flex>
						))}

					<Flex flexDirection='column' gap={1} maxH={{ base: "280px", lg: "70vh" }} overflowY='auto' pr={1}>
						{!loadingConversations &&
							conversations.map((conversation) => (
								<Conversation
									key={conversation._id}
									isOnline={onlineUsers.includes(conversation.participants[0]._id)}
									conversation={conversation}
								/>
							))}
					</Flex>
				</Flex>
				{!selectedConversation._id && (
					<Flex
						flex={1}
						borderRadius={"xl"}
						p={{ base: 4, md: 6 }}
						flexDir={"column"}
						alignItems={"center"}
						justifyContent={"center"}
						minH={{ base: "220px", md: "400px" }}
						bg={useColorModeValue("white", "gray.dark")}
						textAlign='center'
					>
						<GiConversation size={100} />
						<Text fontSize={20}>Select a conversation to start messaging</Text>
					</Flex>
				)}

				{selectedConversation._id && <MessageContainer />}
			</Flex>
		</Box>
	);
};

export default ChatPage;
