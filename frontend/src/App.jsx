import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import './styles/App.css';
import './styles/Auth.css';
import './styles/Home.css';
import './styles/Notification.css';
import './styles/Profile.css';
import './styles/Responsive.css';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import SignUpPage from './pages/signup/SignUpPage';
import ProfilePage from './pages/profile/ProfilePage';
import SideBar from './components/sidebar/SideBar';
import SuggestionsBar from './components/suggestions/SuggestionsBar';
import NotificationPage from './pages/notifications/NotificationPage';
import UpdateProfile from './pages/profile/UpdateProfile';
import { Toaster } from 'react-hot-toast';
import MessagesPage from './pages/messages/MessagesPage';
import SearchPage from './pages/search/SearchPage';
import PostsSkeleton from './components/loaders/skeletons/PostsSkeleton';
import UserSkeleton from './components/loaders/skeletons/UserSkeleton';
import MobileNavBar from './components/sidebar/MobileNavBar';

function App() {
  const { data: authorizedUser, isLoading, isError, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication check failed');
      }
      return data;
    }
  });
  // const isLoadingD = true

  if (isLoading) {
    return (
      <div className='loading' style={{ display: 'flex' }}>
        <div className="loading-con">
        <UserSkeleton />
        <PostsSkeleton />
					<PostsSkeleton />
        </div>
      </div>
    );
  }

  // if (isError) {
  //   navigate('/signup')
  // }

  return (
    <div className='app'>
      {authorizedUser && (
        <div className='sidebar-con'>
          <MobileNavBar />
          <SideBar />
        </div>
      )}
      <div className="main-app-container">
        <Routes>
          <Route path="/" element={authorizedUser ? <HomePage /> : <Navigate to='/signup' />} />
          <Route path="/login" element={!authorizedUser ? <LoginPage /> : <Navigate to='/' />} />
          <Route path="/signup" element={!authorizedUser ? <SignUpPage /> : <Navigate to='/' />} />
          <Route path="/notifications" element={authorizedUser ? <NotificationPage /> : <Navigate to='/signup' />} />
          <Route path="/messages" element={authorizedUser ? <MessagesPage /> : <Navigate to='/signup' />} />
          <Route path="/search" element={authorizedUser ? <SearchPage /> : <Navigate to='/signup' />} />
          <Route path="/profile/:username" element={authorizedUser ? <ProfilePage /> : <Navigate to='/signup' />} />
          <Route path="/profile/edit" element={authorizedUser ? <UpdateProfile /> : <Navigate to='/signup' />} />
        </Routes>
      </div>
      {authorizedUser && (
        <div className='suggestion-bar-con'>
          <SuggestionsBar />
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default App;
