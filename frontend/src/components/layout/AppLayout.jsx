import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import CreatePost from "../CreatePost";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";

const AppLayout = () => {
	const user = useRecoilValue(userAtom);

	return (
		<Box w='full' minH='100vh' className='app-shell'>
			<Box maxW='1440px' mx='auto' px={{ base: 4, sm: 6, lg: 8 }} pt={{ base: 6, md: 8 }} pb={{ base: 12, md: 16 }}>
				<Box className='layout-grid'>
					<AppSidebar user={user} />
					<Box className='content-stack'>
						<AppTopbar user={user} />
						<Outlet />
					</Box>
				</Box>
			</Box>
			<CreatePost />
		</Box>
	);
};

export default AppLayout;
