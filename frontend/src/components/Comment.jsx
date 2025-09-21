import { Avatar, Flex, Text, HStack } from "@chakra-ui/react";
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
			<Flex gap={1} w={"full"} flexDirection={"column"}>
				<HStack spacing={2} align="center">
					<Text fontSize='sm' fontWeight='bold'>
						{reply.username}
					</Text>
					<Text fontSize="xs" color="gray.500">
						{formatTimeAgo(reply.createdAt)}
					</Text>
				</HStack>
				<Text fontSize="sm" mt={1}>{reply.text}</Text>
			</Flex>
		</Flex>
	);
};

export default Comment;
