import { FiHome, FiSearch, FiUser, FiMessageSquare, FiLayout, FiSettings } from "react-icons/fi";

export const getNavItems = (user) => {
	if (!user) {
		return [{ label: "Sign In", to: "/auth", icon: <FiUser size={18} /> }];
	}

	return [
		{ label: "Home", to: "/", icon: <FiHome size={18} /> },
		{ label: "Search", to: "/search?q=", icon: <FiSearch size={18} /> },
		{ label: "Profile", to: `/${user.username}`, icon: <FiUser size={18} /> },
		{ label: "Chat", to: "/chat", icon: <FiMessageSquare size={18} /> },
		...(user.role === "professor"
			? [{ label: "Dashboard", to: "/professor", icon: <FiLayout size={18} /> }]
			: []),
		{ label: "Settings", to: "/settings", icon: <FiSettings size={18} /> },
	];
};

export const isActiveNavItem = (pathname, to) => {
	if (to === "/") return pathname === "/";
	if (to.startsWith("/search")) return pathname.startsWith("/search");
	return pathname === to || pathname.startsWith(`${to}/`);
};

