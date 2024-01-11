import React from 'react';
import styles from './MonthDropdown.module.css';

const MonthsDropdown: React.FC = () => {
    const months = ["ALL", "January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];

    return (
        <select className={styles.dropdown} defaultValue="">
            <option value="" disabled>
                Select a Month
            </option>
            {months.map((month, index) => (
                <option key={index} value={index + 1}>
                    {month}
                </option>
            ))}
        </select>
    );
};

export default MonthsDropdown;