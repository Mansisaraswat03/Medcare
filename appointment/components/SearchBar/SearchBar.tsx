'use client';

import { useState } from 'react';
import styles from './SearchBar.module.css';

type SearchBarProps = {
  onSearch: (term: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [term, setTerm] = useState('');

  const handleSearch = () => {
    onSearch(term);
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search doctors"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleSearch} className={styles.button}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
