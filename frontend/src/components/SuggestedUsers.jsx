import { Box, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const SuggestedUsers = () => {
	const [loading, setLoading] = useState(true);
	const [suggestedUsers, setSuggestedUsers] = useState([]);
	const showToast = useShowToast();
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");

	useEffect(() => {
		const getSuggestedUsers = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/users/suggested");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					setSuggestedUsers([]);
					return;
				}
				setSuggestedUsers(Array.isArray(data) ? data : []);
			} catch (error) {
				showToast("Error", error.message, "error");
				setSuggestedUsers([]);
			} finally {
				setLoading(false);
			}
		};

		getSuggestedUsers();
	}, [showToast]);

	return (
		<Box className='glass-panel-strong sticky top-24 px-4 py-4 md:px-5 md:py-5'>
			<Text className='section-eyebrow mb-2'>Suggested</Text>
			<Text className='font-display text-lg font-semibold md:text-xl' color={titleColor}>
				People you may know
			</Text>
			<Text mt={2} color={bodyColor} fontSize='sm' lineHeight='1.6'>
				Discover classmates, collaborators, and faculty members.
			</Text>

			<Flex direction='column' gap={3} mt={4}>
				{!loading &&
					Array.isArray(suggestedUsers) &&
					suggestedUsers.length > 0 &&
					suggestedUsers.map((user) => <SuggestedUser key={user._id} user={user} />)}

				{!loading && Array.isArray(suggestedUsers) && suggestedUsers.length === 0 && (
					<Box className='glass-panel px-4 py-6 text-center'>
						<Text color={bodyColor} fontSize='sm'>
							No suggested users at the moment
						</Text>
					</Box>
				)}

				{loading &&
					[0, 1, 2, 3, 4].map((_, idx) => (
						<Flex
							key={idx}
							gap={3}
							alignItems='center'
							p={3}
							borderRadius='20px'
							className='glass-panel'
						>
							<SkeletonCircle size='10' startColor='blackAlpha.100' endColor='blackAlpha.200' _dark={{ startColor: "whiteAlpha.100", endColor: "whiteAlpha.200" }} />
							<Flex w='full' flexDirection='column' gap={2}>
								<Skeleton h='8px' w='90px' startColor='blackAlpha.100' endColor='blackAlpha.200' _dark={{ startColor: "whiteAlpha.100", endColor: "whiteAlpha.200" }} />
								<Skeleton h='8px' w='110px' startColor='blackAlpha.100' endColor='blackAlpha.200' _dark={{ startColor: "whiteAlpha.100", endColor: "whiteAlpha.200" }} />
							</Flex>
						</Flex>
					))}
			</Flex>
		</Box>
	);
};

export default SuggestedUsers;
