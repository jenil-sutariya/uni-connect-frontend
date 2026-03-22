import { extendTheme } from "@chakra-ui/react";

const styles = {
	global: {
		body: {
			color: "inherit",
			bg: "transparent",
		},
		"#root": {
			minHeight: "100vh",
		},
	},
};

const config = {
	initialColorMode: "system",
	useSystemColorMode: true,
};

const colors = {
	brand: {
		50: "#eef4ff",
		100: "#d9e7ff",
		200: "#b8d1ff",
		300: "#8cb0ff",
		400: "#5d8aff",
		500: "#3366ff",
		600: "#264fdb",
		700: "#213fb3",
		800: "#22378f",
		900: "#202f72",
	},
	gray: {
		light: "#616161",
		dark: "#1e1e1e",
	},
};

const fonts = {
	heading: "Poppins, Inter, system-ui, sans-serif",
	body: "Inter, system-ui, sans-serif",
};

const components = {
	Button: {
		baseStyle: {
			fontWeight: "600",
			borderRadius: "999px",
		},
	},
	Input: {
		defaultProps: {
			focusBorderColor: "brand.400",
		},
	},
	Textarea: {
		defaultProps: {
			focusBorderColor: "brand.400",
		},
	},
};

export const appTheme = extendTheme({ config, styles, colors, fonts, components });

