import {
	Flex,
	IconButton,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";

const MessageInput = ({ setMessages }) => {
	const [messageText, setMessageText] = useState("");
	const showToast = useShowToast();
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const setConversations = useSetRecoilState(conversationsAtom);
	const imageRef = useRef(null);
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
	const [isSending, setIsSending] = useState(false);
	const fieldBg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
	const fieldBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const fieldText = useColorModeValue("gray.800", "whiteAlpha.900");
	const modalBg = useColorModeValue("whiteAlpha.900", "gray.900");
	const modalBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const iconColor = useColorModeValue("blue.500", "blue.200");

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!messageText && !imgUrl) return;
		if (isSending) return;

		setIsSending(true);

		try {
			const res = await fetch("/api/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: messageText,
					recipientId: selectedConversation.userId,
					img: imgUrl,
				}),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			setMessages((messages) => [...messages, data]);

			setConversations((prevConvs) => {
				const updatedConversations = prevConvs.map((conversation) => {
					if (conversation._id === selectedConversation._id) {
						return {
							...conversation,
							lastMessage: {
								text: messageText,
								sender: data.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
			setMessageText("");
			setImgUrl("");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsSending(false);
		}
	};
	return (
		<Flex gap={2} alignItems={"center"} w='full'>
			<form onSubmit={handleSendMessage} style={{ flex: 1 }}>
				<InputGroup>
					<Input
						w={"full"}
						placeholder='Type a message'
						onChange={(e) => setMessageText(e.target.value)}
						value={messageText}
						borderRadius='18px'
						bg={fieldBg}
						borderColor={fieldBorder}
						color={fieldText}
					/>
					<InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
						<IoSendSharp color={iconColor} />
					</InputRightElement>
				</InputGroup>
			</form>
			<Flex flexShrink={0} cursor={"pointer"} alignItems='center' justifyContent='center' color={iconColor}>
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
			</Flex>
			<Modal
				isOpen={imgUrl}
				onClose={() => {
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent mx={4} bg={modalBg} borderWidth='1px' borderColor={modalBorder} className='modal-surface'>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} w='full' borderRadius={6} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IconButton
									icon={<IoSendSharp />}
									aria-label='Send image'
									colorScheme='blue'
									borderRadius='full'
									onClick={handleSendMessage}
								/>
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Flex>
	);
};

export default MessageInput;
