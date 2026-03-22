import { Box, Flex, Link, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { getNavItems, isActiveNavItem } from "./navItems.jsx";
import AppSurface from "../ui/AppSurface";

const AppSidebar = ({ user }) => {
	const { pathname } = useLocation();
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");
	const navItems = getNavItems(user);

	return (
		<AppSurface variant='strong' className='sidebar-shell sticky top-4 hidden lg:block'>
			<VStack align='stretch' spacing={4}>
				<Box px={2}>
					<Text className='section-eyebrow mb-2'>Workspace</Text>
					<Text className='font-display text-[1.7rem] font-semibold leading-tight' color={titleColor}>
						UNI Connect
					</Text>
					<Text mt={2} color={bodyColor} fontSize='sm' lineHeight='1.65'>
						Campus feed, messages, departments, and faculty communication in one place.
					</Text>
				</Box>

				<Box h='1px' bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")} />

				<VStack align='stretch' spacing={1.5}>
					{navItems.map((item) => {
						const active = isActiveNavItem(pathname, item.to);
						return (
							<Link
								key={item.label}
								as={RouterLink}
								to={item.to}
								_hover={{ textDecoration: "none" }}
								className={active ? "nav-pill nav-pill-active" : "nav-pill"}
							>
									<Flex align='center' gap={3} w='full'>
										<Box as='span'>{item.icon}</Box>
										<Text fontWeight={active ? "semibold" : "medium"}>{item.label}</Text>
									</Flex>
								</Link>
							);
					})}
				</VStack>
			</VStack>
		</AppSurface>
	);
};

export default AppSidebar;
