"use client";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./Pagination.module.css";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
};

const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.paginationContainer}>
      <button 
        className={styles.navButton} 
        onClick={() => goToPage(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        &lt; Prev
      </button>

      <div className={styles.pageNumbers}>
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              className={`${styles.pageButton} ${currentPage === pageNum ? styles.active : ""}`}
              onClick={() => goToPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button 
        className={styles.navButton} 
        onClick={() => goToPage(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
