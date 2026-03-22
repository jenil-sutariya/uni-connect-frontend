import {
	Avatar,
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
	Input,
	InputGroup,
	InputLeftElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Portal,
	Text,
	VStack,
	useColorMode,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiBell, FiLogOut, FiMenu, FiSearch } from "react-icons/fi";
import { getNavItems, isActiveNavItem } from "./navItems.jsx";
import useLogout from "../../hooks/useLogout";

const AppTopbar = ({ user }) => {
	const { colorMode, toggleColorMode } = useColorMode();
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const logout = useLogout();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [searchText, setSearchText] = useState("");
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");
	const fieldBg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
	const fieldBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const drawerBg = useColorModeValue("whiteAlpha.900", "gray.900");
	const menuBg = useColorModeValue("whiteAlpha.900", "gray.900");
	const menuBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const navItems = getNavItems(user);

	useEffect(() => {
		onClose();
	}, [pathname, onClose]);

	const handleSearch = (e) => {
		e.preventDefault();
		const query = searchText.trim();
		navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search?q=");
	};

	return (
		<>
			<Flex justify='space-between' align='center' gap={4} className='topbar-shell'>
				<Flex align='center' gap={3}>
					<IconButton
						display={{ base: "inline-flex", lg: "none" }}
						aria-label='Open navigation'
						icon={<FiMenu size={20} />}
						onClick={onOpen}
						variant='unstyled'
						className='icon-button-soft !flex !h-10 !w-10'
					/>
					<Link to='/' style={{ textDecoration: "none" }}>
						<HStack spacing={3}>
							<Box borderWidth='1px' borderColor={menuBorder} bg={useColorModeValue("whiteAlpha.700", "whiteAlpha.50")} borderRadius='16px' p={1.5}>
								<Image
									src={colorMode === "dark" ? "/uni-connect-logo-dark.svg" : "/uni-connect-logo.svg"}
									alt='UNI Connect'
									h={{ base: "26px", sm: "30px" }}
									w='auto'
								/>
							</Box>
							<Box display={{ base: "none", md: "block" }}>
								<Text className='font-display text-base font-semibold' color={titleColor}>
									UNI Connect
								</Text>
								<Text fontSize='xs' color={bodyColor}>
									CHARUSAT campus network
								</Text>
							</Box>
						</HStack>
					</Link>
				</Flex>

				<Box as='form' onSubmit={handleSearch} flex={1} maxW='640px' display={{ base: "none", md: "block" }}>
					<InputGroup>
						<InputLeftElement pointerEvents='none'>
							<FiSearch color={bodyColor} />
						</InputLeftElement>
						<Input
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							placeholder='Search students, faculty, or usernames'
							borderRadius='18px'
							bg={fieldBg}
							borderColor={fieldBorder}
						/>
					</InputGroup>
				</Box>

				<HStack spacing={2}>
					<Menu>
						<MenuButton as={Button} variant='unstyled' className='icon-button-soft !flex !h-10 !w-10'>
							<Box position='relative'>
								<FiBell size={18} />
								<Box
									position='absolute'
									top='-1px'
									right='-2px'
									w='7px'
									h='7px'
									borderRadius='full'
									bg='brand.400'
									border='2px solid'
									borderColor={useColorModeValue("white", "gray.900")}
								/>
							</Box>
						</MenuButton>
						<Portal>
							<MenuList bg={menuBg} borderColor={menuBorder} borderRadius='18px' p={2}>
								<MenuItem borderRadius='12px' color={bodyColor}>
									Notifications UI is ready for backend integration.
								</MenuItem>
							</MenuList>
						</Portal>
					</Menu>

					<Button
						onClick={toggleColorMode}
						variant='unstyled'
						className='icon-button-soft !flex !h-10 !w-10'
						aria-label='Toggle theme'
					>
						<Image alt='toggle theme' w={{ base: 5, sm: 6 }} src={colorMode === "dark" ? "/dark-mode.svg" : "/light-mode.svg"} />
					</Button>

					<Menu>
						<MenuButton as={Button} variant='unstyled' className='icon-button-soft !h-10 !rounded-full !pl-1 !pr-2.5'>
							<HStack spacing={2}>
								<Avatar size='xs' src={user?.profilePic} name={user?.name} />
								<Text display={{ base: "none", md: "inline" }} color={titleColor} fontSize='sm'>
									{user?.username}
								</Text>
							</HStack>
						</MenuButton>
						<Portal>
							<MenuList bg={menuBg} borderColor={menuBorder} borderRadius='18px' p={2}>
								<MenuItem borderRadius='12px' onClick={() => navigate(`/${user?.username}`)}>
									Profile
								</MenuItem>
								<MenuItem borderRadius='12px' onClick={() => navigate("/settings")}>
									Settings
								</MenuItem>
								<MenuItem borderRadius='12px' onClick={logout} icon={<FiLogOut />}>
									Logout
								</MenuItem>
							</MenuList>
						</Portal>
					</Menu>
				</HStack>
			</Flex>

			<Drawer isOpen={isOpen} placement='left' onClose={onClose}>
				<DrawerOverlay backdropFilter='blur(6px)' />
				<DrawerContent bg={drawerBg} borderRightWidth='1px' borderColor={menuBorder}>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth='1px' borderColor={menuBorder}>
						<Text className='font-display text-lg font-semibold' color={titleColor}>
							UNI Connect
						</Text>
						<Text mt={1} fontSize='sm' color={bodyColor}>
							{user ? `@${user.username}` : "Campus network"}
						</Text>
					</DrawerHeader>
					<DrawerBody py={5}>
						<VStack align='stretch' spacing={3}>
							<Box as='form' onSubmit={handleSearch}>
								<InputGroup>
									<InputLeftElement pointerEvents='none'>
										<FiSearch color={bodyColor} />
									</InputLeftElement>
									<Input
										value={searchText}
										onChange={(e) => setSearchText(e.target.value)}
										placeholder='Search users'
										borderRadius='18px'
										bg={fieldBg}
										borderColor={fieldBorder}
									/>
								</InputGroup>
							</Box>

							{navItems.map((item) => {
								const active = isActiveNavItem(pathname, item.to);
								return (
									<Link key={item.label} to={item.to} style={{ textDecoration: "none" }}>
										<HStack className={active ? "nav-pill nav-pill-active" : "nav-pill"} w='full' px={4} py={3}>
											{item.icon}
											<Text>{item.label}</Text>
										</HStack>
									</Link>
								);
							})}
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default AppTopbar;
