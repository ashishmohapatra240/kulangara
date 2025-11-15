"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/app/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/app/hooks/useAuth";
import axios from "axios";

interface GoogleSignInButtonProps {
  mode?: "login" | "register";
}

export function GoogleSignInButton({ mode = "login" }: GoogleSignInButtonProps) {
  const { googleLogin, isLoading } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Get user info from Google (optional - just to verify token works)
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );
        
        console.log("Google user info:", userInfo.data);

        // Send the access token to our backend
        // The backend will verify this token with Google and create/authenticate the user
        googleLogin(response.access_token);
      } catch (error) {
        console.error("Error during Google sign in:", error);
        if (axios.isAxiosError(error)) {
          console.error("Response data:", error.response?.data);
          console.error("Response status:", error.response?.status);
          console.error("Response headers:", error.response?.headers);
        }
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => login()}
      disabled={isLoading}
    >
      <FcGoogle className="mr-2 h-5 w-5" />
      {mode === "login" ? "Sign in" : "Sign up"} with Google
    </Button>
  );
}

