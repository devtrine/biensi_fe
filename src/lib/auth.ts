import { ensureAuth, logout } from '../services/auth.service'
export type { UserProfile } from '../types/auth'
export const ensureAuthToken = ensureAuth
export const logoutUser = logout
