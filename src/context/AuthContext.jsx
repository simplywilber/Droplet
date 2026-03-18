import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

// Create the context
const AuthContext = createContext();

/**
 * Provider component that wraps the app and makes auth object available to any child component that calls useAuth().
 * Listens to Firebase auth state changes and manages the 'loading' state while resolving the user.
 * 
 * @param {Object} props 
 * @param {React.ReactNode} props.children 
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes from Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {/* Do not render children until initial auth check is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook for easy access to the Auth context.
 * Returns { user, loading }
 */
export const useAuth = () => {
  return useContext(AuthContext);
};