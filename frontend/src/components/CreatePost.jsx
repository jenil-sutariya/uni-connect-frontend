import { AddIcon } from "@chakra-ui/icons";
import {
	Button,
	CloseButton,
	Flex,
	FormControl,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useLocation, useParams } from "react-router-dom";

const MAX_CHAR = 500;

const CreatePost = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [postText, setPostText] = useState("");
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
	const imageRef = useRef(null);
	const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const { username } = useParams();
	const { pathname } = useLocation();
	const launcherBg = useColorModeValue("blue.500", "blue.300");
	const launcherHoverBg = useColorModeValue("blue.600", "blue.400");
	const launcherColor = useColorModeValue("white", "gray.900");
	const modalBg = useColorModeValue("whiteAlpha.900", "gray.900");
	const modalBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const fieldBg = useColorModeValue("blackAlpha.50", "whiteAlpha.50");
	const fieldBorder = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
	const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
	const mutedText = useColorModeValue("gray.500", "gray.400");
	const closeButtonBg = useColorModeValue("whiteAlpha.800", "blackAlpha.600");

	const handleTextChange = (e) => {
		const inputText = e.target.value;

		if (inputText.length > MAX_CHAR) {
			const truncatedText = inputText.slice(0, MAX_CHAR);
			setPostText(truncatedText);
			setRemainingChar(0);
		} else {
			setPostText(inputText);
			setRemainingChar(MAX_CHAR - inputText.length);
		}
	};

	const handleCreatePost = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/posts/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post created successfully", "success");
			const isOwnProfileRoute = username === user.username;
			if (pathname === "/" || isOwnProfileRoute) {
				setPosts([data, ...posts]);
			}
			onClose();
			setPostText("");
			setImgUrl("");
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Button
				position={"fixed"}
				bottom={{ base: 6, md: 10 }}
				right={{ base: 4, md: 6 }}
				bg={launcherBg}
				color={launcherColor}
				_hover={{ bg: launcherHoverBg, transform: "translateY(-2px)" }}
				onClick={onOpen}
				size={{ base: "sm", sm: "md" }}
				boxShadow='xl'
				className='!h-14 !w-14 !rounded-2xl transition'
			>
				<AddIcon />
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />

				<ModalContent bg={modalBg} borderWidth='1px' borderColor={modalBorder} className='modal-surface'>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<Textarea
								placeholder='Post content goes here..'
								onChange={handleTextChange}
								value={postText}
								minH='160px'
								borderRadius='24px'
								bg={fieldBg}
								borderColor={fieldBorder}
								color={textColor}
								_placeholder={{ color: mutedText }}
							/>
							<Text fontSize='xs' fontWeight='semibold' textAlign={"right"} m={"1"} color={mutedText}>
								{remainingChar}/{MAX_CHAR}
							</Text>

							<Input type='file' hidden ref={imageRef} onChange={handleImageChange} />

							<BsFillImageFill
								style={{ marginLeft: "5px", cursor: "pointer", color: mutedText }}
								size={16}
								onClick={() => imageRef.current.click()}
							/>
						</FormControl>

						{imgUrl && (
							<Flex mt={5} w={"full"} position={"relative"}>
								<Image src={imgUrl} alt='Selected img' />
								<CloseButton
									onClick={() => {
										setImgUrl("");
									}}
									bg={closeButtonBg}
									position={"absolute"}
									top={2}
									right={2}
								/>
							</Flex>
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading} className='!rounded-full !px-6'>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreatePost;
