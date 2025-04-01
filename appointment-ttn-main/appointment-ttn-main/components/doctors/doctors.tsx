"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import DoctorCard from "../DoctorCard/DoctorCard";
import FilterSidebar from "../FilterSidebar/FilterSidebar";
import SearchBar from "../SearchBar/SearchBar";
import DoctorSkeleton from "../skeleton/DoctorSkeleton";
import styles from "./DoctorPage.module.css";
import { Doctor } from "@/types/types";
import Pagination from "../pagination/pagination";
const LIMIT = 6;
const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = Object.fromEntries(searchParams.entries()); 
  const currentPage = Number(searchParams.get("page")) || 1; 

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/doctors`, {
        params: { ...filters, page: currentPage, limit: LIMIT },
      });
      setDoctors(response?.data?.data?.doctors || []);
      setTotalPages(response?.data?.data?.pagination?.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [searchParams]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (filterKey: string, filterValue: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams);

    if (checked) {
      params.append(filterKey, filterValue);
    } else {
      const values = params.getAll(filterKey).filter(val => val !== filterValue);
      params.delete(filterKey);
      values.forEach(val => params.append(filterKey, val));
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.mainHeading}>Find a doctor at your own ease</h2>

      <div className={styles.searchBarWrapper}>
        <SearchBar onSearch={handleSearch} />
      </div>

      <h3 className={styles.subHeading}>{doctors?.length} {doctors?.length < 2 ? "doctor" : "doctors"} available</h3>
      <p className={styles.description}>
        Book appointments with minimum wait-time & verified doctor details
      </p>

      <div className={styles.contentWrapper}>
        <aside className={styles.sidebar}>
          <FilterSidebar onFilterChange={handleFilterChange} />
        </aside>

        <section className={styles.doctorSection}>
          <div className={styles.doctorGrid}>
            {loading && Array.from({ length: 6 }).map((_, index) => <DoctorSkeleton key={index} />)}
            {!loading && doctors?.length === 0 && <p className="text-center">No doctors found!</p>}
            {!loading &&
              doctors?.length > 0 &&
              doctors.map((doctor, index) => (
                <DoctorCard key={index} {...doctor} />
              ))}
          </div>
        </section>
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
};

export default Doctors;
