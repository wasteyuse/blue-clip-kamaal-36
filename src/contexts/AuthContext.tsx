
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signOut: async () => {},
  loading: true,
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

// List of routes that don't require authentication
const publicRoutes = [
  '/login', 
  '/register', 
  '/', 
  '/apply', 
  '/how-it-works', 
  '/creators', 
  '/faq',
  '/guidelines',
  '/payout-rules',
  '/about',
  '/privacy',
  '/terms'
];

// List of routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isAuthenticated = !!user;

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_OUT') {
          toast({
            title: "Logged out successfully",
            description: "You have been logged out of your account",
          });
          navigate('/login');
        } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
          // Don't redirect if we're already on the dashboard
          const currentPath = location.pathname;
          if (authRoutes.includes(currentPath)) {
            navigate('/dashboard');
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname, toast]);

  // Handle route protection based on auth status
  useEffect(() => {
    // Skip during initial loading
    if (loading) return;

    const currentPath = location.pathname;
    
    // If path starts with /dashboard or /admin and user is not authenticated, redirect to login
    if ((currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin')) && !isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to access this page",
      });
      navigate('/login', { state: { from: currentPath } });
    }
    
    // If user is on auth routes but already authenticated, redirect to dashboard
    if (authRoutes.includes(currentPath) && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [loading, isAuthenticated, location.pathname, navigate, toast]);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      // The redirect will be handled by the auth state listener
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out properly",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signOut, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
