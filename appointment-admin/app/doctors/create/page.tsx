"use client";
import {useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthContext } from "@/context/authContext";

export default function CreateDoctor() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    experience: "",
    qualification: "",
    location: "",
    consultation_fee: "",
    gender: "",
    start_time: "",
    end_time: "",
    rating: 0,
    profile: null as File | null,
  });
  const [uploading, setUploading] = useState(false);
  const { auth_token } = useAuthContext();

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );
    formData.append(
      "cloud_name",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
    );

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let profileUrl = "";
      if (formData.profile) {
        profileUrl = await uploadToCloudinary(formData.profile);
      }

      const payload = {
        ...formData,
        profile: profileUrl,
      };

      console.log("Payload:", payload);
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/doctors`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Doctor created successfully");
      router.push("/doctors");
    } catch (error) {
      toast.error("Failed to create doctor");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, profile: e.target.files![0] }));
    }
  };

  return (
    <div className="min-h-screen py-8 bg-white">
      <div className="max-w-2xl mx-auto bg-gray-100  rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 ">Create New Doctor</h1>
        <form onSubmit={handleSubmit} className="space-y-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                required
                className="mt-1 block w-full rounded-md bord p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium ">Email</label>
              <input
                type="email"
                name="email"
                required
                className="mt-1 block w-full rounded-md  border-gray-600 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                required
                className="mt-1 block w-full rounded-md  border-gray-600 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Specialty</label>
              <input
                type="text"
                name="specialty"
                required
                className="mt-1 block w-full rounded-md  border-gray-600 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.specialty}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Experience (years)
              </label>
              <input
                type="number"
                name="experience"
                required
                className="mt-1 block w-full rounded-md  border-gray-600 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium ">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                required
                className="mt-1 block w-full rounded-md  border-gray-600 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.qualification}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium ">Location</label>
              <input
                type="text"
                name="location"
                required
                className="mt-1 block w-full rounded-md  border-gray-600 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Consultation Fee
              </label>
              <input
                type="number"
                name="consultation_fee"
                required
                className="mt-1 block w-full rounded-md  border-gray-600 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.consultation_fee}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium ">Gender</label>
              <select
                name="gender"
                required
                className="mt-1 block w-full rounded-md  border-gray-600 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Start Time</label>
              <input
                type="time"
                name="start_time"
                required
                className="mt-1 block w-full rounded-md  border-gray-600 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.start_time}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Time</label>
              <input
                type="time"
                name="end_time"
                required
                className="mt-1 block w-full rounded-md  border-gray-600 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.end_time}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Rating</label>
              <select
                name="rating"
                required
                className="mt-1 block w-full rounded-md  border-gray-600 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value="">Select rating</option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">
                Profile Picture
              </label>
              <input
                type="file"
                name="profile"
                accept="image/*"
                className="mt-1 block w-full p-2"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {uploading ? "Creating..." : "Create Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
