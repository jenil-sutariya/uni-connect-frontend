import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const SuggestedUser = ({ user }) => {
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	return (
		<Flex
			gap={3}
			justifyContent={"space-between"}
			alignItems={{ base: "flex-start", sm: "center" }}
			flexDirection={{ base: "column", sm: "row" }}
		>
			{/* left side */}
			<Flex gap={2} as={Link} to={`/${user.username}`} minW={0} flex={1}>
				<Avatar src={user.profilePic} />
				<Box minW={0}>
					<Text fontSize={"sm"} fontWeight={"bold"} noOfLines={1}>
						{user.username}
					</Text>
					<Text color={"gray.light"} fontSize={"sm"} noOfLines={1}>
						{user.name}
					</Text>
				</Box>
			</Flex>
			{/* right side */}
			<Button
				size={"sm"}
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				onClick={handleFollowUnfollow}
				isLoading={updating}
				w={{ base: "full", sm: "auto" }}
				_hover={{
					color: following ? "black" : "white",
					opacity: ".8",
				}}
			>
				{following ? "Unfollow" : "Follow"}
			</Button>
		</Flex>
	);
};

export default SuggestedUser;

//  SuggestedUser component, if u want to copy and paste as shown in the tutorial

{
	/* <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
			<Flex gap={2} as={Link} to={`${user.username}`}>
				<Avatar src={user.profilePic} />
				<Box>
					<Text fontSize={"sm"} fontWeight={"bold"}>
						{user.username}
					</Text>
					<Text color={"gray.light"} fontSize={"sm"}>
						{user.name}
					</Text>
				</Box>
			</Flex>
			<Button
				size={"sm"}
				color={following ? "black" : "white"}
				bg={following ? "white" : "blue.400"}
				onClick={handleFollow}
				isLoading={updating}
				_hover={{
					color: following ? "black" : "white",
					opacity: ".8",
				}}
			>
				{following ? "Unfollow" : "Follow"}
			</Button>
		</Flex> */
}
