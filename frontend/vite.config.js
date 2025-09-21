import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		// Get rid of the CORS error
		proxy: {
			"/api": {
				target: "https://uni-connect-backend.onrender.com",
				changeOrigin: true,
				secure: true,
			},
		},
	},
	build: {
		outDir: "dist",
		assetsDir: "assets",
		sourcemap: false,
		minify: true,
	},
});
