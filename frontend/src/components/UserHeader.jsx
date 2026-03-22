import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Portal,
	SimpleGrid,
	Text,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import AppSurface from "./ui/AppSurface";

const UserHeader = ({ user }) => {
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom);
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");
	const mutedColor = useColorModeValue("gray.500", "gray.400");
	const menuBg = useColorModeValue("whiteAlpha.900", "gray.900");
	const menuBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const coverGradient = useColorModeValue(
		"linear-gradient(135deg, rgba(51,102,255,0.18), rgba(16,185,129,0.16))",
		"linear-gradient(135deg, rgba(93,138,255,0.26), rgba(45,212,191,0.18))"
	);

	const copyURL = () => {
		navigator.clipboard.writeText(window.location.href).then(() => {
			toast({
				title: "Success",
				status: "success",
				description: "Profile link copied.",
				duration: 3000,
				isClosable: true,
			});
		});
	};

	return (
		<AppSurface variant='strong' className='overflow-hidden'>
			<Box h={{ base: "120px", md: "160px" }} bgImage={coverGradient} />
			<Box px={{ base: 5, md: 7 }} pb={{ base: 5, md: 7 }}>
				<Flex
					mt={{ base: "-38px", md: "-48px" }}
					direction={{ base: "column", md: "row" }}
					align={{ base: "flex-start", md: "flex-end" }}
					justify='space-between'
					gap={4}
				>
					<Flex direction={{ base: "column", sm: "row" }} align={{ base: "flex-start", sm: "flex-end" }} gap={4}>
						<Avatar
							name={user.name}
							src={user.profilePic || undefined}
							size={{ base: "xl", md: "2xl" }}
							borderWidth='4px'
							borderColor={useColorModeValue("white", "gray.900")}
							boxShadow='xl'
						/>
						<Box>
							<Text className='font-display text-3xl font-semibold md:text-4xl' color={titleColor}>
								{user.name}
							</Text>
							<Text mt={1} color={bodyColor}>
								@{user.username}
							</Text>
							<Text mt={2} fontSize='sm' color={mutedColor}>
								{user.department?.fullName || "CHARUSAT campus member"}
							</Text>
						</Box>
					</Flex>

					<HStack align='center' spacing={3}>
						{currentUser?._id === user._id ? (
							<Button
								as={RouterLink}
								to='/update'
								variant='unstyled'
								className='app-button app-button-secondary'
							>
								Edit Profile
							</Button>
						) : (
							<Button
								onClick={handleFollowUnfollow}
								isLoading={updating}
								variant='unstyled'
								className={`app-button ${following ? "app-button-secondary" : "app-button-primary"}`}
							>
								{following ? "Following" : "Follow"}
							</Button>
						)}

						<Menu>
							<MenuButton as={Button} variant='unstyled' className='icon-button-soft !flex !h-10 !w-10'>
								<CgMoreO size={22} />
							</MenuButton>
							<Portal>
								<MenuList bg={menuBg} borderColor={menuBorder} borderRadius='18px' p={2}>
									<MenuItem borderRadius='12px' onClick={copyURL}>
										Copy profile link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</HStack>
				</Flex>

				<Text mt={5} color={bodyColor} maxW='3xl' lineHeight='1.75'>
					{user.bio || "No bio added yet."}
				</Text>

				<SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} mt={5}>
					<Box className='surface-subtle px-4 py-4'>
						<Text fontSize='xs' textTransform='uppercase' letterSpacing='0.16em' color={mutedColor}>
							Followers
						</Text>
						<Text mt={2} className='font-display text-2xl font-semibold' color={titleColor}>
							{user.followers.length}
						</Text>
					</Box>
					<Box className='surface-subtle px-4 py-4'>
						<Text fontSize='xs' textTransform='uppercase' letterSpacing='0.16em' color={mutedColor}>
							Following
						</Text>
						<Text mt={2} className='font-display text-2xl font-semibold' color={titleColor}>
							{user.following.length}
						</Text>
					</Box>
					<Box className='surface-subtle px-4 py-4'>
						<Text fontSize='xs' textTransform='uppercase' letterSpacing='0.16em' color={mutedColor}>
							Role
						</Text>
						<Text mt={2} className='font-display text-2xl font-semibold' color={titleColor}>
							{user.role === "professor" ? "Faculty" : "Student"}
						</Text>
					</Box>
				</SimpleGrid>
			</Box>
		</AppSurface>
	);
};

export default UserHeader;

