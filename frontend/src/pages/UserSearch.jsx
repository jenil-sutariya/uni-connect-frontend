import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    Input,
    Button,
    Skeleton,
    SkeletonCircle,
    Text,
    List,
    ListItem,
    Avatar,
    IconButton,
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
    const headingColor = useColorModeValue("gray.600", "gray.400");
    const dividerColor = useColorModeValue("gray.200", "whiteAlpha.200");
    const { socket } = useSocket();

    // Get the current user's data from localStorage
    useEffect(() => {
        // const currentUser = JSON.parse(localStorage.getItem("user-threads")); // Assuming the current user's data is stored as "user" in localStorage
        // if (currentUser) {
        //     console.log(currentUser);
        // }

        if (!socket) return;

        const handleNewUser = (newUser) => {
            setUsers((prevUsers) => [newUser, ...prevUsers]); // Real-time update
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
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoading(false);
    };

    return (
        <Box w="full" py={{ base: 2, md: 4 }}>
            <Flex
                gap={4}
                flexDirection="column"
                mx="auto"
                w="full"
                maxW={{ base: "full", md: "720px" }}
                bg={panelBg}
                borderRadius="xl"
                p={{ base: 3, md: 4 }}
            >
                <Flex alignItems="center" justifyContent="space-between">
                    <Text fontWeight={700} color={headingColor}>
                        Search Users
                    </Text>
                    <IconButton
                        icon={<CloseIcon />}
                        aria-label="Close"
                        onClick={() => navigate("/")}
                        size="sm"
                    />
                </Flex>

                {/* Search Bar */}
                <Flex alignItems="center" gap={2} flexDirection={{ base: "column", sm: "row" }}>
                    <Input
                        placeholder="Search for a user"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            fetchUsers(e.target.value);
                        }}
                    />
                    <Button size="sm" isLoading={loading} w={{ base: "full", sm: "auto" }}>
                        <SearchIcon />
                    </Button>
                </Flex>

                {/* Loading Skeleton */}
                {loading &&
                    [0, 1, 2, 3].map((_, i) => (
                        <Flex key={i} gap={4} alignItems="center" p="1" borderRadius="md">
                            <SkeletonCircle size="10" />
                            <Flex w="full" flexDirection="column" gap={3}>
                                <Skeleton h="10px" w="80px" />
                                <Skeleton h="8px" w="90%" />
                            </Flex>
                        </Flex>
                    ))}

                {/* User List */}
                <List mt={4} maxH={{ base: "60vh", md: "300px" }} overflowY="auto">
                    {users.length === 0 && !loading && query.length > 0 && (
                        <Text color="gray.500">No users found.</Text>
                    )}
                    {users.map((user) => (
                        <ListItem
                            key={user._id}
                            p={2}
                            borderBottom="1px solid"
                            borderColor={dividerColor}
                            display="flex"
                            flexDirection={{ base: "column", sm: "row" }}
                            alignItems={{ base: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                            gap={2}
                            cursor="pointer"
                            _hover={{ bg: "gray.500" }}
                            onClick={() => navigate(`/${user.username}`)} // Redirect to profile
                        >
                            <Flex alignItems="center" minW={0}>
                                <Avatar size="sm" src={user.profilePic} mr={3} />
                                <Text noOfLines={1}>{user.name} (@{user.username})</Text>
                            </Flex>

                            {/* Remove Follow Button */}
                            {/* No follow button here, just the user name and avatar */}
                        </ListItem>
                    ))}
                </List>
            </Flex>
        </Box>
    );
};

export default UserSearch;
