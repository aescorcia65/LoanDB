import React from 'react';
import styles from './MonthDropdown.module.css';

const YearDropdown: React.FC = () => {
    const years = ["ALL", "2024", "2025", "2026", "2027", "2028", "2029", 
                    "2030", "2031", "2032", "2033", "2034"];

    return (
        <select className={styles.dropdown} defaultValue="">
            <option value="" disabled>
                Select a Year
            </option>
            {years.map((year, index) => (
                <option key={index} value={index + 1}>
                    {year}
                </option>
            ))}
        </select>
    );
};

export default YearDropdown;