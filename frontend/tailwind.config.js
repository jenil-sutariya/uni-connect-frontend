/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Space Grotesk", "system-ui", "sans-serif"],
				display: ["Sora", "Space Grotesk", "system-ui", "sans-serif"],
			},
			colors: {
				night: "#04060f",
				ink: "#0a1020",
				panel: "#0f1729",
				cyanGlow: "#67e8f9",
				roseGlow: "#fb7185",
				amberGlow: "#fbbf24",
			},
			boxShadow: {
				glass: "0 30px 90px -40px rgba(34,211,238,0.35)",
				panel: "0 28px 80px -42px rgba(2, 6, 23, 0.85)",
			},
			keyframes: {
				floatSlow: {
					"0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
					"50%": { transform: "translate3d(0, -16px, 0) scale(1.04)" },
				},
				pulseGlow: {
					"0%, 100%": { opacity: "0.55" },
					"50%": { opacity: "0.95" },
				},
				riseIn: {
					"0%": { opacity: "0", transform: "translate3d(0, 24px, 0)" },
					"100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
				},
			},
			animation: {
				floatSlow: "floatSlow 16s ease-in-out infinite",
				pulseGlow: "pulseGlow 8s ease-in-out infinite",
				riseIn: "riseIn 0.7s ease both",
			},
		},
	},
	plugins: [],
};
