import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { STORAGE_KEYS, storage } from '../utils/storage';

/**
 * Auth context - holds the current user, the JWT, and exposes
 * login / logout. Designed to be storage-agnostic so swapping to
 * cookies or a real /me endpoint is trivial.
 */

const AuthContext = createContext(null);

const decodeTokenExpiry = (token) => {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(atob(parts[1]));
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.get(STORAGE_KEYS.AUTH_USER));
  const [token, setToken] = useState(() => storage.get(STORAGE_KEYS.AUTH_TOKEN));
  const [remember, setRemember] = useState(
    () => storage.get(STORAGE_KEYS.AUTH_REMEMBER) === true,
  );
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const expiry = decodeTokenExpiry(token);
    if (expiry && expiry <= Date.now()) {
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.AUTH_USER);
      storage.remove(STORAGE_KEYS.AUTH_REMEMBER);
      setToken(null);
      setUser(null);
      setRemember(false);
    }
    setIsInitializing(false);
  }, [token]);

  const persist = useCallback((nextUser, nextToken, nextRemember) => {
    if (nextRemember) {
      storage.set(STORAGE_KEYS.AUTH_USER, nextUser);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, nextToken);
      storage.set(STORAGE_KEYS.AUTH_REMEMBER, true);
    } else {
      storage.set(STORAGE_KEYS.AUTH_USER, nextUser);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, nextToken);
      storage.remove(STORAGE_KEYS.AUTH_REMEMBER);
    }
  }, []);

  const login = useCallback(
    (authUser, authToken, shouldRemember = false) => {
      setUser(authUser);
      setToken(authToken);
      setRemember(shouldRemember);
      persist(authUser, authToken, shouldRemember);
    },
    [persist],
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRemember(false);
    storage.remove(STORAGE_KEYS.AUTH_USER);
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    storage.remove(STORAGE_KEYS.AUTH_REMEMBER);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      remember,
      isAuthenticated: Boolean(user && token),
      isInitializing,
      login,
      logout,
      setUser,
    }),
    [user, token, remember, isInitializing, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default AuthContext;
