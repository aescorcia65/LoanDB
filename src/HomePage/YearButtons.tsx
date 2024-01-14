import React, { useState } from 'react';
import './HomePage.css';

function YearButtons() {
    const years = ["2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034"];
    const [selectedYears, setSelectedYears] = useState(Array(12).fill(false));

    const toggleYears = (index: any) => {
        const newSelectedYears = [...selectedYears];
        newSelectedYears[index] = !newSelectedYears[index];
        setSelectedYears(newSelectedYears);
    };

    return (
        <div>
            {years.map((year, index) => (
                <button
                    key={year}
                    className={selectedYears[index] ? 'selected' : ''}
                    onClick={() => toggleYears(index)}
                >
                    {year}
                </button>
            ))}
        </div>
    );
}

export default YearButtons;
