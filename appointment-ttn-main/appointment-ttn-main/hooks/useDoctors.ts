"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Doctor {
  id?: string;
  name: string;
  email: string;
  password?: string;
  specialty: string;
  experience: number;
  qualification: string;
  location: string;
  consultation_fee: number;
  gender: string;
  start_time: string;
  end_time: string;
  booked_slots?: JSON;
  profile: string;
  rating?: number;
}

export const useDoctorService = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/doctors`
      );
      setDoctors(response.data.doctors);
    } catch (error) {
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const getDoctorById = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/doctors/${id}`
      );
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch doctor details");
      throw error;
    }
  };

  const createDoctor = async (doctorData: Doctor, handleReset: () => void) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/doctors`,
        doctorData
      );
      toast.success("Doctor created successfully");
      fetchDoctors();
      handleReset();
      return response.data;
    } catch (error) {
      toast.error("Failed to create doctor");
      throw error;
    }
  };

  const updateDoctor = async (
    id: string,
    updateData: Partial<Doctor>,
    handleReset: () => void
  ) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/doctors/${id}`,
        updateData
      );
      toast.success("Doctor updated successfully");
      fetchDoctors();
      handleReset();
      return response.data;
    } catch (error) {
      toast.error("Failed to update doctor");
      throw error;
    }
  };

  const deleteDoctor = async (id: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/doctors/${id}`
      );
      toast.success("Doctor deleted successfully");
      fetchDoctors();
    } catch (error) {
      toast.error("Failed to delete doctor");
      throw error;
    }
  };

  return { doctors, loading, fetchDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
};
