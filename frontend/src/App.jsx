import { Center, Spinner } from "@chakra-ui/react";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import ErrorBoundary from "./components/ErrorBoundary";
import AppLayout from "./components/layout/AppLayout";
import PublicLayout from "./components/layout/PublicLayout";

const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const UserPage = lazy(() => import("./pages/UserPage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const UpdateProfilePage = lazy(() => import("./pages/UpdateProfilePage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const UserSearch = lazy(() => import("./pages/UserSearch"));
const ProfessorDashboard = lazy(() => import("./pages/ProfessorDashboard"));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then((module) => ({ default: module.SettingsPage })));

const RouteLoader = () => (
	<Center py={16}>
		<Spinner size='xl' color='brand.400' thickness='4px' />
	</Center>
);

function App() {
	const user = useRecoilValue(userAtom);

	return (
		<Suspense fallback={<RouteLoader />}>
			<Routes>
				<Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' replace />} />

				<Route element={user ? <AppLayout /> : <Navigate to='/auth?mode=login' replace />}>
					<Route index element={<HomePage />} />
					<Route path='/update' element={<UpdateProfilePage />} />
					<Route path='/chat' element={<ErrorBoundary><ChatPage /></ErrorBoundary>} />
					<Route path='/search' element={<UserSearch />} />
					<Route path='/settings' element={<SettingsPage />} />
					<Route path='/professor' element={user?.role === "professor" ? <ProfessorDashboard /> : <Navigate to='/' replace />} />
				</Route>

				<Route element={user ? <AppLayout /> : <PublicLayout />}>
					<Route path='/:username' element={<UserPage />} />
					<Route path='/:username/post/:pid' element={<PostPage />} />
				</Route>

				<Route path='*' element={<Navigate to={user ? "/" : "/auth"} replace />} />
			</Routes>
		</Suspense>
	);
}

export default App;
