import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	Divider,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function EmailSignupCard({ onSwitchToLogin }) {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const setUser = useSetRecoilState(userAtom);
	const toast = useToast();

	const [inputs, setInputs] = useState({
		name: "",
		email: "",
		username: "",
		password: "",
	});

	const handleSignup = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/users/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();

			if (data.error) {
				toast({
					title: "Error",
					description: data.error,
					status: "error",
					duration: 3000,
					isClosable: true,
				});
				return;
			}

			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
			
			toast({
				title: "Success",
				description: "Account created successfully!",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Signup failed: " + error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSignup = async (credentialResponse) => {
		try {
			const decoded = jwtDecode(credentialResponse.credential);
			
			console.log("Google signup attempt:", {
				email: decoded.email,
				name: decoded.name,
				picture: decoded.picture
			});
			
			const res = await fetch("/api/users/google-signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: decoded.email,
					name: decoded.name,
					picture: decoded.picture,
				}),
			});
			
			console.log("Response status:", res.status);
			const data = await res.json();
			console.log("Response data:", data);

			if (data.error) {
				toast({
					title: "Error",
					description: data.error,
					status: "error",
					duration: 3000,
					isClosable: true,
				});
				return;
			}

			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
			
			toast({
				title: "Success",
				description: "Successfully signed up with Google!",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			console.error("Google signup error:", error);
			toast({
				title: "Error",
				description: "Google signup failed: " + error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Flex align={"center"} justify={"center"} w='full' px={{ base: 0, sm: 4 }}>
			<Stack spacing={{ base: 6, md: 8 }} mx={"auto"} maxW={"lg"} w='full' py={{ base: 6, md: 12 }} px={{ base: 0, sm: 6 }}>
				<Stack align={"center"}>
					<Heading fontSize={{ base: "3xl", md: "4xl" }} textAlign={"center"}>
						Sign up
					</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						Join UNI Connect
					</Text>
				</Stack>
				<Box 
					rounded={"lg"} 
					bg={useColorModeValue("white", "gray.dark")} 
					boxShadow={"lg"} 
					p={{ base: 5, md: 8 }}
					w='full'
					maxW={{
						base: "full",
						sm: "400px",
					}}
					mx='auto'
				>
					<Stack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Full Name</FormLabel>
							<Input
								type="text"
								value={inputs.name}
								onChange={(e) => setInputs((inputs) => ({ ...inputs, name: e.target.value }))}
								placeholder="Enter your full name"
							/>
						</FormControl>
						
						<FormControl isRequired>
							<FormLabel>Email</FormLabel>
							<Input
								type="email"
								value={inputs.email}
								onChange={(e) => setInputs((inputs) => ({ ...inputs, email: e.target.value }))}
								placeholder="Enter your institute email"
							/>
						</FormControl>
						
						<FormControl isRequired>
							<FormLabel>Username</FormLabel>
							<Input
								type="text"
								value={inputs.username}
								onChange={(e) => setInputs((inputs) => ({ ...inputs, username: e.target.value }))}
								placeholder="Choose a username"
							/>
						</FormControl>
						
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={inputs.password}
									onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
									placeholder="Create a password"
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() => setShowPassword((showPassword) => !showPassword)}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						
						<Stack spacing={10} pt={2}>
							<Button
								loadingText="Creating account..."
								size="lg"
								bg={useColorModeValue("blue.400", "blue.600")}
								color={"white"}
								_hover={{
									bg: useColorModeValue("blue.500", "blue.700"),
								}}
								onClick={handleSignup}
								isLoading={loading}
							>
								Sign up
							</Button>
							
							<Divider />
							
							<Box display="flex" justifyContent="center" w='full' overflowX='auto' pb={1}>
								<GoogleLogin
									onSuccess={handleGoogleSignup}
									onError={() => {
										toast({
											title: "Error",
											description: "Google signup failed",
											status: "error",
											duration: 3000,
											isClosable: true,
										});
									}}
									useOneTap
									theme="filled_blue"
									size="large"
									text="signup_with"
									shape="rectangular"
									logo_alignment="left"
								/>
							</Box>
						</Stack>
						
						<Stack pt={6}>
							<Text align={"center"}>
								Already have an account?{" "}
								<Link color={"blue.400"} onClick={onSwitchToLogin}>
									Login
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
