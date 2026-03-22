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

export default function EmailLoginCard({ onSwitchToSignup }) {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const setUser = useSetRecoilState(userAtom);
	const toast = useToast();
	const subtitleColor = useColorModeValue("gray.600", "gray.300");
	const primaryButtonBg = useColorModeValue("blue.500", "blue.400");
	const primaryButtonHoverBg = useColorModeValue("blue.600", "blue.500");

	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});

	const handleLogin = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/users/login", {
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
				description: "Logged in successfully!",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Login failed: " + error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = async (credentialResponse) => {
		try {
			const decoded = jwtDecode(credentialResponse.credential);
			
			console.log("Google login attempt:", {
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
				description: "Successfully logged in with Google!",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			console.error("Google login error:", error);
			toast({
				title: "Error",
				description: "Google login failed: " + error.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Flex align={"center"} justify={"center"} w='full' px={{ base: 0, sm: 4 }}>
			<Stack spacing={{ base: 6, md: 8 }} mx={"auto"} maxW={"lg"} w='full' py={{ base: 4, md: 8 }} px={{ base: 0, sm: 2, md: 4 }}>
				<Stack align={"center"}>
					<Heading fontSize={{ base: "3xl", md: "4xl" }} textAlign={"center"}>
						Welcome Back
					</Heading>
					<Text fontSize={{ base: "md", md: "lg" }} color={subtitleColor} textAlign={"center"}>
						Sign in to continue to the CHARUSAT UNI Connect community.
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
							<FormLabel>Username</FormLabel>
							<Input
								type="text"
								value={inputs.username}
								onChange={(e) => setInputs((inputs) => ({ ...inputs, username: e.target.value }))}
								placeholder="Enter your username"
							/>
						</FormControl>
						
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={inputs.password}
									onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
									placeholder="Enter your password"
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
								loadingText="Logging in..."
								size="lg"
								bg={primaryButtonBg}
								color={"white"}
								_hover={{
									bg: primaryButtonHoverBg,
								}}
								onClick={handleLogin}
								isLoading={loading}
							>
								Login
							</Button>
							
							<Divider />

							<Text fontSize="sm" color={subtitleColor} textAlign="center">
								You can also use Google to enter your university network faster.
							</Text>
							
							<Box display="flex" justifyContent="center" w='full' overflowX='auto' pb={1}>
								<GoogleLogin
									onSuccess={handleGoogleLogin}
									onError={() => {
										toast({
											title: "Error",
											description: "Google login failed",
											status: "error",
											duration: 3000,
											isClosable: true,
										});
									}}
									useOneTap
									theme="filled_blue"
									size="large"
									text="continue_with"
									shape="rectangular"
									logo_alignment="left"
								/>
							</Box>
						</Stack>
						
						<Stack pt={6}>
							<Text align={"center"}>
								Don't have an account?{" "}
								<Link color={"blue.400"} onClick={onSwitchToSignup}>
									Sign up
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
