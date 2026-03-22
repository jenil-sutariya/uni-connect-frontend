import { Box, SimpleGrid, Text, VStack, useColorMode, useColorModeValue } from "@chakra-ui/react";
import AppButton from "../components/ui/AppButton";
import AppSurface from "../components/ui/AppSurface";
import SectionHeader from "../components/ui/SectionHeader";
import useLogout from "../hooks/useLogout";

export const SettingsPage = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const logout = useLogout();
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");

	return (
		<VStack align='stretch' spacing={5} py={{ base: 2, md: 4 }}>
			<AppSurface variant='strong' className='px-6 py-6 md:px-8 md:py-8'>
				<SectionHeader
					eyebrow='Preferences'
					title='Settings'
					description='Keep your workspace comfortable, adjust your viewing mode, and manage your session from one place.'
				/>
			</AppSurface>

			<SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
				<AppSurface variant='default' className='px-5 py-5 md:px-6 md:py-6'>
					<Text fontWeight='semibold' color={titleColor}>
						Theme
					</Text>
					<Text mt={2} color={bodyColor} fontSize='sm'>
						Current mode: {colorMode === "dark" ? "Dark" : "Light"}
					</Text>
					<AppButton mt={5} onClick={toggleColorMode} variant='secondary'>
						Switch to {colorMode === "dark" ? "light" : "dark"} mode
					</AppButton>
				</AppSurface>

				<AppSurface variant='default' className='px-5 py-5 md:px-6 md:py-6'>
					<Text fontWeight='semibold' color={titleColor}>
						Session
					</Text>
					<Text mt={2} color={bodyColor} fontSize='sm'>
						Log out safely if you are using a shared device or want to change accounts.
					</Text>
					<AppButton mt={5} onClick={logout} variant='danger'>
						Logout
					</AppButton>
				</AppSurface>
			</SimpleGrid>
		</VStack>
	);
};
