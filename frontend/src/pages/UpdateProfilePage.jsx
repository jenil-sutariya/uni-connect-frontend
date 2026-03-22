import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	Center,
	Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";

export default function UpdateProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
	});
	const fileRef = useRef(null);
	const [updating, setUpdating] = useState(false);

	const showToast = useShowToast();
	const navigate = useNavigate();

	const { handleImageChange, imgUrl } = usePreviewImg();
	const titleColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const bodyColor = useColorModeValue("gray.600", "gray.300");
	const fieldBg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
	const fieldBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (updating) return;
		setUpdating(true);
		try {
			const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
			});
			const data = await res.json(); // updated user object
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Profile updated successfully", "success");
			setUser(data);
			localStorage.setItem("user-threads", JSON.stringify(data));
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setUpdating(false);
		}
	};
	return (
		<form onSubmit={handleSubmit}>
			<Flex align={"center"} justify={"center"} my={6}>
				<Stack
					spacing={4}
					w={"full"}
					maxW={"2xl"}
					bg={useColorModeValue("white", "gray.dark")}
					rounded={"xl"}
					boxShadow={"lg"}
					p={{ base: 5, md: 8 }}
					className='glass-panel-strong'
				>
					<Box>
						<Text className='section-eyebrow mb-2'>Profile</Text>
						<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }} color={titleColor} className='font-display'>
						User Profile Edit
						</Heading>
						<Text mt={2} color={bodyColor}>
							Update your public info so your CHARUSAT profile looks clean and complete.
						</Text>
					</Box>
					<FormControl id='userName'>
						<Stack direction={["column", "row"]} spacing={6}>
							<Center>
								<Avatar size='2xl' boxShadow={"md"} src={imgUrl || user.profilePic} />
							</Center>
							<Center w='full'>
								<Button w='full' onClick={() => fileRef.current.click()} variant='unstyled' className='soft-button !h-11'>
									Change Avatar
								</Button>
								<Input type='file' hidden ref={fileRef} onChange={handleImageChange} />
							</Center>
						</Stack>
					</FormControl>
					<FormControl>
						<FormLabel>Full name</FormLabel>
						<Input
							placeholder='John Doe'
							value={inputs.name}
							onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='text'
							bg={fieldBg}
							borderColor={fieldBorder}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>User name</FormLabel>
						<Input
							placeholder='johndoe'
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='text'
							bg={fieldBg}
							borderColor={fieldBorder}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Email address</FormLabel>
						<Input
							placeholder='your-email@example.com'
							value={inputs.email}
							onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='email'
							bg={fieldBg}
							borderColor={fieldBorder}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Bio</FormLabel>
						<Input
							placeholder='Your bio.'
							value={inputs.bio}
							onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='text'
							bg={fieldBg}
							borderColor={fieldBorder}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							placeholder='password'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='password'
							bg={fieldBg}
							borderColor={fieldBorder}
						/>
					</FormControl>
					<Stack spacing={6} direction={["column", "row"]}>
						<Button
							w='full'
							type='button'
							onClick={() => navigate(-1)}
							variant='unstyled'
							className='danger-soft-button !h-11'
						>
							Cancel
						</Button>
						<Button
							w='full'
							type='submit'
							isLoading={updating}
							colorScheme='blue'
							borderRadius='full'
							h='44px'
						>
							Submit
						</Button>
					</Stack>
				</Stack>
			</Flex>
		</form>
	);
}
