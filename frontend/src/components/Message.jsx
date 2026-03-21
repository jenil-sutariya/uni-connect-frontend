import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
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
	return (
		<>
			{ownMessage ? (
				<Flex gap={2} alignSelf={"flex-end"} maxW='full'>
					{message.text && (
						<Flex bg={"green.800"} maxW={bubbleMaxW} p={2} borderRadius={"md"} alignItems='flex-end'>
							<Text color={"white"} wordBreak='break-word'>
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
								borderRadius={4}
							/>
							<Skeleton w={imageWidth} h={imageWidth} />
						</Flex>
					)}

					{message.img && imgLoaded && (
						<Flex mt={5} w={imageWidth}>
							<Image src={message.img} alt='Message image' borderRadius={4} />
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
						<Text maxW={bubbleMaxW} bg={"gray.400"} p={2} borderRadius={"md"} color={"black"} wordBreak='break-word'>
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
								borderRadius={4}
							/>
							<Skeleton w={imageWidth} h={imageWidth} />
						</Flex>
					)}

					{message.img && imgLoaded && (
						<Flex mt={5} w={imageWidth}>
							<Image src={message.img} alt='Message image' borderRadius={4} />
						</Flex>
					)}
				</Flex>
			)}
		</>
	);
};

export default Message;
