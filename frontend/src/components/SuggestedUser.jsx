import { Avatar, Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const SuggestedUser = ({ user }) => {
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");

	return (
		<Flex
			gap={4}
			justifyContent='space-between'
			alignItems={{ base: "flex-start", sm: "center" }}
			flexDirection={{ base: "column", sm: "row" }}
			className='glass-panel px-4 py-4'
		>
			<Flex gap={3} as={Link} to={`/${user.username}`} minW={0} flex={1} alignItems='center'>
				<Avatar src={user.profilePic} />
				<Box minW={0}>
					<Text className='font-display text-sm font-semibold' color={titleColor} noOfLines={1}>
						{user.username}
					</Text>
					<Text color={bodyColor} fontSize='sm' noOfLines={1}>
						{user.name}
					</Text>
				</Box>
			</Flex>

			<Button
				size='sm'
				onClick={handleFollowUnfollow}
				isLoading={updating}
				w={{ base: "full", sm: "auto" }}
				variant='unstyled'
				className={`!h-10 !rounded-full !px-5 !text-sm !font-medium transition ${following ? "soft-button" : "soft-button"}`}
			>
				{following ? "Following" : "Follow"}
			</Button>
		</Flex>
	);
};

export default SuggestedUser;
