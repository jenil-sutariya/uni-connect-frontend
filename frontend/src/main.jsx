import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { appTheme } from "./theme/appTheme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
	// React.StrictMode renders every component twice (in the initial render), only in development.
	<React.StrictMode>
		<RecoilRoot>
			<BrowserRouter>
				<ChakraProvider theme={appTheme}>
					<ColorModeScript initialColorMode={appTheme.config.initialColorMode} />
					<GoogleOAuthProvider clientId={'97824393481-jnme8p4mh597fo5sdmpcr6jf7rth1sto.apps.googleusercontent.com'}>
						<SocketContextProvider>
							<App />
						</SocketContextProvider>
					</GoogleOAuthProvider>
				</ChakraProvider>
			</BrowserRouter>
		</RecoilRoot>
	</React.StrictMode>
);
