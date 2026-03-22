import {
	Avatar,
	AvatarBadge,
	Box,
	Flex,
	Stack,
	Text,
	WrapItem,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline }) => {
	const user = conversation?.participants?.[0];
	const currentUser = useRecoilValue(userAtom);
	const lastMessage = conversation?.lastMessage || {};
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const lastMessageText = typeof lastMessage.text === "string" ? lastMessage.text : "";
	const messagePreview =
		lastMessageText.length > 18 ? `${lastMessageText.substring(0, 18)}...` : lastMessageText;
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const previewColor = useColorModeValue("gray.500", "gray.400");
	const hoverBg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
	const activeBg = useColorModeValue("blue.50", "whiteAlpha.100");
	const activeBorder = useColorModeValue("blue.100", "whiteAlpha.200");
	const borderColor = useColorModeValue("transparent", "whiteAlpha.100");

	if (!user) return null;

	return (
		<Flex
			gap={4}
			alignItems={"center"}
			p={3}
			borderRadius='20px'
			borderWidth='1px'
			borderColor={selectedConversation?._id === conversation._id ? activeBorder : borderColor}
			bg={selectedConversation?._id === conversation._id ? activeBg : "transparent"}
			_hover={{
				cursor: "pointer",
				bg: selectedConversation?._id === conversation._id ? activeBg : hoverBg,
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
				<Text fontWeight='700' display={"flex"} alignItems={"center"} noOfLines={1} color={titleColor}>
					{user.username}
				</Text>
				<Flex fontSize={"xs"} alignItems={"center"} gap={1} minW={0} color={previewColor}>
					{currentUser?._id === lastMessage.sender ? (
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
