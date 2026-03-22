import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "../Header";

const PublicLayout = () => {
	return (
		<Box position='relative' w='full' minH='100vh' className='app-shell'>
			<Container maxW={{ base: "100%", md: "960px", lg: "1200px" }} px={{ base: 4, sm: 6 }} pt={{ base: 4, md: 5 }} pb={{ base: 10, md: 14 }}>
				<Header />
				<Outlet />
			</Container>
		</Box>
	);
};

export default PublicLayout;

