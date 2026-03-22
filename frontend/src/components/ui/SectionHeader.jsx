import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

const SectionHeader = ({ eyebrow, title, description, action, align = "start" }) => {
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");

	return (
		<Flex
			direction={{ base: "column", md: "row" }}
			align={{ base: align, md: "center" }}
			justify='space-between'
			gap={4}
		>
			<Box>
				{eyebrow ? <Text className='section-eyebrow mb-2'>{eyebrow}</Text> : null}
				<Text className='font-display text-2xl font-semibold md:text-3xl' color={titleColor}>
					{title}
				</Text>
				{description ? (
					<Text mt={2} color={bodyColor} maxW='2xl'>
						{description}
					</Text>
				) : null}
			</Box>
			{action}
		</Flex>
	);
};

export default SectionHeader;

