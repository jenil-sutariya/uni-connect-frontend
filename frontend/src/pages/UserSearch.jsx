import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Box,
	Button,
	Flex,
	IconButton,
	Input,
	List,
	ListItem,
	Skeleton,
	SkeletonCircle,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { useSocket } from "../context/SocketContext";

const UserSearch = () => {
	const [query, setQuery] = useState("");
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const panelBg = useColorModeValue("white", "gray.dark");
	const dividerColor = useColorModeValue("gray.200", "whiteAlpha.200");
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");
	const fieldBg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
	const fieldBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const skeletonStart = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const skeletonEnd = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
	const hoverBg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
	const { socket } = useSocket();

	useEffect(() => {
		if (!socket) return;

		const handleNewUser = (newUser) => {
			setUsers((prevUsers) => [newUser, ...prevUsers]);
		};

		socket.on("newUser", handleNewUser);
		return () => socket.off("newUser", handleNewUser);
	}, [socket]);

	useEffect(() => {
		const searchQuery = searchParams.get("q") || "";
		setQuery(searchQuery);
		fetchUsers(searchQuery);
	}, [searchParams]);

	const fetchUsers = async (searchValue) => {
		if (searchValue.length < 1) {
			setUsers([]);
			return;
		}

		setLoading(true);
		try {
			const res = await fetch(`/api/users/search?query=${searchValue}`);
			const data = await res.json();
			setUsers(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
		setLoading(false);
	};

	return (
		<Box w='full' py={{ base: 2, md: 4 }}>
			<Flex
				gap={4}
				flexDirection='column'
				mx='auto'
				w='full'
				maxW={{ base: "full", md: "760px" }}
				bg={panelBg}
				borderRadius='xl'
				p={{ base: 4, md: 5 }}
				className='glass-panel-strong'
			>
				<Flex alignItems='center' justifyContent='space-between' gap={3}>
					<Box>
						<Text className='section-eyebrow mb-2'>Discovery</Text>
						<Text className='font-display text-2xl font-semibold' color={titleColor}>Search Users</Text>
					</Box>
					<Box
						as='button'
						aria-label='Close'
						onClick={() => navigate("/")}
						className='icon-button-soft !h-10 !w-10 !p-0'
					>
						<Flex w='100%' h='100%' alignItems='center' justifyContent='center'>
							<CloseIcon />
						</Flex>
					</Box>
				</Flex>

				<Flex alignItems='center' gap={2} flexDirection={{ base: "column", sm: "row" }}>
					<Input
						placeholder='Search for a user'
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							fetchUsers(e.target.value);
						}}
						borderRadius='16px'
						bg={fieldBg}
						borderColor={fieldBorder}
						color={titleColor}
						_placeholder={{ color: bodyColor }}
					/>
					<Button size='sm' isLoading={loading} w={{ base: "full", sm: "auto" }} className='!rounded-full !px-5'>
						<SearchIcon />
					</Button>
				</Flex>

				{loading &&
					[0, 1, 2, 3].map((_, i) => (
						<Flex key={i} gap={4} alignItems='center' p={3} borderRadius='2xl' className='surface-subtle'>
							<SkeletonCircle size='10' startColor={skeletonStart} endColor={skeletonEnd} />
							<Flex w='full' flexDirection='column' gap={3}>
								<Skeleton h='10px' w='80px' startColor={skeletonStart} endColor={skeletonEnd} />
								<Skeleton h='8px' w='90%' startColor={skeletonStart} endColor={skeletonEnd} />
							</Flex>
						</Flex>
					))}

				<List mt={1} maxH={{ base: "60vh", md: "420px" }} overflowY='auto'>
					{users.length === 0 && !loading && query.length > 0 && (
						<Text color={bodyColor}>No users found.</Text>
					)}
					{users.map((user) => (
						<ListItem
							key={user._id}
							p={3}
							borderBottom='1px solid'
							borderColor={dividerColor}
							display='flex'
							flexDirection={{ base: "column", sm: "row" }}
							alignItems={{ base: "flex-start", sm: "center" }}
							justifyContent='space-between'
							gap={2}
							cursor='pointer'
							borderRadius='20px'
							transition='all 0.2s ease'
							_hover={{ transform: "translateX(4px)", bg: hoverBg }}
							onClick={() => navigate(`/${user.username}`)}
						>
							<Flex alignItems='center' minW={0}>
								<Avatar size='sm' src={user.profilePic} mr={3} />
								<Text noOfLines={1} color={titleColor}>
									{user.name} (@{user.username})
								</Text>
							</Flex>
						</ListItem>
					))}
				</List>
			</Flex>
		</Box>
	);
};

export default UserSearch;
