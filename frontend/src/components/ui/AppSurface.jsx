import { Box } from "@chakra-ui/react";

const variantClasses = {
	default: "glass-panel",
	strong: "glass-panel-strong",
	subtle: "surface-subtle",
	subtleStrong: "surface-subtle-strong",
};

const AppSurface = ({ children, variant = "default", className = "", ...props }) => {
	const surfaceClass = variantClasses[variant] || variantClasses.default;

	return (
		<Box className={`${surfaceClass} ${className}`.trim()} {...props}>
			{children}
		</Box>
	);
};

export default AppSurface;

