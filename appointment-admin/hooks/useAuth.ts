"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/authContext";

interface Data {
  name?: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const { setAuthToken } = useAuthContext();
  useEffect(() => {
    checkToken();
  }, []);

  const login = async (data: Data, handleReset: () => void) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/users/login`,
        {
          email: data?.email,
          password: data?.password,
        },
        {
          withCredentials: true,
        }
      );
      handleReset();
      checkToken(); 
      window.location.reload();
      return response.data;
    } catch (error) {
      toast.error("Login failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/users/logout`,
        {},
        { withCredentials: true }
      );
      setToken(null);
      setAuthToken(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Logout failed");
      router.push("/login");
      router.refresh();
    }
  };

  const checkToken = async () => {
    try {
      const response = await axios.get(
        `api/auth/token`,
        {
          withCredentials: true,
        }
      );
      setToken(response.data.token);
      setAuthToken(response.data.token);
    } catch (error) {
      console.error("Error fetching token:", error);
      setToken(null);
      setAuthToken(null);
      return null;
    }
  };

  return { login, logout, checkToken, token };
};
