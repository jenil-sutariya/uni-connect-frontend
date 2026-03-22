import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import AppSurface from "./AppSurface";

const EmptyState = ({ title, description, action, className = "" }) => {
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");

	return (
		<AppSurface variant='default' className={`px-6 py-12 text-center ${className}`.trim()}>
			<Box>
				<Text fontSize='lg' fontWeight='semibold' color={titleColor}>
					{title}
				</Text>
				{description ? (
					<Text mt={2} color={bodyColor}>
						{description}
					</Text>
				) : null}
				{action ? <Box mt={5}>{action}</Box> : null}
			</Box>
		</AppSurface>
	);
};

export default EmptyState;

