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
import io from "socket.io-client";

const socket = io("http://localhost:7000"); // Replace with your backend URL

const UserSearch = () => {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get the current user's data from localStorage
    useEffect(() => {
        // const currentUser = JSON.parse(localStorage.getItem("user-threads")); // Assuming the current user's data is stored as "user" in localStorage
        // if (currentUser) {
        //     console.log(currentUser);
        // }

        socket.on("newUser", (newUser) => {
            setUsers((prevUsers) => [newUser, ...prevUsers]); // Real-time update
        });

        return () => socket.off("newUser");
    }, []);

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
        <Box
            position="absolute"
            left="50%"
            w={{ base: "100%", md: "80%", lg: "750px" }}
            p={4}
            transform="translateX(-50%)"
        >
            <Flex gap={4} flexDirection="column" mx="auto">
                <Flex alignItems="center" justifyContent="space-between">
                    <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
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
                <Flex alignItems="center" gap={2}>
                    <Input
                        placeholder="Search for a user"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            fetchUsers(e.target.value);
                        }}
                    />
                    <Button size="sm" isLoading={loading}>
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
                <List mt={4} maxH="300px" overflowY="auto">
                    {users.length === 0 && !loading && query.length > 0 && (
                        <Text color="gray.500">No users found.</Text>
                    )}
                    {users.map((user) => (
                        <ListItem
                            key={user._id}
                            p={2}
                            borderBottom="1px solid #ddd"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            cursor="pointer"
                            _hover={{ bg: "gray.500" }}
                            onClick={() => navigate(`/${user.username}`)} // Redirect to profile
                        >
                            <Flex alignItems="center">
                                <Avatar size="sm" src={user.profilePic} mr={3} />
                                <Text>{user.name} (@{user.username})</Text>
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
