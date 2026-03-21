import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";
import { SOCKET_URL } from "../utils/api";

const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const user = useRecoilValue(userAtom);

	useEffect(() => {
		if (!user?._id) {
			setSocket(null);
			setOnlineUsers([]);
			return;
		}

		const socketInstance = io(SOCKET_URL, {
			query: {
				userId: user._id,
			},
			withCredentials: true,
			transports: ["websocket", "polling"],
		});

		setSocket(socketInstance);

		const handleOnlineUsers = (users) => {
			setOnlineUsers(users);
		};

		socketInstance.on("getOnlineUsers", handleOnlineUsers);

		return () => {
			socketInstance.off("getOnlineUsers", handleOnlineUsers);
			socketInstance.close();
		};
	}, [user?._id]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
