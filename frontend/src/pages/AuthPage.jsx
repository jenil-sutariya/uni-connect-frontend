import { useEffect, useState } from "react";
import {
	Badge,
	Box,
	Flex,
	Heading,
	HStack,
	Icon,
	SimpleGrid,
	Stack,
	Text,
	useColorModeValue,
	VStack,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { FiBell, FiBookOpen, FiMessageSquare, FiUsers } from "react-icons/fi";
import EmailSignupCard from "../components/EmailSignupCard";
import EmailLoginCard from "../components/EmailLoginCard";

const featureCards = [
	{
		title: "Department-Based Updates",
		description: "Students can receive relevant academic announcements that match their CHARUSAT department.",
		icon: FiBell,
	},
	{
		title: "Campus Discussion Feed",
		description: "Share ideas, ask questions, and stay active with classmates through a university-focused social feed.",
		icon: FiUsers,
	},
	{
		title: "Real-Time Messaging",
		description: "Connect directly with peers and faculty members for faster collaboration beyond the classroom.",
		icon: FiMessageSquare,
	},
	{
		title: "Professor Dashboard",
		description: "Faculty can manage announcements and communicate with students from one dedicated workspace.",
		icon: FiBookOpen,
	},
];

const audienceTags = ["CHARUSAT Students", "Faculty", "CSPIT", "DEPSTAR", "Campus Community"];

const AuthPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [authMode, setAuthMode] = useState("login");
	const panelBg = useColorModeValue("white", "gray.dark");
	const panelBorder = useColorModeValue("blue.100", "whiteAlpha.200");
	const mutedText = useColorModeValue("gray.600", "gray.300");
	const featureBg = useColorModeValue("gray.50", "whiteAlpha.100");
	const featureIconBg = useColorModeValue("blue.50", "whiteAlpha.200");
	const featureIconColor = useColorModeValue("blue.600", "blue.200");
	const calloutBg = useColorModeValue("blue.50", "whiteAlpha.100");
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");

	useEffect(() => {
		const mode = searchParams.get("mode");
		if (mode === "login" || mode === "signup") {
			setAuthMode(mode);
		}
	}, [searchParams]);

	const switchToLogin = () => {
		setAuthMode("login");
		setSearchParams({ mode: "login" });
	};

	const switchToSignup = () => {
		setAuthMode("signup");
		setSearchParams({ mode: "signup" });
	};

	return (
		<Flex
			direction={{ base: "column", lg: "row" }}
			gap={{ base: 10, lg: 16 }}
			align="center"
			justify="center"
			minH="100vh"
			py={{ base: 12, md: 24 }}
			px={{ base: 5, md: 8 }}
			maxW="1300px"
			mx="auto"
		>
			<VStack flex={1} align="stretch" spacing={{ base: 8, md: 10 }}>
				<Stack spacing={5}>
					<Badge
						alignSelf="flex-start"
						colorScheme='blue'
						px={4}
						py={2}
						borderRadius='full'
						fontWeight='semibold'
						letterSpacing='0.18em'
					>
						Built for CHARUSAT University
					</Badge>
					<Heading
						fontSize={{ base: "3xl", md: "4xl", xl: "5xl" }}
						lineHeight={{ base: 1.2, md: 1.1 }}
						maxW="14ch"
						className='!font-display !tracking-tight'
						color={titleColor}
					>
						UNI Connect for the <span className='gradient-text'>CHARUSAT campus community</span>
					</Heading>
					<Text fontSize={{ base: "md", md: "lg" }} color={mutedText} maxW="2xl">
						UNI Connect is a university collaboration platform designed for CHARUSAT students and faculty to
						share updates, discover peers, receive department announcements, and stay connected in one place.
					</Text>
				</Stack>

				<Box
					bg={panelBg}
					borderWidth="1px"
					borderColor={panelBorder}
					borderRadius="2xl"
					boxShadow="lg"
					p={{ base: 5, md: 6 }}
					className='glass-panel-strong overflow-hidden'
				>
					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
						{featureCards.map((feature) => (
							<Box
								key={feature.title}
								bg={featureBg}
								borderWidth="1px"
								borderColor={panelBorder}
								borderRadius="xl"
								p={4}
								className='surface-hover'
							>
								<HStack align="flex-start" spacing={4}>
									<Flex
										boxSize={11}
										borderRadius="full"
										bg={featureIconBg}
										align="center"
										justify="center"
										flexShrink={0}
									>
										<Icon as={feature.icon} boxSize={5} color={featureIconColor} />
									</Flex>
									<Stack spacing={1.5}>
										<Text fontWeight="semibold">{feature.title}</Text>
										<Text fontSize="sm" color={mutedText}>
											{feature.description}
										</Text>
									</Stack>
								</HStack>
							</Box>
						))}
					</SimpleGrid>
				</Box>

				<Stack spacing={3}>
					<Text fontSize="sm" fontWeight="semibold" color={mutedText} textTransform="uppercase" letterSpacing="wide">
						Who this platform supports
					</Text>
					<Flex wrap="wrap" gap={3}>
						{audienceTags.map((tag) => (
							<Badge
								key={tag}
								variant="subtle"
								colorScheme="blue"
								px={4}
								py={2}
								borderRadius="full"
								fontSize="0.8rem"
							>
								{tag}
							</Badge>
						))}
					</Flex>
				</Stack>

				<Box bg={calloutBg} borderWidth="1px" borderColor={panelBorder} borderRadius="2xl" p={{ base: 5, md: 6 }}>
					<Text fontWeight="semibold" mb={2}>
						Why it fits CHARUSAT
					</Text>
					<Text color={mutedText}>
						The project is tailored for CHARUSAT workflows, with university email onboarding, automatic
						department-aware access, targeted announcements for students, and a separate dashboard for professors.
					</Text>
				</Box>
			</VStack>

			<Box flex={{ base: "unset", lg: "0 0 460px" }}>
				{authMode === "signup" ? (
					<EmailSignupCard onSwitchToLogin={switchToLogin} />
				) : (
					<EmailLoginCard onSwitchToSignup={switchToSignup} />
				)}
			</Box>
		</Flex>
	);
};

export default AuthPage;
