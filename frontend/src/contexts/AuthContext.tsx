import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
interface AuthContextType {
  isAuthenticated: boolean | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", //include the cookies in header
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      console.log(data.message);
      setIsAuthenticated(true);

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/users/refresh-access-token",
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to refresh token:", data.message);
        throw new Error(data.message);
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  };

  //Initial access Token
  const verifyAccessToken = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/users/verify-access-token",
        {
          method: "POST",
          credentials: "include",
        }
      );
      //if not authenticated throw error
      const data = await response.json();
      if (!response.ok) {
        refreshAccessToken();
        throw new Error(await data.message);
      }
      console.log(data.message);
      //if authenticated set isAuthenticated to true and redirect.
      setIsAuthenticated(true);
      if (location.pathname === "/login") {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:3000/users/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  //for refresh accesstoken every 2 minutes
  useEffect(() => {
    setInterval(async () => {
      refreshAccessToken();
    }, 2 * 45 * 1000); // Refresh every 2 minutes
  }, []);

  //for Initial access token check
  useEffect(() => {
    verifyAccessToken();
  }, []);

  if (loading) {
    return <div></div>; // Or some kind of loading indicator
  }
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
