import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'

import Landing from '@/pages/Landing'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import OtpVerification from '@/pages/auth/OtpVerification'
import ResetPassword from '@/pages/auth/ResetPassword'

import Home from '@/pages/Home'
import Explore from '@/pages/Explore'
import Categories from '@/pages/Categories'
import Search from '@/pages/Search'
import SearchResult from '@/pages/SearchResult'
import Upload from '@/pages/Upload'
import UploadSuccess from '@/pages/UploadSuccess'
import ReelDetails from '@/pages/ReelDetails'
import RecipeDetails from '@/pages/RecipeDetails'
import Bookmarks from '@/pages/Bookmarks'
import SavedRecipes from '@/pages/SavedRecipes'
import Profile from '@/pages/Profile'
import EditProfile from '@/pages/EditProfile'
import Followers from '@/pages/Followers'
import Following from '@/pages/Following'

import Settings from '@/pages/Settings'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import HelpCenter from '@/pages/HelpCenter'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'
import LoadingPage from '@/pages/LoadingPage'

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Landing />} />
      <Route path="/loading" element={<LoadingPage />} />

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Main app */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search-result" element={<SearchResult />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/saved-recipes" element={<SavedRecipes />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/followers" element={<Followers />} />
        <Route path="/following" element={<Following />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/about" element={<About />} />
        <Route path="/reel/:id" element={<ReelDetails />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Route>

      {/* Standalone (no bottom nav) */}
      <Route path="/upload-success" element={<UploadSuccess />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
