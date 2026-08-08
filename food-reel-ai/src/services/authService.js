import api from './api'

export const login = (payload) => api.post('/auth/user/login', payload)
export const signup = (payload) => api.post('/auth/user/register', payload)
export const logout = () => api.get('/auth/user/logout')
export const verifyOtp = (payload) => api.post('/auth/verify-otp', payload)
export const forgotPassword = (payload) => api.post('/auth/forgot-password', payload)
export const resetPassword = (payload) => api.post('/auth/reset-password', payload)

export const updateProfile = (formData) => api.patch('/user/profile', formData)
export const toggleFollow = (targetUserId) => api.post(`/user/follow/${targetUserId}`)
export const getUserProfile = (id) => api.get(`/user/${id}`)
export const getCurrentUser = () => api.get('/auth/user/me')
export const listUsersByIds = (ids) => api.get('/user/list/ids', { params: { ids } })
export const getFollowers = (userId) => api.get(`/user/${userId}/followers`)
export const getFollowing = (userId) => api.get(`/user/${userId}/following`)
