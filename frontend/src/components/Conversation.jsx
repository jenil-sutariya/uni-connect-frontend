import {
	Avatar,
	AvatarBadge,
	Box,
	Flex,
	Stack,
	Text,
	WrapItem,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline }) => {
	const user = conversation.participants[0];
	const currentUser = useRecoilValue(userAtom);
	const lastMessage = conversation.lastMessage;
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const { colorMode } = useColorMode();
	const messagePreview =
		lastMessage.text.length > 18 ? `${lastMessage.text.substring(0, 18)}...` : lastMessage.text;

	return (
		<Flex
			gap={4}
			alignItems={"center"}
			p={"1"}
			_hover={{
				cursor: "pointer",
				bg: useColorModeValue("gray.600", "blue.900"),
				color: "white",
			}}
			onClick={() =>
				setSelectedConversation({
					_id: conversation._id,
					userId: user._id,
					userProfilePic: user.profilePic,
					username: user.username,
					mock: conversation.mock,
				})
			}
			bg={selectedConversation?._id === conversation._id ? (colorMode === "dark" ? "gray.500" : "gray.200") : ""}
			borderRadius={"md"}
		>
			<WrapItem>
				<Avatar
					size={{
						base: "xs",
						sm: "sm",
						md: "md",
					}}
					src={user.profilePic}
				>
					{isOnline ? <AvatarBadge boxSize='1em' bg='green.500' /> : ""}
				</Avatar>
			</WrapItem>

			<Stack direction={"column"} fontSize={"sm"} minW={0} flex={1}>
				<Text fontWeight='700' display={"flex"} alignItems={"center"} noOfLines={1}>
					{user.username} 
					{/* <Image src='/verified.png' w={4} h={4} ml={1} /> */}
				</Text>
				<Flex fontSize={"xs"} alignItems={"center"} gap={1} minW={0}>
					{currentUser._id === lastMessage.sender ? (
						<Box as='span' display='inline-flex' color={lastMessage.seen ? "blue.400" : undefined} flexShrink={0}>
							<BsCheck2All size={16} />
						</Box>
					) : null}
					{messagePreview ? (
						<Text as='span' fontSize={"xs"} noOfLines={1}>
							{messagePreview}
						</Text>
					) : (
						<Box as='span' display='inline-flex' flexShrink={0}>
							<BsFillImageFill size={16} />
						</Box>
					)}
				</Flex>
			</Stack>
		</Flex>
	);
};

export default Conversation;
