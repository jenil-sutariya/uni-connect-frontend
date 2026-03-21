import { Avatar, Box, Flex, Link, Text, VStack, Menu, MenuButton, MenuItem, MenuList, Portal, Button, useToast } from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom); // logged in user
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success.",
				status: "success",
				description: "Profile link copied.",
				duration: 3000,
				isClosable: true,
			});
		});
	};

	return (
		<VStack gap={4} alignItems={"start"} w='full'>
			<Flex
				justifyContent={"space-between"}
				alignItems={{ base: "flex-start", sm: "center" }}
				direction={{ base: "column-reverse", sm: "row" }}
				gap={4}
				w={"full"}
			>
				<Box minW={0}>
					<Text fontSize={{ base: "xl", sm: "2xl" }} fontWeight={"bold"} wordBreak='break-word'>
						{user.name}
					</Text>
					<Flex gap={2} alignItems={"center"} flexWrap='wrap'>
						<Text fontSize={"sm"}>{user.username}</Text>
						{/* <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
							threads.net
						</Text> */}
					</Flex>
				</Box>
				<Box alignSelf={{ base: "flex-end", sm: "auto" }}>
					{user.profilePic && (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
					{!user.profilePic && (
						<Avatar
							name={user.name}
							src='https://bit.ly/broken-link'
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
				</Box>
			</Flex>

			<Text w='full' wordBreak='break-word'>
				{user.bio}
			</Text>

			{currentUser?._id === user._id && (
				<Link as={RouterLink} to='/update'>
					<Button size={"sm"}>Update Profile</Button>
				</Link>
			)}
			{currentUser?._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}
			<Flex
				w={"full"}
				justifyContent={"space-between"}
				alignItems={{ base: "flex-start", sm: "center" }}
				direction={{ base: "column", sm: "row" }}
				gap={3}
			>
				<Flex gap={2} alignItems={"center"} flexWrap='wrap'>
					<Text color={"gray.light"}>{user.followers.length} followers</Text>
					<Box w='1' h='1' bg={"gray.light"} borderRadius={"full"} display={{ base: "none", sm: "block" }}></Box>
					<Text color={"gray.light"}>{user.following.length} following</Text>
					{/* <Link color={"gray.light"}>instagram.com</Link> */}
				</Flex>
				<Flex alignSelf={{ base: "flex-end", sm: "auto" }}>
					{/* <Box className='icon-container'>
						<BsInstagram size={24} cursor={"pointer"} />
					</Box> */}
					<Box className='icon-container'>
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.dark"}>
									<MenuItem bg={"gray.dark"} onClick={copyURL}>
										Copy link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

			{/* <Flex w={"full"}>
				<Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
					<Text fontWeight={"bold"}> Threads</Text>
				</Flex>
				<Flex
					flex={1}
					borderBottom={"1px solid gray"}
					justifyContent={"center"}
					color={"gray.light"}
					pb='3'
					cursor={"pointer"}
				>
					<Text fontWeight={"bold"}> Replies</Text>
				</Flex>
			</Flex> */}
		</VStack>
	);
};

export default UserHeader;
