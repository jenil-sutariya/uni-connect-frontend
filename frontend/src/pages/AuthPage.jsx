import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import EmailSignupCard from "../components/EmailSignupCard";
import EmailLoginCard from "../components/EmailLoginCard";

const AuthPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [authMode, setAuthMode] = useState("login"); // "signup" or "login"

	useEffect(() => {
		const mode = searchParams.get("mode");
		if (mode === "login" || mode === "signup") {
			setAuthMode(mode);
		}
	}, [searchParams]);

	const switchToLogin = () => {
		setAuthMode("login");
		setSearchParams({ mode: "login" });
	};
	
	const switchToSignup = () => {
		setAuthMode("signup");
		setSearchParams({ mode: "signup" });
	};

	return (
		<>
			{authMode === "signup" ? (
				<EmailSignupCard onSwitchToLogin={switchToLogin} />
			) : (
				<EmailLoginCard onSwitchToSignup={switchToSignup} />
			)}
		</>
	);
};

export default AuthPage;
