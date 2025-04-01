"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useAuthContext } from "@/context/authContext";

interface DashboardStats {
  usersCount: number;
  doctorsCount: number;
  appoitmentsCount?: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    usersCount: 0,
    doctorsCount: 0,
    appoitmentsCount: 0,
  });
  const router = useRouter();
  const { checkToken } = useAuth();
  const { auth_token } = useAuthContext();

  useEffect(() => {
    const fetchStats = async () => {
      await checkToken();
      if (!auth_token) {
        router.push("/login");
        return;
      }
      try {
        const [usersRes, doctorsRes, appoitmentsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/users`, {
            headers: {
              Authorization: `Bearer ${auth_token}`,
            },
            withCredentials: true,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/doctors`),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/appointments`, {
            headers: {
              Authorization: `Bearer ${auth_token}`,
            },
            withCredentials: true,
          }),
        ]);
        setStats({
          usersCount: usersRes?.data?.data?.users?.length,
          doctorsCount: doctorsRes?.data?.data?.doctors?.length,
          appoitmentsCount: appoitmentsRes?.data?.data?.past?.length+ appoitmentsRes?.data?.data?.upcoming?.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [auth_token,router]);

  return (
    <main className="p-8 h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => router.push("/doctors/create")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Doctor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => router.push("/users")}
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-green-600">
            {stats.usersCount}
          </p>
        </div>
        <div
          onClick={() => router.push("/doctors")}
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Total Doctors</h2>
          <p className="text-3xl font-bold text-blue-600">
            {stats.doctorsCount}
          </p>
        </div>
        <div
          onClick={() => router.push("/appointments")}
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Total Appointments</h2>
          <p className="text-3xl font-bold text-blue-600">
            {stats.appoitmentsCount}
          </p>
        </div>
      </div>
    </main>
  );
}
