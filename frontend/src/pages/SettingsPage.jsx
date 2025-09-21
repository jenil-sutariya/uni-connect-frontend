import { Button, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

export const SettingsPage = () => {
	const showToast = useShowToast();
	const logout = useLogout();


	return (
		<>
			<Text my={1} fontWeight={"bold"}>
				Settings
			</Text>
			<Text my={1}>Account settings and preferences.</Text>
		</>
	);
};
