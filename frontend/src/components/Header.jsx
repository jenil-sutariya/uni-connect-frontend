import {
	Box,
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
	useColorModeValue,
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
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const mutedColor = useColorModeValue("gray.500", "gray.400");
	const drawerBg = useColorModeValue("whiteAlpha.900", "gray.900");
	const softBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const logoTileBg = useColorModeValue("whiteAlpha.700", "whiteAlpha.50");
	const logoTileBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const drawerCloseBg = useColorModeValue("whiteAlpha.800", "whiteAlpha.100");

	useEffect(() => {
		onClose();
	}, [pathname, onClose]);

	const navItems = user
		? [
				{ label: "Home", to: "/", icon: <AiFillHome size={18} /> },
				{ label: "Search", to: "/search?q=", icon: <SearchIcon /> },
				{ label: "Profile", to: `/${user.username}`, icon: <RxAvatar size={18} /> },
				{ label: "Chat", to: "/chat", icon: <BsFillChatQuoteFill size={16} /> },
				...(user.role === "professor"
					? [{ label: "Dashboard", to: "/professor", icon: <MdOutlineDashboard size={18} /> }]
					: []),
				{ label: "Settings", to: "/settings", icon: <MdOutlineSettings size={18} /> },
		  ]
		: [{ label: "Sign In", to: "/auth", icon: <RxAvatar size={18} /> }];

	const isActiveRoute = (to) => {
		if (to === "/") return pathname === "/";
		if (to.startsWith("/search")) return pathname.startsWith("/search");
		return pathname === to || pathname.startsWith(`${to}/`);
	};

	const handleMobileLogout = () => {
		onClose();
		logout();
	};

	return (
		<>
			<Flex
				justifyContent='space-between'
				alignItems='center'
				gap={4}
				mb={{ base: 8, md: 10 }}
				className='glass-panel sticky top-4 z-40 px-4 py-3 md:px-5 md:py-4'
			>
				<Link as={RouterLink} to='/' _hover={{ textDecoration: "none" }}>
					<HStack spacing={3}>
						<Box borderWidth='1px' borderColor={logoTileBorder} bg={logoTileBg} borderRadius='18px' p={2}>
							<Image
								src={colorMode === "dark" ? "/uni-connect-logo-dark.svg" : "/uni-connect-logo.svg"}
								alt='UNI Connect'
								h={{ base: "28px", sm: "34px" }}
								w='auto'
							/>
						</Box>
						<VStack align='start' spacing={0} display={{ base: "none", md: "flex" }}>
							<Text className='font-display text-base font-semibold' color={titleColor}>
								UNI Connect
							</Text>
							<Text className='section-eyebrow !tracking-[0.26em]' color={mutedColor}>
								CHARUSAT NETWORK
							</Text>
						</VStack>
					</HStack>
				</Link>

				<Flex alignItems='center' gap={{ base: 2, md: 3 }}>
					<HStack display={{ base: "none", lg: "flex" }} spacing={2}>
						{navItems.map((item) => {
							const active = isActiveRoute(item.to);
							return (
								<Link
									key={item.label}
									as={RouterLink}
									to={item.to}
									className={`nav-pill ${active ? "nav-pill-active" : ""}`}
									_hover={{ textDecoration: "none" }}
								>
									{item.icon}
									<Text fontWeight='medium'>{item.label}</Text>
								</Link>
							);
						})}
					</HStack>

					<Button
						onClick={toggleColorMode}
						variant='unstyled'
						className='icon-button-soft !flex !h-10 !w-10'
						aria-label='Toggle theme'
					>
						<Image
							alt='toggle theme'
							w={{ base: 5, sm: 6 }}
							src={colorMode === "dark" ? "/dark-mode.svg" : "/light-mode.svg"}
						/>
					</Button>

					{user && (
						<Button
							display={{ base: "none", xl: "inline-flex" }}
							onClick={logout}
							leftIcon={<FiLogOut size={16} />}
							variant='unstyled'
							className='danger-soft-button !h-10 !px-4'
						>
							Logout
						</Button>
					)}

					<IconButton
						display={{ base: "inline-flex", lg: "none" }}
						aria-label='Open navigation menu'
						icon={<HamburgerIcon boxSize={5} />}
						onClick={onOpen}
						variant='unstyled'
						className='icon-button-soft !flex !h-10 !w-10'
					/>
				</Flex>
			</Flex>

			<Drawer isOpen={isOpen} placement='right' onClose={onClose}>
				<DrawerOverlay backdropFilter='blur(6px)' />
				<DrawerContent bg={drawerBg} borderLeftWidth='1px' borderColor={softBorder}>
					<DrawerCloseButton
						top={5}
						right={5}
						borderRadius='full'
						borderWidth='1px'
						borderColor={softBorder}
						bg={drawerCloseBg}
					/>
					<DrawerHeader borderBottomWidth='1px' borderColor={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}>
						<VStack align='start' spacing={1} pr={8}>
							<Text className='font-display text-lg font-semibold' color={titleColor}>
								{user ? user.name : "UNI Connect"}
							</Text>
							<Text fontSize='sm' color={mutedColor}>
								{user ? `@${user.username}` : "Quick navigation"}
							</Text>
						</VStack>
					</DrawerHeader>

					<DrawerBody py={5}>
						<VStack align='stretch' spacing={3}>
							{navItems.map((item) => {
								const active = isActiveRoute(item.to);
								return (
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
											borderRadius='20px'
											className={active ? "nav-pill-active" : "nav-pill"}
										>
											{item.icon}
											<Text fontWeight='medium'>{item.label}</Text>
										</HStack>
									</Link>
								);
							})}

							<Button
								variant='unstyled'
								onClick={toggleColorMode}
								className='soft-button !mt-3 !h-11 !justify-start !rounded-[20px] !px-4'
							>
								{colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
							</Button>

							{user && (
								<Button
									leftIcon={<FiLogOut />}
									variant='unstyled'
									onClick={handleMobileLogout}
									className='danger-soft-button !h-11 !justify-start !rounded-[20px] !px-4'
								>
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
