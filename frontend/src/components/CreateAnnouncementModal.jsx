import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Select,
	VStack,
	HStack,
	Stack,
	Text,
	Checkbox,
	CheckboxGroup,
	SimpleGrid,
	Badge,
	Box,
	useColorModeValue,
	Image,
	Flex,
	CloseButton,
	Divider,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { BsFillImageFill } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";

const CreateAnnouncementModal = ({ isOpen, onClose, onAnnouncementCreated }) => {
	const [loading, setLoading] = useState(false);
	const showToast = useShowToast();
	const bgColor = useColorModeValue("gray.50", "gray.700");
	const imageRef = useRef(null);
	const [photos, setPhotos] = useState([]);

	const [formData, setFormData] = useState({
		title: "",
		content: "",
		targetDepartments: [],
		targetBatches: [],
		priority: "medium",
		category: "general",
		expiryDate: "",
		photos: [],
	});

	// Available departments
	const departments = [
		{ code: "DCS", name: "DEPSTAR CSE" },
		{ code: "DIT", name: "DEPSTAR IT" },
		{ code: "DCE", name: "DEPSTAR CE" },
		{ code: "CS", name: "CSPIT CSE" },
		{ code: "IT", name: "CSPIT IT" },
		{ code: "CE", name: "CSPIT CE" },
		{ code: "ALL", name: "All Departments" },
	];

	// Available batches (years) - only currently studying batches (current year + last 3 years)
	const currentYear = new Date().getFullYear();
	const batches = [];
	// Generate current year + last 3 years (4 total batches)
	for (let i = 0; i < 4; i++) {
		const year = currentYear - i;
		batches.push(year.toString());
	}
	batches.push("ALL"); // Option to target all batches

	const handleInputChange = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleDepartmentChange = (departments) => {
		// If "ALL" is selected, clear other selections
		if (departments.includes("ALL")) {
			setFormData(prev => ({
				...prev,
				targetDepartments: ["ALL"]
			}));
		} else {
			setFormData(prev => ({
				...prev,
				targetDepartments: departments
			}));
		}
	};

	const handleBatchChange = (batches) => {
		// If "ALL" is selected, clear other selections
		if (batches.includes("ALL")) {
			setFormData(prev => ({
				...prev,
				targetBatches: ["ALL"]
			}));
		} else {
			setFormData(prev => ({
				...prev,
				targetBatches: batches
			}));
		}
	};

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		if (files.length === 0) return;

		// Limit to 5 photos
		if (photos.length + files.length > 5) {
			showToast("Error", "Maximum 5 photos allowed", "error");
			return;
		}

		console.log(`Processing ${files.length} selected files...`);

		files.forEach((file, index) => {
			if (file && file.type.startsWith("image/")) {
				// Check file size (max 5MB per image)
				if (file.size > 5 * 1024 * 1024) {
					showToast("Error", `Image ${file.name} is too large. Max size is 5MB.`, "error");
					return;
				}

				const reader = new FileReader();
				reader.onloadend = () => {
					const base64String = reader.result;
					console.log(`Processed image ${index + 1}: ${file.name}, size: ${file.size} bytes`);
					
					setPhotos(prev => [...prev, {
						id: Date.now() + Math.random() + index,
						file: file,
						url: base64String,
						name: file.name
					}]);
				};
				reader.onerror = () => {
					showToast("Error", `Failed to read image ${file.name}`, "error");
				};
				reader.readAsDataURL(file);
			} else {
				showToast("Error", "Please select only image files", "error");
			}
		});
	};

	const removePhoto = (photoId) => {
		setPhotos(prev => prev.filter(photo => photo.id !== photoId));
	};

	const handleSubmit = async () => {
		if (!formData.title || !formData.content || 
			formData.targetDepartments.length === 0 || 
			formData.targetBatches.length === 0) {
			showToast("Error", "Please fill all required fields", "error");
			return;
		}

		setLoading(true);
		try {
			// Prepare the data with photos
			const photoUrls = photos.map(photo => photo.url);
			const submitData = {
				...formData,
				photos: photoUrls
			};

			console.log(`Submitting announcement with ${photoUrls.length} photos`);
			if (photoUrls.length > 0) {
				console.log("Photo data lengths:", photoUrls.map(url => url.length));
				console.log("First photo preview:", photoUrls[0].substring(0, 100) + "...");
			}



			const res = await fetch("/api/announcements/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(submitData),
			});

			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				console.error("Server error:", data.error);
				return;
			}

			console.log("Announcement created successfully:", data.announcement);
			console.log("Photos in created announcement:", data.announcement?.photos);

			showToast("Success", "Announcement created successfully!", "success");
			onAnnouncementCreated(data.announcement);
			
			// Reset form
			setFormData({
				title: "",
				content: "",
				targetDepartments: [],
				targetBatches: [],
				priority: "medium",
				category: "general",
				expiryDate: "",
				photos: [],
			});
			setPhotos([]);
		} catch (error) {
			showToast("Error", "Failed to create announcement", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setFormData({
			title: "",
			content: "",
			targetDepartments: [],
			targetBatches: [],
			priority: "medium",
			category: "general",
			expiryDate: "",
			photos: [],
		});
		setPhotos([]);
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} size="xl" scrollBehavior="inside">
			<ModalOverlay />
			<ModalContent
				maxW={{ base: "calc(100vw - 1.5rem)", md: "600px" }}
				mx={{ base: 3, md: 6 }}
				my={{ base: 3, md: 6 }}
			>
				<ModalHeader>Create New Announcement</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={6}>
					<VStack spacing={4} align="stretch">
						{/* Title */}
						<FormControl isRequired>
							<FormLabel>Title</FormLabel>
							<Input
								placeholder="Enter announcement title"
								value={formData.title}
								onChange={(e) => handleInputChange("title", e.target.value)}
							/>
						</FormControl>

						{/* Content */}
						<FormControl isRequired>
							<FormLabel>Content</FormLabel>
							<Textarea
								placeholder="Enter announcement content"
								value={formData.content}
								onChange={(e) => handleInputChange("content", e.target.value)}
								rows={5}
								minH={{ base: "120px", md: "auto" }}
							/>
						</FormControl>

						{/* Photo Upload Section */}
						<FormControl>
							<FormLabel>Photos (Optional)</FormLabel>
							<VStack align="stretch" spacing={3}>
								<Stack direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }} spacing={3}>
									<Button
										leftIcon={<BsFillImageFill />}
										onClick={() => imageRef.current?.click()}
										variant="outline"
										size="sm"
										w={{ base: "full", sm: "auto" }}
									>
										Add Photos
									</Button>
									<Text fontSize="sm" color="gray.500">
										Maximum 5 photos allowed
									</Text>
								</Stack>

								<Input
									type="file"
									multiple
									accept="image/*"
									ref={imageRef}
									onChange={handleImageChange}
									hidden
								/>

								{/* Photo Preview Grid */}
								{photos.length > 0 && (
									<Box>
										<Text fontSize="sm" fontWeight="medium" mb={2}>
											Selected Photos ({photos.length}/5):
										</Text>
										<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
											{photos.map((photo) => (
												<Box key={photo.id} position="relative">
													<Image
														src={photo.url}
														alt={photo.name}
														borderRadius="md"
														maxH="120px"
														w="full"
														objectFit="cover"
														border="1px"
														borderColor="gray.200"
													/>
													<CloseButton
														position="absolute"
														top={1}
														right={1}
														size="sm"
														bg="red.500"
														color="white"
														_hover={{ bg: "red.600" }}
														onClick={() => removePhoto(photo.id)}
													/>
													<Text
														fontSize="xs"
														color="gray.600"
														mt={1}
														isTruncated
													>
														{photo.name}
													</Text>
												</Box>
											))}
										</SimpleGrid>
									</Box>
								)}
							</VStack>
						</FormControl>

						<Divider />

						{/* Target Departments */}
						<FormControl isRequired>
							<FormLabel>Target Departments</FormLabel>
							<Box bg={bgColor} p={3} borderRadius="md">
								<CheckboxGroup
									value={formData.targetDepartments}
									onChange={handleDepartmentChange}
								>
									<SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
										{departments.map((dept) => (
											<Checkbox
												key={dept.code}
												value={dept.code}
												isDisabled={
													formData.targetDepartments.includes("ALL") && dept.code !== "ALL"
												}
											>
												<Text fontSize="sm">{dept.name}</Text>
											</Checkbox>
										))}
									</SimpleGrid>
								</CheckboxGroup>
							</Box>
							{formData.targetDepartments.length > 0 && (
								<HStack mt={2} flexWrap="wrap">
									{formData.targetDepartments.map((deptCode) => {
										const dept = departments.find(d => d.code === deptCode);
										return (
											<Badge key={deptCode} colorScheme="blue">
												{dept?.name}
											</Badge>
										);
									})}
								</HStack>
							)}
						</FormControl>

						{/* Target Batches */}
						<FormControl isRequired>
							<FormLabel>Target Batches</FormLabel>
							<Box bg={bgColor} p={3} borderRadius="md">
								<CheckboxGroup
									value={formData.targetBatches}
									onChange={handleBatchChange}
								>
									<SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
										{batches.map((batch) => (
											<Checkbox
												key={batch}
												value={batch}
												isDisabled={
													formData.targetBatches.includes("ALL") && batch !== "ALL"
												}
											>
												<Text fontSize="sm">
													{batch === "ALL" ? "All Years" : `Class of ${batch}`}
												</Text>
											</Checkbox>
										))}
									</SimpleGrid>
								</CheckboxGroup>
							</Box>
							{formData.targetBatches.length > 0 && (
								<HStack mt={2} flexWrap="wrap">
									{formData.targetBatches.map((batch) => (
										<Badge key={batch} colorScheme="green">
											{batch === "ALL" ? "All Years" : `${batch}`}
										</Badge>
									))}
								</HStack>
							)}
						</FormControl>

						{/* Priority and Category */}
						<Stack direction={{ base: "column", md: "row" }} spacing={4}>
							<FormControl>
								<FormLabel>Priority</FormLabel>
								<Select
									value={formData.priority}
									onChange={(e) => handleInputChange("priority", e.target.value)}
								>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
									<option value="urgent">Urgent</option>
								</Select>
							</FormControl>

							<FormControl>
								<FormLabel>Category</FormLabel>
								<Select
									value={formData.category}
									onChange={(e) => handleInputChange("category", e.target.value)}
								>
									<option value="general">General</option>
									<option value="academic">Academic</option>
									<option value="examination">Examination</option>
									<option value="event">Event</option>
									<option value="emergency">Emergency</option>
								</Select>
							</FormControl>
						</Stack>

						{/* Expiry Date */}
						<FormControl>
							<FormLabel>Expiry Date (Optional)</FormLabel>
							<Input
								type="datetime-local"
								value={formData.expiryDate}
								onChange={(e) => handleInputChange("expiryDate", e.target.value)}
							/>
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Flex w="full" gap={3} direction={{ base: "column-reverse", sm: "row" }} justify="flex-end">
						<Button variant="ghost" onClick={handleClose} w={{ base: "full", sm: "auto" }}>
							Cancel
						</Button>
						<Button
							colorScheme="blue"
							onClick={handleSubmit}
							isLoading={loading}
							loadingText="Creating..."
							w={{ base: "full", sm: "auto" }}
						>
							Create Announcement
						</Button>
					</Flex>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CreateAnnouncementModal;
