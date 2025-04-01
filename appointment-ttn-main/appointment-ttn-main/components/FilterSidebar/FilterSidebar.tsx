"use client";
import { useSearchParams } from "next/navigation";
import styles from "./FilterSidebar.module.css";

type FilterSidebarProps = {
  onFilterChange: (filterKey: string, filterValue: string, checked: boolean) => void;
};

const FilterSidebar = ({ onFilterChange}: FilterSidebarProps) => {
  const searchParams = useSearchParams();

  const isChecked = (filterKey: string, filterValue: string) => {
    const filterValues = searchParams.getAll(filterKey);
    return filterValues.includes(filterValue);
  };

  const handleCheckboxChange = (filterKey: string, filterValue: string) => {
    const checked = !isChecked(filterKey, filterValue); 
    onFilterChange(filterKey, filterValue, checked);
  };
  

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filter By:</h3>
        <button className={styles.resetBtn} onClick={() => onFilterChange("", "", false)}>Reset</button>
      </div>

      <div className={styles.section}>
        <h4>Rating</h4>
        <ul>
          {[1, 2, 3, 4, 5].map((rating) => (
            <li key={rating}>
              <input
                type="checkbox"
                checked={isChecked("rating", rating.toString())}
                onChange={() => handleCheckboxChange("rating", rating.toString())}
              />
              {rating} Star
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h4>Experience</h4>
        <ul>
          {["16", "10-15", "5-10", "3-5", "1-3", "0-1"].map((exp) => (
            <li key={exp}>
              <input
                type="checkbox"
                checked={isChecked("experience", exp)}
                onChange={() => handleCheckboxChange("experience", exp)}
              />
              {exp} years
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h4>Gender</h4>
        <ul>
          {["male", "female", "others"].map((gender) => (
            <li key={gender}>
              <input
                type="checkbox"
                checked={isChecked("gender", gender)}
                onChange={() => handleCheckboxChange("gender", gender)}
              />
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default FilterSidebar;
