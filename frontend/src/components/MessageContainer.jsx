import { Avatar, Button, Divider, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext.jsx";
import messageSound from "../assets/sounds/message.mp3";

const MessageContainer = () => {
	const showToast = useShowToast();
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const resetSelectedConversation = useResetRecoilState(selectedConversationAtom);
	const [loadingMessages, setLoadingMessages] = useState(true);
	const [messages, setMessages] = useState([]);
	const currentUser = useRecoilValue(userAtom);
	const { socket } = useSocket();
	const setConversations = useSetRecoilState(conversationsAtom);
	const messageEndRef = useRef(null);
	const panelBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const mutedText = useColorModeValue("gray.500", "gray.400");
	const skeletonStart = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const skeletonEnd = useColorModeValue("blackAlpha.200", "whiteAlpha.200");

	useEffect(() => {
		if (!socket) return;

		const handleNewMessage = (message) => {
			if (selectedConversation._id === message.conversationId) {
				setMessages((prev) => [...prev, message]);
			}

			// make a sound if the window is not focused
			if (!document.hasFocus()) {
				const sound = new Audio(messageSound);
				sound.play();
			}

			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === message.conversationId) {
						return {
							...conversation,
							lastMessage: {
								text: message.text,
								sender: message.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		};

		socket.on("newMessage", handleNewMessage);

		return () => socket.off("newMessage", handleNewMessage);
	}, [socket, selectedConversation, setConversations]);

	useEffect(() => {
		if (!socket) return;

		const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
		if (lastMessageIsFromOtherUser) {
			socket.emit("markMessagesAsSeen", {
				conversationId: selectedConversation._id,
				userId: selectedConversation.userId,
			});
		}

		const handleMessagesSeen = ({ conversationId }) => {
			if (selectedConversation._id === conversationId) {
				setMessages((prev) => {
					const updatedMessages = prev.map((message) => {
						if (!message.seen) {
							return {
								...message,
								seen: true,
							};
						}
						return message;
					});
					return updatedMessages;
				});
			}
		};

		socket.on("messagesSeen", handleMessagesSeen);

		return () => socket.off("messagesSeen", handleMessagesSeen);
	}, [socket, currentUser._id, messages, selectedConversation]);

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		const getMessages = async () => {
			setLoadingMessages(true);
			setMessages([]);
			try {
				if (selectedConversation.mock) return;
				const res = await fetch(`/api/messages/${selectedConversation.userId}`);
				const data = await res.json();
				if (!res.ok) {
					if (res.status !== 404) {
						showToast("Error", data.error || data.message || "Failed to load messages", "error");
					}
					setMessages([]);
					return;
				}
				setMessages(Array.isArray(data) ? data : []);
			} catch (error) {
				showToast("Error", error.message, "error");
				setMessages([]);
			} finally {
				setLoadingMessages(false);
			}
		};

		getMessages();
	}, [showToast, selectedConversation.userId, selectedConversation.mock]);

	return (
		<Flex
			flex={1}
			w='full'
			minH={{ base: "calc(100vh - 170px)", md: "520px" }}
			maxH={{ lg: "calc(100vh - 190px)" }}
			borderRadius={"xl"}
			p={{ base: 3, md: 4 }}
			flexDirection={"column"}
			overflow='hidden'
			className='glass-panel-strong'
		>
			<Flex w={"full"} minH={12} alignItems={"center"} justify='space-between' gap={3} pb={3}>
				<Flex align='center' gap={3} minW={0}>
					<Button
						display={{ base: "inline-flex", lg: "none" }}
						variant='unstyled'
						className='app-button app-button-ghost !h-9 !px-4'
						onClick={() => resetSelectedConversation()}
					>
						Back
					</Button>
					<Avatar src={selectedConversation.userProfilePic} size={"sm"} />
					<Flex direction='column' minW={0}>
						<Text display={"flex"} alignItems={"center"} noOfLines={1} fontWeight='semibold' color={titleColor}>
							{selectedConversation.username}
						</Text>
						<Text fontSize='xs' color={mutedText}>
							Direct conversation
						</Text>
					</Flex>
				</Flex>
				<Text fontSize='xs' color={mutedText} display={{ base: "none", md: "block" }}>
					Seen status updates live
				</Text>
			</Flex>

			<Divider borderColor={panelBorder} />

			<Flex flex={1} flexDir={"column"} gap={4} my={4} pr={1} overflowY={"auto"}>
				{loadingMessages &&
					[...Array(5)].map((_, i) => (
						<Flex
							key={i}
							gap={2}
							alignItems={"center"}
							p={1}
							borderRadius={"md"}
							alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
						>
							{i % 2 === 0 && <SkeletonCircle size={7} startColor={skeletonStart} endColor={skeletonEnd} />}
							<Flex flexDir={"column"} gap={2}>
								<Skeleton h='8px' w={{ base: "160px", sm: "250px" }} startColor={skeletonStart} endColor={skeletonEnd} />
								<Skeleton h='8px' w={{ base: "160px", sm: "250px" }} startColor={skeletonStart} endColor={skeletonEnd} />
								<Skeleton h='8px' w={{ base: "160px", sm: "250px" }} startColor={skeletonStart} endColor={skeletonEnd} />
							</Flex>
							{i % 2 !== 0 && <SkeletonCircle size={7} startColor={skeletonStart} endColor={skeletonEnd} />}
						</Flex>
					))}

				{!loadingMessages &&
					messages.map((message, index) => (
						<Flex
							key={message._id}
							direction={"column"}
							ref={messages.length - 1 === index ? messageEndRef : null}
						>
							<Message message={message} ownMessage={currentUser._id === message.sender} />
						</Flex>
					))}
			</Flex>

			<MessageInput setMessages={setMessages} />
		</Flex>
	);
};

export default MessageContainer;
