import { Button } from "@chakra-ui/react";

const variantClasses = {
	primary: "app-button app-button-primary",
	secondary: "app-button app-button-secondary",
	ghost: "app-button app-button-ghost",
	danger: "danger-soft-button",
};

const AppButton = ({ children, variant = "primary", className = "", ...props }) => {
	const buttonClass = variantClasses[variant] || variantClasses.primary;

	return (
		<Button variant='unstyled' className={`${buttonClass} ${className}`.trim()} {...props}>
			{children}
		</Button>
	);
};

export default AppButton;

