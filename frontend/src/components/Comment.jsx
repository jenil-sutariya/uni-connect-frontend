import { Avatar, Flex, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";

const Comment = ({ reply, lastReply }) => {
	const formatTimeAgo = (date) => {
		try {
			return formatDistanceToNow(new Date(date), { addSuffix: true });
		} catch (error) {
			return "recently";
		}
	};

	return (
		<Flex gap={3} py={2} w={"full"}>
			<Avatar src={reply.userProfilePic} size={"sm"} />
			<Flex gap={1} w={"full"} flexDirection={"column"} minW={0}>
				<Flex gap={2} align="center" flexWrap='wrap'>
					<Text fontSize='sm' fontWeight='bold' noOfLines={1}>
						{reply.username}
					</Text>
					<Text fontSize="xs" color="gray.500">
						{formatTimeAgo(reply.createdAt)}
					</Text>
				</Flex>
				<Text fontSize="sm" mt={1} wordBreak='break-word'>
					{reply.text}
				</Text>
			</Flex>
		</Flex>
	);
};

export default Comment;
