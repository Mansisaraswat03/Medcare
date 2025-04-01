"use client";

import { useAuthContext } from "@/context/authContext";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PatientDetails {
  age: number;
  name: string;
  gender: string;
  address: string;
  contact: number;
}

interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  type: string;
  problem: string;
  patient_details: PatientDetails;
  doctor_specialty: string;
  doctor_name: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    past: Appointment[];
    upcoming: Appointment[];
  };
}

const AdminAppointmentsPage: React.FC = () => {
    const {auth_token} = useAuthContext()
//   const adminToken = process.env.NEXT_PUBLIC_TOKEN;
  const [appointments, setAppointments] = useState<{
    past: Appointment[];
    upcoming: Appointment[];
  }>({ past: [], upcoming: [] });
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("past");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/appointments`,
          {
            headers: {
              Authorization: `Bearer ${auth_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch appointments.");
        }

        const data: ApiResponse = await response.json();
        console.log(data);
        setAppointments(data?.data);
      } catch (err) {
        setError("Error fetching appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [auth_token]);

  const updateAppointmentStatus = async (
    appointmentId: number,
    status: "cancelled" | "accepted"
  ) => {
    if (!auth_token) return;

    try {
      const response = await fetch(
        `http://localhost:8000/v1/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${status} appointment.`);
      }

      setAppointments((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status }
            : appointment
        ),
      }));
      toast.success(`Appointment ${status} successfully.`);
    } catch (err) {
      toast.error("Error updating appointment.");
    }
  };

  if (loading) return <p className="text-center">Loading appointments...</p>;
  if (error)
    return <p className="text-center text-red-500">Some error occurred</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">All Appointments</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "past" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past Appointments
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold ${
            activeTab === "upcoming" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Appointments
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Doctor</th>
              <th className="p-3 border">Specialty</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Time</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Problem</th>
              {activeTab === "upcoming" && (
                <th className="p-3 border">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {appointments[activeTab]?.map((appointment) => (
              <tr key={appointment.id} className="text-center border-b">
                <td className="p-3 border">{appointment.doctor_name}</td>
                <td className="p-3 border">{appointment.doctor_specialty}</td>
                <td className="p-3 border">
                  {new Date(appointment.appointment_date).toLocaleDateString()}
                </td>
                <td className="p-3 border">{appointment.appointment_time}</td>
                <td className="p-3 border">{appointment.status}</td>
                <td className="p-3 border">{appointment.problem}</td>
                {activeTab === "upcoming" && (
                  <td className="p-3 border flex justify-center gap-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded disabled:bg-gray-400"
                      onClick={() =>
                        updateAppointmentStatus(appointment.id, "accepted")
                      }
                      disabled={appointment.status === "accepted"}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded disabled:bg-gray-400"
                      onClick={() =>
                        updateAppointmentStatus(appointment.id, "cancelled")
                      }
                      disabled={appointment.status === "cancelled"}
                    >
                      Cancel
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
