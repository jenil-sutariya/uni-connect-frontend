import {
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	HStack,
	IconButton,
	Image,
	Link,
	Text,
	VStack,
	useColorMode,
	useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineDashboard, MdOutlineSettings } from "react-icons/md";
import userAtom from "../atoms/userAtom";
import useLogout from "../hooks/useLogout";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { pathname } = useLocation();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();

	useEffect(() => {
		onClose();
	}, [pathname, onClose]);

	const navItems = user
		? [
				{ label: "Home", to: "/", icon: <AiFillHome size={20} /> },
				{ label: "Search", to: "/search?q=", icon: <SearchIcon /> },
				{ label: "Profile", to: `/${user.username}`, icon: <RxAvatar size={20} /> },
				{ label: "Chat", to: "/chat", icon: <BsFillChatQuoteFill size={18} /> },
				...(user.role === "professor"
					? [{ label: "Dashboard", to: "/professor", icon: <MdOutlineDashboard size={20} /> }]
					: []),
				{ label: "Settings", to: "/settings", icon: <MdOutlineSettings size={20} /> },
		  ]
		: [{ label: "Sign Up / Login", to: "/auth", icon: <RxAvatar size={20} /> }];

	const handleMobileLogout = () => {
		onClose();
		logout();
	};

	return (
		<>
			<Flex justifyContent="space-between" alignItems="center" gap={4} mt={{ base: 4, md: 6 }} mb={{ base: 8, md: 12 }}>
				<Link as={RouterLink} to='/'>
					<Image
						src={colorMode === "dark" ? "/uni-connect-logo-dark.svg" : "/uni-connect-logo.svg"}
						alt="UNI Connect"
						h={{ base: "32px", sm: "40px" }}
						w="auto"
					/>
				</Link>

				<Flex alignItems="center" gap={{ base: 2, md: 4 }}>
					<Flex display={{ base: "none", md: "flex" }} alignItems="center" gap={4}>
						{user ? (
							<>
								<Link as={RouterLink} to='/'>
									<AiFillHome size={22} />
								</Link>
								<Link as={RouterLink} to='/search?q='>
									<SearchIcon />
								</Link>
								<Link as={RouterLink} to={`/${user.username}`}>
									<RxAvatar size={24} />
								</Link>
								<Link as={RouterLink} to='/chat'>
									<BsFillChatQuoteFill size={20} />
								</Link>
								{user.role === "professor" && (
									<Link as={RouterLink} to='/professor'>
										<Text fontSize="sm" fontWeight="bold" color="blue.500">
											Dashboard
										</Text>
									</Link>
								)}
								<Link as={RouterLink} to='/settings'>
									<MdOutlineSettings size={20} />
								</Link>
								<Button size="xs" onClick={logout}>
									<FiLogOut size={20} />
								</Button>
							</>
						) : (
							<Link as={RouterLink} to='/auth'>
								<Text fontWeight="bold" color="blue.500">
									Sign up
								</Text>
							</Link>
						)}
					</Flex>

					<Image
						cursor="pointer"
						alt='toggle theme'
						w={{ base: 5, sm: 6 }}
						src={colorMode === "dark" ? "/dark-mode.svg" : "/light-mode.svg"}
						onClick={toggleColorMode}
					/>

					<IconButton
						display={{ base: "inline-flex", md: "none" }}
						aria-label='Open navigation menu'
						icon={<HamburgerIcon boxSize={5} />}
						onClick={onOpen}
						variant='outline'
						size='sm'
					/>
				</Flex>
			</Flex>

			<Drawer isOpen={isOpen} placement='right' onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth='1px'>
						<VStack align='start' spacing={1} pr={8}>
							<Text fontWeight='bold'>{user ? user.name : "UNI Connect"}</Text>
							<Text fontSize='sm' color='gray.500'>
								{user ? `@${user.username}` : "Quick navigation"}
							</Text>
						</VStack>
					</DrawerHeader>

					<DrawerBody py={4}>
						<VStack align='stretch' spacing={3}>
							{navItems.map((item) => (
								<Link
									key={item.label}
									as={RouterLink}
									to={item.to}
									onClick={onClose}
									_hover={{ textDecoration: "none" }}
								>
									<HStack
										w='full'
										justifyContent='flex-start'
										spacing={3}
										px={4}
										py={3}
										borderRadius='lg'
										bg='blackAlpha.50'
										_dark={{ bg: "whiteAlpha.100" }}
									>
										{item.icon}
										<Text fontWeight='medium'>{item.label}</Text>
									</HStack>
								</Link>
							))}

							<Button variant='ghost' justifyContent='flex-start' onClick={toggleColorMode}>
								{colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
							</Button>

							{user && (
								<Button leftIcon={<FiLogOut />} colorScheme='red' variant='outline' onClick={handleMobileLogout}>
									Logout
								</Button>
							)}
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default Header;
