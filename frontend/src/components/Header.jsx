import { Button, Flex, Image, Link, Text, useColorMode, Box } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();

	return (
		<Flex justifyContent={"space-between"} alignItems="center" mt={6} mb='12'>
			{/* Left section with logo and home */}
			<Flex alignItems="center" gap={4}>
				<Link as={RouterLink} to='/'>
					<Flex alignItems="center" gap={3}>
						<Image
							src={colorMode === "dark" ? "/uni-connect-logo-dark.svg" : "/uni-connect-logo.svg"}
							alt="UNI Connect"
							h="40px"
							w="auto"
						/>
					</Flex>
				</Link>
				{user && (
					<Link as={RouterLink} to='/' ml={4}>
						<AiFillHome size={24} />
					</Link>
				)}
			</Flex>

			{/* Right section with navigation and theme toggle */}
			<Flex alignItems="center" gap={4}>
				{user && (
					<Flex alignItems={"center"} gap={4}>
						<Link as={RouterLink} to={`/search?q=`}>
							<SearchIcon />
						</Link>
						<Link as={RouterLink} to={`/${user.username}`}>
							<RxAvatar size={24} />
						</Link>
						<Link as={RouterLink} to={`/chat`}>
							<BsFillChatQuoteFill size={20} />
						</Link>
						{user.role === "professor" && (
							<Link as={RouterLink} to={`/professor`}>
								<Text fontSize="sm" fontWeight="bold" color="blue.500">
									Dashboard
								</Text>
							</Link>
						)}
						<Link as={RouterLink} to={`/settings`}>
							<MdOutlineSettings size={20} />
						</Link>
					</Flex>
				)}

				{!user && (
					<Link as={RouterLink} to={"/auth"}>
						<Text fontWeight="bold" color="blue.500">
							Sign up
						</Text>
					</Link>
				)}

				{/* Theme toggle */}
				<Image
					cursor={"pointer"}
					alt='toggle theme'
					w={6}
					src={colorMode === "dark" ? "/dark-mode.svg" : "/light-mode.svg"}
					onClick={toggleColorMode}
				/>

				{/* Logout button for logged in users */}
				{user && (
					<Button size={"xs"} onClick={logout}>
						<FiLogOut size={20} />
					</Button>
				)}
			</Flex>
		</Flex >
	);
};

export default Header;
