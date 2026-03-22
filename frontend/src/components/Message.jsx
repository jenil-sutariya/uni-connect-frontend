import { Avatar, Box, Flex, Image, Skeleton, Text, useColorModeValue } from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";

const Message = ({ ownMessage, message }) => {
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const user = useRecoilValue(userAtom);
	const [imgLoaded, setImgLoaded] = useState(false);
	const bubbleMaxW = { base: "70vw", md: "350px" };
	const imageWidth = { base: "160px", sm: "200px" };
	const ownBubbleBg = useColorModeValue("blue.500", "blue.300");
	const ownBubbleColor = useColorModeValue("white", "gray.900");
	const otherBubbleBg = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const otherBubbleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const imageBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const skeletonStart = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const skeletonEnd = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
	return (
		<>
			{ownMessage ? (
				<Flex gap={2} alignSelf={"flex-end"} maxW='full'>
					{message.text && (
						<Flex bg={ownBubbleBg} maxW={bubbleMaxW} p={3} borderRadius={"2xl"} alignItems='flex-end'>
							<Text color={ownBubbleColor} wordBreak='break-word'>
								{message.text}
							</Text>
							<Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box>
						</Flex>
					)}
					{message.img && !imgLoaded && (
						<Flex mt={5} w={imageWidth}>
							<Image
								src={message.img}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={12}
							/>
							<Skeleton w={imageWidth} h={imageWidth} startColor={skeletonStart} endColor={skeletonEnd} borderRadius='12px' />
						</Flex>
					)}

					{message.img && imgLoaded && (
						<Flex mt={5} w={imageWidth}>
							<Image src={message.img} alt='Message image' borderRadius={12} borderWidth='1px' borderColor={imageBorder} />
							<Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
								<BsCheck2All size={16} />
							</Box>
						</Flex>
					)}

					<Avatar src={user.profilePic} w='7' h={7} />
				</Flex>
			) : (
				<Flex gap={2} maxW='full'>
					<Avatar src={selectedConversation.userProfilePic} w='7' h={7} />

					{message.text && (
						<Text maxW={bubbleMaxW} bg={otherBubbleBg} p={3} borderRadius={"2xl"} color={otherBubbleColor} wordBreak='break-word'>
							{message.text}
						</Text>
					)}
					{message.img && !imgLoaded && (
						<Flex mt={5} w={imageWidth}>
							<Image
								src={message.img}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={12}
							/>
							<Skeleton w={imageWidth} h={imageWidth} startColor={skeletonStart} endColor={skeletonEnd} borderRadius='12px' />
						</Flex>
					)}

					{message.img && imgLoaded && (
						<Flex mt={5} w={imageWidth}>
							<Image src={message.img} alt='Message image' borderRadius={12} borderWidth='1px' borderColor={imageBorder} />
						</Flex>
					)}
				</Flex>
			)}
		</>
	);
};

export default Message;
