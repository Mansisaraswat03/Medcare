"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./DoctorBooking.module.css";
import { useAuthContext } from "@/context/authContext";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  qualification: string;
  location: string;
  consultation_fee: string;
  gender: string;
  start_time: string;
  end_time: string;
  booked_slots: Record<string, string[]>;
  rating: string;
  profile: string;
}

interface PatientDetails {
  name: string;
  age: number;
  gender: string;
  address: string;
  contact: string;
}

const DoctorBooking = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [step, setStep] = useState(1);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("online");
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    name: "",
    age: 0,
    gender: "",
    address: "",
    contact: "",
  });
  const router =useRouter();
  const {auth_token} = useAuthContext()
  const handleReset = () => {
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentType("online");
    setPatientDetails({
      name: "",
      age: 0,
      gender: "",
      address: "",
      contact: "",
    });
  };
  const searchParams = useSearchParams();
  const id = searchParams.get("doctorId");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/doctors/${id}`
        );
        setDoctor(response.data.data);
      } catch (error) {
        console.error("Error fetching doctor details", error);
      }
    };
    id && fetchDoctor();
  }, [id]);

  const generateTimeSlots = () => {
    if (!doctor) return [];
    const slots = [];
    let startTime = new Date(`2024-01-01T${doctor.start_time}`);
    const endTime = new Date(`2024-01-01T${doctor.end_time}`);

    while (startTime < endTime) {
      const formattedTime = startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      slots.push(formattedTime);
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
    return slots;
  };

  const handleNext = () => {
    localStorage.setItem(
      "appointmentData",
      JSON.stringify({
        date: appointmentDate,
        time: appointmentTime,
        type: appointmentType,
        patient: patientDetails,
      })
    );
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };
  const isPatientDetailsValid = () => {
    return (
      patientDetails.name.trim() !== "" &&
      patientDetails.age > 0 &&
      patientDetails.gender.trim() !== "" &&
      patientDetails.address.trim() !== "" &&
      patientDetails.contact.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!isPatientDetailsValid()) {
        toast.error("Please fill in all patient details correctly.");
        return;
    }
    const payload = {
      doctor_id: doctor?.id,
      patient_id: 16,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      type: appointmentType,
      status: "pending",
      problem: "Regular checkup",
      patient_details: patientDetails,
    };
//TODO: add token from auth context
    try {
      const response =await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/appointments`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${auth_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      handleReset();
      router.push(`/appointments`);
      toast.success("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment", error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };
  const isFormValid = appointmentDate.trim() !== "" || appointmentTime.trim() !== "";
  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <h1>Book Your Next Doctor Visit in Seconds.</h1>
        <p>
          CareMate helps you find the best healthcare provider by specialty,
          location, and more, ensuring you get the care you need.
        </p>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.card}>
          {step === 1 ? (
            <>
              <h2>Schedule Appointment</h2>
              <img
                src={doctor?.profile}
                alt={doctor?.name}
                className={styles.profileImg}
              />
              <p className={styles.doctorInfo}>{doctor?.name}</p>
              <p className={styles.experience}>
                {doctor?.specialty} - {doctor?.experience} years
              </p>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${
                    appointmentType === "online" ? styles.active : ""
                  }`}
                  onClick={() => setAppointmentType("online")}
                >
                  Book Video Consult
                </button>
                <button
                  className={`${styles.tab} ${
                    appointmentType === "hospital" ? styles.active : ""
                  }`}
                  onClick={() => setAppointmentType("hospital")}
                >
                  Book Hospital Visit
                </button>
              </div>

              {appointmentType === "hospital" && doctor?.location && (
                <p className={styles.address}>
                  Hospital Address: {doctor.location}
                </p>
              )}

              <div className={styles.formGroup}>
                <label>Select Date:</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Select Time:</label>
                <div className={styles.timeSlots}>
                  {generateTimeSlots().map((slot) => (
                    <button
                      key={slot}
                      disabled={doctor?.booked_slots[appointmentDate]?.includes(
                        slot
                      )}
                      className={`${styles.timeSlot} ${
                        appointmentTime === slot ? styles.active : ""
                      }`}
                      onClick={() => setAppointmentTime(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button className={styles.button} onClick={handleNext} disabled={!isFormValid}>
                Next
              </button>
            </>
          ) : (
            <>
              <h2>Enter Patient Details</h2>
              <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  value={patientDetails.name}
                  onChange={(e) =>
                    setPatientDetails({
                      ...patientDetails,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Age:</label>
                <input
                  type="number"
                  value={patientDetails.age}
                  onChange={(e) =>
                    setPatientDetails({
                      ...patientDetails,
                      age: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Gender:</label>
                <input
                  type="text"
                  value={patientDetails.gender}
                  onChange={(e) =>
                    setPatientDetails({
                      ...patientDetails,
                      gender: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Address:</label>
                <input
                  type="text"
                  value={patientDetails.address}
                  onChange={(e) =>
                    setPatientDetails({
                      ...patientDetails,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Contact:</label>
                <input
                  type="text"
                  value={patientDetails.contact}
                  onChange={(e) =>
                    setPatientDetails({
                      ...patientDetails,
                      contact: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.buttonGroup}>
                <button className={styles.button} onClick={handleBack}>
                  Back
                </button>
                <button className={styles.button} onClick={handleSubmit} disabled={!isPatientDetailsValid()}>
                  Book Appointment
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorBooking;
