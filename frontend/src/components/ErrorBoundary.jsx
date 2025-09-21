import React from 'react';
import { Box, Text, Button, VStack } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<Box p={8} textAlign="center">
					<VStack spacing={4}>
						<Text fontSize="xl" fontWeight="bold" color="red.500">
							Something went wrong
						</Text>
						<Text color="gray.600">
							An error occurred while loading this component. Please try refreshing the page.
						</Text>
						<Button
							colorScheme="blue"
							onClick={() => {
								this.setState({ hasError: false, error: null });
								window.location.reload();
							}}
						>
							Refresh Page
						</Button>
					</VStack>
				</Box>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
